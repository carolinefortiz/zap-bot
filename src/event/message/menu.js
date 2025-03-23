const buildMenu = (menu, error) => {
  return [
    error ? null : menu.title,
    error ? error : menu.header,
    menu.items?.map((item) => item.label).join("\n"),
    error ? null : menu.footer,
  ]
    .filter(Boolean)
    .join("\n\n");
};

const getMenu = (menu, selectedOption) => {
  const selectedItem = menu.items?.find((item) => item.id === selectedOption);
  if (!selectedItem) return { error: menu.error };
  if (selectedItem.menu) return { submenu: selectedItem.menu };
  if (selectedItem.messages) return { messages: selectedItem.messages };
  return null;
};

module.exports = { buildMenu, getMenu };
