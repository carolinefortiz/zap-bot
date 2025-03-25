const { buildMenu, getMenu } = require("./menu");
const { wait } = require("../../core/time");
const config = require("../../../config/config.json");
const users = {};

const handler = async (client, message) => {
  const now = Date.now();
  const chat = await client.getChatById(message.from);
  const userId = message.from;
  const userMessage = message.body;
  const isMe = message.fromMe;
  const isPtt = message.type === "ptt";
  const isChat = message.type === "chat";
  const isValid = isPtt || isChat;
  const isGroup = message.from.includes("@g.us");
  const isStatus = message.from.includes("status@broadcast");
  users[userId] = users[userId] ?? { createdAt: now, sessionIsClosed: false, currentUserMenu: config.menu };
  const diff = now - users[userId].createdAt;
  const isNew = diff === 0;
  const isExpired = diff > config.chat.cycle.limit;

  if (isExpired) {
    users[userId] = { createdAt: now, sessionIsClosed: false, currentUserMenu: config.menu };
  }

  if (isMe || !isValid || isGroup || isStatus || users[userId].sessionIsClosed) {
    return;
  }

  console.info({
    userId,
    userMessage,
    isMe,
    isPtt,
    isChat,
    isValid,
    isGroup,
    isStatus,
    isNew,
    isExpired,
    ...users[userId],
  });

  await chat.sendStateTyping();
  await wait(1000);

  if (isNew || isExpired || isPtt) {
    await client.sendMessage(userId, buildMenu(users[userId].currentUserMenu));
    return chat.clearState();
  }

  const menu = getMenu(users[userId].currentUserMenu, userMessage);

  if (menu.error) {
    await client.sendMessage(userId, buildMenu(users[userId].currentUserMenu, menu.error));
    return chat.clearState();
  }

  if (menu.submenu) {
    users[userId] = { ...users[userId], currentUserMenu: menu.submenu };
    await client.sendMessage(userId, buildMenu(menu.submenu));
    return chat.clearState();
  }

  if (menu.messages) {
    users[userId] = { ...users[userId], sessionIsClosed: true, currentUserMenu: config.menu };
    for (const message of menu.messages) {
      await client.sendMessage(userId, message);
      await chat.clearState();
    }
  }
};

module.exports = handler;
