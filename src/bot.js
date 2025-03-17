const { Client, LocalAuth } = require("whatsapp-web.js");
const messageHandler = require("./event/message/handler");
const qrCodeHandler = require("./event/qr-code/handler");
const readyHandler = require("./event/ready/handler");

const client = new Client({ authStrategy: new LocalAuth() });

client.once("ready", () => readyHandler(client));
client.on("qr", (qrCode) => qrCodeHandler(client, qrCode));
client.on("message", (message) => messageHandler(client, message));

client.initialize();
