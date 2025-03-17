const { menu, submenu } = require("../../../config/config.json");

const items = Object.keys(menu.items).map((item) => menu.items[item].step);
const subitems = Object.keys(submenu.items).map((item) => submenu.items[item].step);
const mainMenu = [menu.title, menu.subtitle, ...items].join("\n");
const otherMenu = [menu.title, menu.otherSubtitle, ...items].join("\n");
const subMenu = [submenu.title, ...subitems].join("\n");

module.exports = { mainMenu, otherMenu, subMenu };
