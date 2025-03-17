const { mainMenu, otherMenu, subMenu } = require("./menu");
const { chat, menu, submenu } = require("../../../config/config.json");
const users = new Map();

const handler = async (client, message) => {
  const now = Date.now();
  const data = message.body;
  const userId = message.from;
  const isChat = message.type === "chat";

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
