const qrCodeTerminal = require("qrcode-terminal");

const handler = (_, qrCode) => {
  qrCodeTerminal.generate(qrCode, { small: true });
};

module.exports = handler;
