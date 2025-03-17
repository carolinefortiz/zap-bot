const { generate } = require("qrcode-terminal");

const handler = (_, qrCode) => {
  generate(qrCode, { small: true });
};

module.exports = handler;
