const { buildMenu, getMenu } = require("./menu");
const { wait } = require("../../core/time");
const config = require("../../../config/config.json");
const users = {};

const handler = async (client, message) => {
  const now = Date.now();
  const chat = await client.getChatById(message.from);
  const userId = message.from;
  const timeDiff = now - (users[userId]?.createdAt ?? now);
  const userMessage = message.body;
  const isMe = message.fromMe;
  const isPtt = message.type === "ptt";
  const isChat = message.type === "chat";
  const isValid = isPtt || isChat;
  const isGroup = message.from.includes("@g.us");
  const isStatus = message.from.includes("status@broadcast");
  const isExpired = timeDiff > config.chat.cycle.limit;
  const isIgnored = config.chat.user.ignored.includes(userId);

  if (!users[userId] || isExpired) {
    users[userId] = { isNew: true, createdAt: now, sessionIsClosed: false, currentUserMenu: config.menu };
  }

  if (isMe || !isValid || isGroup || isStatus || isIgnored || users[userId].sessionIsClosed) {
    return;
  }

  await chat.sendStateTyping();
  await wait(1000);

  if (isPtt || isExpired || users[userId].isNew) {
    users[userId] = { ...users[userId], isNew: false };
    await client.sendMessage(userId, buildMenu(users[userId].currentUserMenu));
    return chat.clearState();
  }

  const menu = getMenu(users[userId].currentUserMenu, userMessage);

  if (menu.error) {
    await client.sendMessage(userId, buildMenu(users[userId].currentUserMenu, menu.error));
    return chat.clearState();
  }

  if (menu.submenu) {
    users[userId] = { ...users[userId], isNew: false, currentUserMenu: menu.submenu };
    await client.sendMessage(userId, buildMenu(users[userId].currentUserMenu));
    return chat.clearState();
  }

  if (menu.messages) {
    users[userId] = { ...users[userId], isNew: false, sessionIsClosed: true, currentUserMenu: config.menu };
    for (const message of menu.messages) {
      await client.sendMessage(userId, message);
      await chat.clearState();
    }
  }
};

module.exports = handler;
