const qrcode = require("qrcode");

const handler = async (_, qrCode) => {
  try {
    await qrcode.toFile("./qrcode.png", qrCode);
    console.log("QR Code saved as qrcode.png");
  } catch (err) {
    console.error(err);
  }
};

module.exports = handler;
