export const createIdLookup = (objArr) => {
  const lookup = {};
  objArr.forEach((obj) => {
    lookup[obj.id] = { ...obj };
  });
  return lookup;
};

export const stripFields = (obj, keys) => {
  let new_obj = {};

  for (const key in obj)
    if (!keys.find((unwanted_key) => key === unwanted_key))
      new_obj[key] = obj[key];

  return new_obj;
};

export const stripObjects = (obj) => {
  let new_obj = {};

  for (const key in obj)
    if (typeof obj[key] !== "object") new_obj[key] = obj[key];

  return new_obj;
};

export const pushBlocksFrom = (targ_order, delta, items) => {
  return delta > 0
    ? items.map((item) => {
        const new_item = { ...item };
        if (new_item.block_data.order <= targ_order)
          new_item.block_data.order--;
        return new_item;
      })
    : items.map((item) => {
        const new_item = { ...item };
        if (new_item.block_data.order >= targ_order)
          new_item.block_data.order++;
        return new_item;
      });
};

export const sortBlocksOnOrder = (items) => {
  return [
    ...items
      .sort((a, b) => a.block_data.order - b.block_data.order)
      .map((item, index) => ({
        ...item,
        block_data: { ...item.block_data, order: index },
      })),
  ];
};

export const parseBlock = (block) => {
  const block_data = stripFields(block, ["__typename", "options", "payload"]);
  const options_data =
    block.options && block.options !== ""
      ? JSON.parse(atob(block.options))
      : {};

  const payload_data = block.payload
    ? stripFields(block.payload, ["__typename"])
    : null;

  return {
    id: block_data.id.toString(),
    block_data,
    options_data,
    payload_data,
  };
};

export const getNavSiblings = (items, move_item) => {
  let siblings = [];

  items.forEach((item) => {
    if (
      !(item.lft < move_item.lft && item.rgt > move_item.rgt) &&
      !(item.lft > move_item.lft && item.rgt < move_item.rgt)
    )
      siblings.push(item);
  });

  return sortNav(siblings);
};

export const sortNav = (items, prop = "lft", desc = true) => {
  return [
    ...items.sort((a, b) => (desc ? a[prop] - b[prop] : b[prop] - a[prop])),
  ];
};

export const applyThemeSettings = (theme, settings) => {
  const new_theme = { ...theme };

  if (settings.header_logo) {
    if (!new_theme.custom) new_theme.custom = {};

    new_theme.custom.header_logo = settings.header_logo;
  }

  if (settings.primary_color) {
    if (!new_theme.palette) new_theme.palette = {};
    if (!new_theme.palette.primary) new_theme.palette.primary = {};

    new_theme.palette.primary.main = settings.primary_color;
  }

  if (settings.secondary_color) {
    if (!new_theme.palette) new_theme.palette = {};
    if (!new_theme.palette.secondary) new_theme.palette.secondary = {};
    new_theme.palette.secondary.main = settings.secondary_color;
  }

  if (settings.main_font) {
    if (!new_theme.typography) new_theme.typography = {};
    new_theme.typography.fontFamily = [
      settings.main_font,
      "Helvetica",
      "Arial",
      "sans-serif",
    ].join(",");
  }

  return new_theme;
};
