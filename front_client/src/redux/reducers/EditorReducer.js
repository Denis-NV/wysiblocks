import { SET_SITE_EDIT_MODE } from "../Types";

const initialState = {
  is_edit_mode: false,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_SITE_EDIT_MODE:
      return {
        ...state,
        deleted_blocks: [],
        is_edit_mode: payload,
      };
    default:
      return state;
  }
}
