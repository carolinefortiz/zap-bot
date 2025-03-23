const buildMenu = (menu, error) => {
  return [
    error ? null : menu.header,
    error ? error : menu.subheader,
    menu.items?.map((item) => item.label).join("\n"),
    error ? null : menu.footer,
  ]
    .filter(Boolean)
    .join("\n\n");
};

const getMenu = (menu, choice) => {
  const selectedItem = menu.items.find((item) => item.id === choice);
  if (!selectedItem) return { error: menu.error };
  if (selectedItem.menu) return { menu: selectedItem.menu };
  if (selectedItem.messages) return { messages: selectedItem.messages };
  return null;
};

module.exports = { buildMenu, getMenu };
