const handler = (message) => {
  client.sendMessage(message.from, "Não atendo no momento");
};

module.exports = handler;
