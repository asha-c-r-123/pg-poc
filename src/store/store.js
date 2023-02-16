import { createStore, applyMiddleware } from "redux";
import thunk from "redux-thunk";
import { composeWithDevTools } from "redux-devtools-extension";
import rootReducer from "./reducers";
import { createLogger } from "redux-logger";

const initalState = {};

const loggerMiddleware = createLogger();

const middleware = [thunk, loggerMiddleware];
const store = createStore(
  rootReducer,
  initalState,
  composeWithDevTools(applyMiddleware(...middleware))
);

export default store;
