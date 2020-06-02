import { UPDATE_THEME } from "../Types";

const initialState = {
  palette: {
    text: {
      primary: "#252525",
    },
    background: {
      dark: "#414c5d",
    },
  },
  transitions: { duration: { shortest: 100 } },
  typography: {
    fontSize: 14,
    h1: {
      fontWeight: 400,
      fontSize: "4rem",
    },
    h2: {
      fontWeight: 500,
      fontSize: "3rem",
    },
    h4: {
      fontWeight: 450,
    },
    h5: {
      fontSize: "1.75rem",
      fontWeight: 450,
    },
  },
  zIndex: {
    blockInstruments: 100,
    bgImageBtn: 110,
    addBlockBtns: 500,
    editLinks: 501,
    header: 510,
    editTextfiledCtrls: 520,
  },
  custom: {
    itemFeed: {
      first: 10,
      offset: 200,
    },
  },
};

export default function (state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case UPDATE_THEME:
      return {
        ...state,
        ...payload,
      };
    default:
      return state;
  }
}
