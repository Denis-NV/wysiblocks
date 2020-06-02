import {
  SET_SITE_DATA,
  UPDATE_SITE_BLOCK_DATA,
  UPDATE_PAGES_DATA,
  UPDATE_NAV_DATA,
  SET_CONTENT_BLOCK_TYPES_DATA,
  SET_SITE_BLOCK_TYPES_DATA,
  SET_FONT_STATUS,
} from "../Types";

const initialState = {
  site_id: 0,
  font_is_ready: false,

  content_block_types_data: null,
  site_block_types_data: {},
  site_blocks: null,
  pages: null,
  nav: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_CONTENT_BLOCK_TYPES_DATA:
      return {
        ...state,
        content_block_types_data: payload,
      };
    case SET_SITE_BLOCK_TYPES_DATA:
      return {
        ...state,
        site_block_types_data: {
          ...state.site_block_types_data,
          [payload.type]: payload.items,
        },
      };
    case SET_SITE_DATA:
      const { site_blocks_lookup, nav_items, pages_lookup } = payload;

      return {
        ...state,
        site_blocks: { ...site_blocks_lookup },
        nav: [...nav_items],
        pages: { ...pages_lookup },
      };
    case UPDATE_PAGES_DATA:
      return {
        ...state,
        pages: { ...payload },
      };
    case UPDATE_NAV_DATA:
      return {
        ...state,
        nav: [...payload],
      };

    case UPDATE_SITE_BLOCK_DATA:
      return {
        ...state,
        site_blocks: {
          ...state.site_blocks,
          [payload.id]: payload,
        },
      };
    case SET_FONT_STATUS:
      return {
        ...state,
        font_is_ready: payload,
      };
    default:
      return state;
  }
}
