import { combineReducers } from "redux"
import userStore from "./userStore";
const rootReducer = combineReducers({ userStore })
export default rootReducer