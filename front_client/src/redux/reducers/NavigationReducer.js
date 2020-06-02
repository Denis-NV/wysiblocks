import { SET_CURRENT_PATH, SET_LOCKED_PAGE_ID } from "../Types";

const initialState = {
  current_path: "",
  locked_page_id: "",
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_CURRENT_PATH:
      return {
        ...state,
        current_path: payload,
      };
    case SET_LOCKED_PAGE_ID:
      return {
        ...state,
        locked_page_id: payload,
      };
    default:
      return state;
  }
}
