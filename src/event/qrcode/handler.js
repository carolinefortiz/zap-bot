const qrcodeTerminal = require("qrcode-terminal");

const handler = (qr) => {
  qrcodeTerminal.generate(qr, { small: true });
};

module.exports = handler;
