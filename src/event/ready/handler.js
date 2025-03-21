const { existsSync, unlinkSync } = require("node:fs");
const { watch } = require("../../core/monitor");

const handler = async () => {
  if (existsSync("./qr-code.png")) unlinkSync("./qr-code.png");
  setInterval(watch, 10000);
  console.log("O Bot iniciou com sucesso!");
};

module.exports = handler;
