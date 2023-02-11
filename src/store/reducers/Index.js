import todoReducers from "./Reducers";
import GetDataReducer from "./GetDataReducer";
import { combineReducers } from "redux";

const rootReducers = combineReducers({
  todoReducers,
  GetDataReducer,
});

export default rootReducers;
