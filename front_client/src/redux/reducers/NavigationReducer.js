import { SET_CURRENT_ADDRESS, SET_LOCKED_PAGE_ID } from "../Types";

const initialState = {
  current_address: "",
  locked_page_id: "",
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_CURRENT_ADDRESS:
      return {
        ...state,
        current_address: payload,
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
