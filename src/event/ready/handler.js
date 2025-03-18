const { existsSync, unlinkSync } = require("node:fs");

const handler = async () => {
  if (existsSync("./qr-code.png")) unlinkSync("./qr-code.png");
  console.log("O Bot iniciou com sucesso!");
};

module.exports = handler;
