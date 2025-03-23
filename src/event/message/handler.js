const { buildMenu, getMenu } = require("./menu");
const { wait } = require("../../core/time");
const config = require("../../../config/config.json");
const users = new Map();

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

  await chat.sendStateTyping();
  await wait(5000);

  if (!users.has(userId)) {
    users.set(userId, {
      createdAt: now,
      sessionIsClosed: false,
      currentUserMenu: config.menu,
    });
  }

  const { createdAt, sessionIsClosed, currentUserMenu } = users.get(userId);
  const diff = now - createdAt;
  const isNew = diff === 0;
  const isExpired = diff > config.chat.cycle.limit;

  if (isExpired) {
    users.set(userId, {
      createdAt: now,
      sessionIsClosed: false,
      currentUserMenu: config.menu,
    });
  }

  if (isMe || !isValid || isGroup || isStatus) {
    return chat.clearState();
  }

  if (isNew || isExpired || (!isChat && !sessionIsClosed)) {
    await chat.clearState();
    return client.sendMessage(userId, buildMenu(currentUserMenu));
  }

  if (!isExpired && sessionIsClosed) {
    return chat.clearState();
  }

  const menu = getMenu(currentUserMenu, userMessage);

  if (menu.error) {
    await chat.clearState();
    return client.sendMessage(userId, buildMenu(currentUserMenu, menu.error));
  }

  if (menu.submenu) {
    users.set(userId, {
      createdAt,
      sessionIsClosed,
      currentUserMenu: menu.submenu,
    });
    await chat.clearState();
    return client.sendMessage(userId, buildMenu(menu.submenu));
  }

  if (menu.messages) {
    users.set(userId, {
      createdAt,
      sessionIsClosed: true,
      currentUserMenu: config.menu,
    });
    await chat.clearState();
    for (const message of menu.messages) {
      await client.sendMessage(userId, message);
    }
  }
};

module.exports = handler;
