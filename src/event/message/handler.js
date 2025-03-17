const { mainMenu, otherMenu } = require("./menu");
const { chat, menu } = require("../../../config/config.json");
const users = new Map();

const handler = async (client, message) => {
  const now = Date.now();
  const data = message.body;
  const userId = message.from;
  const isChat = message.type === "chat";

  if (!users.has(userId)) {
    users.set(userId, { time: now, wasSent: false });
  }

  const { time, wasSent } = users.get(userId);
  const diff = now - time;
  const isNew = diff === 0;
  const isExpired = diff > chat.cycle.limit;

  if ((!isChat && !wasSent) || isNew || isExpired) {
    return client.sendMessage(message.from, mainMenu);
  }

  if (!isExpired && wasSent) {
    return;
  }

  for (const item in menu.items) {
    if (String(data) === String(item)) {
      users.set(userId, { time, wasSent: true });
      return client.sendMessage(userId, menu.items[item].message);
    }
  }

  return client.sendMessage(message.from, otherMenu);
};

module.exports = handler;
