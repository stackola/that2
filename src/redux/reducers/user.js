//Reducers: Manages data, state
import createReducer from "../lib/createReducer";
import * as types from "../actions/types";
import { combineReducers } from "redux";

//Define name and default value
export const user = createReducer(
  { username: "Anon", subs: [] },
  {
    [types.SET_USER_OBJECT](state, action) {
      return { subs: state.subs, ...action.payload };
    },
    [types.SET_SUBS](state, action) {
      return { ...state, subs: action.payload };
    }
  }
);
