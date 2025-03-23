const { buildMenu, getMenu } = require("./menu");
const { wait, history } = require("../../core");
const { chat, menu } = require("../../../config/config.json");
const users = new Map();

const handler = async (client, message) => {
  // await wait(2000);

  const now = Date.now();
  const data = message.body;
  const userId = message.from;
  const isMe = message.fromMe;
  const isPtt = message.type === "ptt";
  const isChat = message.type === "chat";
  const isValid = isPtt || isChat;
  const isGroup = message.from.includes("@g.us");
  const isStatus = message.from.includes("status@broadcast");

  // if (history.lastUserId === userId) {
  //   return;
  // }

  // history.lastUserId = userId;

  if (isMe || !isValid || isGroup || isStatus) {
    return;
  }

  if (!users.has(userId)) {
    users.set(userId, { time: now, wasSent: false, currentMenu: menu });
  }

  const { time, wasSent, currentMenu } = users.get(userId);
  const diff = now - time;
  const isNew = diff === 0;
  const isExpired = diff > chat.cycle.limit;

  if (isExpired) {
    users.set(userId, { time: now, wasSent: false, currentMenu: menu });
  }

  if (isNew || isExpired || (!isChat && !wasSent)) {
    return client.sendMessage(userId, buildMenu(currentMenu));
  }

  if (!isExpired && wasSent) {
    return;
  }

  const result = getMenu(currentMenu, data);

  if (result.error) {
    return client.sendMessage(userId, buildMenu(currentMenu, result.error));
  }

  if (result.menu) {
    users.set(userId, { time, wasSent, currentMenu: result.menu });
    return client.sendMessage(userId, buildMenu(result.menu));
  }

  if (result.messages) {
    users.set(userId, { time, wasSent: true, currentMenu: menu });
    for (const message of result.messages) {
      await client.sendMessage(userId, message);
    }
  }
};

module.exports = handler;
