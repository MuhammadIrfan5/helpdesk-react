import todoReducers from "./Reducers";
import GetDataReducer from "./GetDataReducer";
import UserLogin from "./UserLogin";
import { combineReducers } from "redux";

const rootReducers = combineReducers({
  todoReducers,
  GetDataReducer,
  // UserLogin,
});

export default rootReducers;
