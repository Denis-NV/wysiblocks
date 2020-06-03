import { SET_SITE_EDIT_MODE } from "../Types";

const initialState = {
  is_edit_mode: false,
  cur_key: "live",
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_SITE_EDIT_MODE:
      return {
        ...state,
        is_edit_mode: payload,
        cur_key: payload ? "draft" : "live",
      };
    default:
      return state;
  }
}
