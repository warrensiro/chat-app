import { combineReducers } from "redux";
import storage from "redux-persist/lib/storage";
import appReducer from "./Slices/app";
import authReducer from "./Slices/auth";
import conversationReducer from "./Slices/conversation";

// slices

const rootPersistConfig = {
  key: "root",
  storage,
  keyPrefix: "redux-",
  // whitelist: [],
  // blacklist: []
};

const rootReducer = combineReducers({
  app: appReducer,
  auth: authReducer,
  conversation: conversationReducer,
});

export { rootPersistConfig, rootReducer };
