const qrCode = require("qrcode");

const handler = async (_, qr) => {
  await qrCode.toFile("./qr-code.png", qr);
  console.log("O QR Code foi gerado com sucesso!");
};

module.exports = handler;
