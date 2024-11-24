import { combineReducers } from "redux";
import memberReducer from "./member.reducer";

const allReducers = combineReducers({
  memberReducer
});

export default allReducers;