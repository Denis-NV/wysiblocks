import { TOGGLE_DATA_SAVING_UI, SET_NAV_WARNING } from "../Types";

const initialState = {
  savingData: false,
  navigation_warning: { show: false, path: "" },
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case TOGGLE_DATA_SAVING_UI:
      console.log("SHOW SAVING SPINNER: ", payload);

      return {
        ...state,
        savingData: payload,
      };
    case SET_NAV_WARNING:
      return {
        ...state,
        navigation_warning: { ...payload },
      };
    default:
      return state;
  }
}
