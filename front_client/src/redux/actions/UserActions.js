import {
  SET_USER,
  SET_CALLS_APPLICATIONS_STATE,
  SET_SHOPPING_CALLS_APPLICATIONS_STATE,
  SET_ADMIN_RIGHTS,
} from "../Types";

// Utils
import jwt from "jsonwebtoken";
import axios from "axios";

const storage_keys = {
  ca: "calls_applications",
  sca: "shopping_calls_applications",
};

export const setUser = (token, id_token) => (dispatch, getState) => {
  const user = getState().User;

  if (user.token !== token && id_token) {
    const profile = jwt.decode(id_token);

    dispatch({ type: SET_USER, payload: { token, id_token, profile } });

    const user_data = window.localStorage.getItem(profile.preferred_username);

    if (user_data) dispatch(restoreLocalUserData(JSON.parse(user_data)));
  }
};

export const restoreLocalUserData = (data) => (dispatch) => {
  if (data[storage_keys.ca]) {
    dispatch({
      type: SET_CALLS_APPLICATIONS_STATE,
      payload: data[storage_keys.ca],
    });
  }

  if (data[storage_keys.sca]) {
    dispatch({
      type: SET_SHOPPING_CALLS_APPLICATIONS_STATE,
      payload: data[storage_keys.sca],
    });
  }

  // TODO: don't forget to remove next line
  // dispatch(setShoppingCallData(84, "submitted", false));
  // dispatch(setShoppingCallData(84, "submit_errors", { error: "" }));
};

export const storeLocalUserData = (preferred_username, key, data) => (
  dispatch
) => {
  const new_raw_data = window.localStorage.getItem(preferred_username);
  const new_data = new_raw_data ? JSON.parse(new_raw_data) : {};

  new_data[key] = { ...data };

  window.localStorage.removeItem(preferred_username);
  window.localStorage.setItem(preferred_username, JSON.stringify(new_data));
};

export const setAdminMode = (is_admin) => (dispatch) => {
  dispatch({ type: SET_ADMIN_RIGHTS, payload: is_admin });
};

export const setShoppingCallData = (call_id, key, value) => (
  dispatch,
  getState
) => {
  const user = getState().User;

  if (user.profile.preferred_username) {
    const new_applications = { ...user.shopping_calls_applications };

    if (key) new_applications[call_id][key] = value;
    else new_applications[call_id] = { step: null };

    dispatch({
      type: SET_SHOPPING_CALLS_APPLICATIONS_STATE,
      payload: new_applications,
    });
    dispatch(
      storeLocalUserData(
        user.profile.preferred_username,
        storage_keys.sca,
        new_applications
      )
    );
  }
};

export const editShoppingCallBasket = (call_id, item) => (
  dispatch,
  getState
) => {
  const user = getState().User;

  if (user.profile.preferred_username) {
    const new_basket = [
      ...(user.shopping_calls_applications[call_id].basket || []),
    ];
    const existing_ind = new_basket.findIndex(
      (ex_item) => ex_item.id === item.id
    );

    if (existing_ind > -1) {
      new_basket.splice(existing_ind, 1);
    } else {
      const fields = item.reagent_field_dataList || [];
      const getFieldIndex = (ref) =>
        fields.findIndex((field) => field.reagent_fieldList[0].ref === ref);
      const genbank = fields[getFieldIndex("genbank")]
        ? fields[getFieldIndex("genbank")].data
        : "";
      const uniprotid = fields[getFieldIndex("uniprotid")]
        ? fields[getFieldIndex("uniprotid")].data
        : "";

      const parsed_item = {
        id: item.id,
        name: item.name,
        sku: item.sku,
        genbank,
        uniprotid,
      };

      new_basket.push(parsed_item);
    }

    dispatch(setShoppingCallData(call_id, "basket", new_basket));
  }
};

export const editShoppingCallForm = (call_id, id, value) => (
  dispatch,
  getState
) => {
  const user = getState().User;

  if (user.profile.preferred_username) {
    if (id > -1) {
      const new_form = {
        ...(user.shopping_calls_applications[call_id].form || {}),
      };

      new_form[id] = value;

      dispatch(setShoppingCallData(call_id, "form", new_form));
    } else {
      dispatch(setShoppingCallData(call_id, "form_title", value));
    }
  }
};

export const setShoppingCallUIState = (call_id, ui_id, is_loading) => (
  dispatch,
  getState
) => {
  const user = getState().User;

  if (user.profile.preferred_username) {
    const new_ui_state = {
      ...(user.shopping_calls_applications[call_id].ui_state || {}),
    };

    new_ui_state[ui_id] = is_loading;

    dispatch(setShoppingCallData(call_id, "ui_state", new_ui_state));
  }
};

export const submitShoppingCallApplication = (
  call_id,
  basket_id,
  url,
  token
) => (dispatch, getState) => {
  const user = getState().User;

  if (user.profile.preferred_username) {
    const application = user.shopping_calls_applications[call_id];

    const bodyFormData = new FormData();
    const base_url = `${url}/${call_id}/application`;
    const parsed_title = application.form_title;
    const parsed_basket = JSON.stringify(application.basket);

    bodyFormData.set("title", parsed_title);
    bodyFormData.set(`data[${basket_id}]`, parsed_basket);

    console.log("title", parsed_title);
    console.log(`data[${basket_id}]`, parsed_basket);

    Object.entries(application.form).forEach(([key, value]) => {
      let parsed_value = "";

      switch (value.type) {
        case 13:
          parsed_value = JSON.stringify([
            ...value.selection.filter((item) => item !== "Other"),
            value.other,
          ]);
          break;
        case 16:
          const date = new Date(value.date);
          parsed_value = `${date.getDate().toString().padStart(2, "0")}-${(
            date.getMonth() + 1
          )
            .toString()
            .padStart(2, "0")}-${date.getFullYear()}`;
          break;
        default:
          parsed_value = JSON.stringify(value);
      }

      bodyFormData.set(`data[${key}]`, parsed_value);

      console.log(`data[${key}]`, parsed_value);
    });

    dispatch(setShoppingCallUIState(call_id, "submit", true));
    dispatch(setShoppingCallData(call_id, "submit_errors", null));

    axios({
      method: "post",
      url: base_url,
      data: bodyFormData,
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((res) => {
        console.log("Application created: ", res.data);

        return axios({
          method: "post",
          url: `${base_url}/${res.data.id}/submit`,
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        });
      })
      .then((res) => {
        console.log("Application submitted: ", res.data);

        dispatch(setShoppingCallUIState(call_id, "submit", false));
        dispatch(setShoppingCallData(call_id, "submitted", true));
        dispatch(setShoppingCallData(call_id, "app_id", res.data.id));
      })
      .catch((err) => {
        dispatch(setShoppingCallUIState(call_id, "submit", false));
        dispatch(setShoppingCallData(call_id, "submit_errors", err));

        console.dir(err);
      });

    // setTimeout(() => {
    //   dispatch(setShoppingCallUIState(call_id, "submit", false));
    //   dispatch(setShoppingCallData(call_id, "submitted", false));
    //   dispatch(setShoppingCallData(call_id, "app_id", 666));
    // }, 1000);
  }
};
