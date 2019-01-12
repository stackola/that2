import * as types from "./types";
import firebase from "react-native-firebase";
import { getUID } from "That/src/lib";
import { combineReducers } from "redux";
//We have to define action types in types.js, here we make them available as functions that can be mapped to props.
export function setUserObject(user) {
  return {
    type: types.SET_USER_OBJECT,
    payload: user
  };
}

export function setSubs(subs) {
  return {
    type: types.SET_SUBS,
    payload: subs
  };
}

export function userSubscribe(cb) {
  let uid = firebase.auth().currentUser.uid;
  return (dispatch, getState) => {
    firebase
      .firestore()
      .collection("users")
      .doc(uid)
      .collection("saved")
      .onSnapshot(doc => {
        console.log(doc);
        if (!doc._docs) {
          dispatch(setSubs([]));
        } else {
          dispatch(
            setSubs(
              doc._docs.map(d => {
                return d._data.path;
              })
            )
          );
          cb();
        }
      });
  };
}

/*
Example of an async function
export function click(id){
	return (dispatch, getState) => {
		let state=getState();		
		state.socket.socket.get('/user/click/14', function(body, jwr){
			//Dispatch redux action.
			dispatch(setUsername(body.username));
		} );
	}
}
*/
