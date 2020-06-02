import { SET_HEADER_HEIGHT } from "../Types";

const initialState = {
  header_height: 0,
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_HEADER_HEIGHT:
      return {
        ...state,
        header_height: payload,
      };
    default:
      return state;
  }
}
