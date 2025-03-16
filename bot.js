const whatsappWebJs = require("whatsapp-web.js");
const messageHandler = require("./src/event/message/handler");
const qrcodeHandler = require("./src/event/qrcode/handler");
const readyHandler = require("./src/event/ready/handler");

const client = new whatsappWebJs.Client();

client.once("ready", readyHandler);
client.on("qr", qrcodeHandler);
client.on("message", messageHandler);
client.initialize();
