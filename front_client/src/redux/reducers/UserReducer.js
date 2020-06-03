import {
  SET_USER,
  SET_ADMIN_RIGHTS,
  SET_CALLS_APPLICATIONS_STATE,
  SET_SHOPPING_CALLS_APPLICATIONS_STATE,
} from "../Types";

const initialState = {
  token: "",
  id_token: "",
  profile: {},
  is_admin: true,
  calls_applications: {},
  shopping_calls_applications: {},
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case SET_USER:
      return {
        ...state,
        token: payload.token,
        id_token: payload.id_token,
        profile: payload.profile,
      };
    case SET_ADMIN_RIGHTS:
      return {
        ...state,
        is_admin: payload,
      };
    case SET_CALLS_APPLICATIONS_STATE:
      return {
        ...state,
        calls_applications: payload,
      };
    case SET_SHOPPING_CALLS_APPLICATIONS_STATE:
      return {
        ...state,
        shopping_calls_applications: payload,
      };
    default:
      return state;
  }
}
