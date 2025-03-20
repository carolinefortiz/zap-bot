const { mainMenu, otherMenu, subMenu } = require("./menu");
const { chat, menu, submenu } = require("../../../config/config.json");
const { wait, history } = require("../../core");
const users = new Map();

const handler = async (client, message) => {
  await wait(2000);

  const now = Date.now();
  const data = message.body;
  const userId = message.from;
  const isMe = message.fromMe;
  const isPtt = message.type === "ptt";
  const isChat = message.type === "chat";
  const isValid = isPtt || isChat;
  const isGroup = message.from.includes("@g.us");
  const isStatus = message.from.includes("status@broadcast");

  if (history.lastUserId === userId) {
    return;
  }

  history.lastUserId = userId;

  if (isMe || !isValid || isGroup || isStatus) {
    return;
  }

  if (!users.has(userId)) {
    users.set(userId, { time: now, wasSent: false, isSubmenu: false });
  }

  const { time, wasSent, isSubmenu } = users.get(userId);
  const diff = now - time;
  const isNew = diff === 0;
  const isExpired = diff > chat.cycle.limit;

  if (isExpired) {
    users.set(userId, { time: now, wasSent: false, isSubmenu: false });
  }

  if (isNew || isExpired || (!isChat && !wasSent)) {
    return client.sendMessage(userId, mainMenu);
  }

  if (!isExpired && wasSent) {
    return;
  }

  for (const item in menu.items) {
    if (String(data) === String(item) && !isSubmenu) {
      if (menu.items[item].message) {
        users.set(userId, { time, wasSent: true, isSubmenu });
        return client.sendMessage(userId, menu.items[item].message);
      }

      if (menu.items[item].submenu) {
        users.set(userId, { time, wasSent, isSubmenu: true });
        return client.sendMessage(userId, subMenu);
      }
    }
  }

  for (const item in submenu.items) {
    if (String(data) === String(item) && isSubmenu) {
      users.set(userId, { time, wasSent: true, isSubmenu });
      await client.sendMessage(userId, submenu.items[item].message);
      return client.sendMessage(userId, submenu.items[item].otherMessage);
    }
  }

  return client.sendMessage(userId, otherMenu);
};

module.exports = handler;
