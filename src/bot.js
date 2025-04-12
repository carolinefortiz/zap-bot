const { Client, LocalAuth } = require("whatsapp-web.js");
const messageHandler = require("./event/message/handler");
const qrCodeHandler = require("./event/qr-code/handler");
const readyHandler = require("./event/ready/handler");

const client = new Client({
  authStrategy: new LocalAuth(),
  puppeteer: { headless: true, args: ["--no-sandbox", "--disable-setuid-sandbox"] },
});

client.once("ready", async () => readyHandler(client));
client.on("qr", async (qr) => qrCodeHandler(client, qr));
client.on("message_create", async (message) => messageHandler(client, message));

client.initialize();
