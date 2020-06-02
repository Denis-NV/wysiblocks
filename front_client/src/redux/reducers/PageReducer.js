import {
  SET_BLOCKS_DATA,
  UPDATE_BLOCKS_DATA,
  RESET_BLOCKS_DATA,
  RESET_BLOCKS_TO_DELETE,
} from "../Types";

const initialState = {
  page_blocks: {},
  deleted_blocks: [],
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_BLOCKS_DATA:
      return {
        ...state,
        deleted_blocks: [],
        page_blocks: {
          ...state.page_blocks,
          ...payload.page_blocks_lookup,
        },
      };
    case UPDATE_BLOCKS_DATA:
      return {
        ...state,
        deleted_blocks: payload.deleted_blocks,
        page_blocks: {
          ...state.page_blocks,
          ...payload.page_blocks_lookup,
        },
      };
    case RESET_BLOCKS_DATA:
      return {
        ...state,
        page_blocks: {},
      };
    case RESET_BLOCKS_TO_DELETE:
      return {
        ...state,
        deleted_blocks: [],
      };

    default:
      return state;
  }
}
