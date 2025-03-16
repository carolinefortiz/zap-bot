const handler = (message) => {
  client.sendMessage(message.from, "No momento não estou disponível");
};

module.exports = handler;
