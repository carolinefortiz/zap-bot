const { menu } = require("../../../config/config.json");

const items = Object.keys(menu.items).map((item) => menu.items[item].step);
const mainMenu = [menu.title, menu.subtitle, ...items].join("\n");
const otherMenu = [menu.title, menu.otherSubtitle, ...items].join("\n");

module.exports = { mainMenu, otherMenu };
