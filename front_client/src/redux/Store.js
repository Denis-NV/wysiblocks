import { createStore, combineReducers, applyMiddleware } from "redux";
import { composeWithDevTools } from "redux-devtools-extension/developmentOnly";
import thunk from "redux-thunk";

// Reducers
import UIReducer from "./reducers/UIReducer";
import SiteReducer from "./reducers/SiteReducer";
import PageReducer from "./reducers/PageReducer";
import NavigationReducer from "./reducers/NavigationReducer";
import ThemeReducer from "./reducers/ThemeReducer";
import UserReducer from "./reducers/UserReducer";
import EditorReducer from "./reducers/EditorReducer";
import LayoutReducer from "./reducers/LayoutReducer";

//
const initialState = {};

const middleware = [thunk];

// capital S in store.js
const reducers = combineReducers({
  Site: SiteReducer,
  Page: PageReducer,
  Nav: NavigationReducer,
  User: UserReducer,
  UI: UIReducer,
  Theme: ThemeReducer,
  Editor: EditorReducer,
  Layout: LayoutReducer,
});

const store = createStore(
  reducers,
  initialState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
