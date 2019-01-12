import firebase from "react-native-firebase";
const sendPost = firebase.functions().httpsCallable("post");
const sendUser = firebase.functions().httpsCallable("sendUser");
const uuidv4 = require("uuid/v4");

import { ToastAndroid } from "react-native";

import hash from "material-color-hash";
export function getUID() {
  if (getUser()) {
    return getUser().uid;
  } else {
    return null;
  }
}

export function getDoc(path) {
  return firebase
    .firestore()
    .doc(path)
    .get();
}
export function getUser() {
  if (firebase.auth().currentUser !== null) {
    return firebase.auth().currentUser;
  } else {
    return null;
  }
}

export function post(text, image, path, isMessage) {
  console.log(getUser());
  console.log("GO");
  return sendPost({ text, path, image, isMessage })
    .then(r => {
      //console.log(r);
      if (!isMessage) {
        doSave(path, true, false);
        doSave(r.data.newPath, true, false);
      }
      return r;
    })
    .catch(err => {
      console.log(err);
    });
}

export function getPosts(path, number, coll, sort = "updated", after) {
  //console.log({path, number, coll});
  //console.log("trying");
  let r = firebase
    .firestore()
    .doc(path)
    .collection(coll)
    .orderBy(sort, "DESC");
  if (after) {
    r = r.startAfter(after);
  }
  return r.limit(number).get();
}

export function subTo(path, number, coll, sort = "updated") {
  //console.log({path, number, coll});
  //console.log("trying");
  return firebase
    .firestore()
    .doc(path)
    .collection(coll)
    .orderBy(sort, "DESC")
    .limit(number);
}

export function getColor(string) {
  let c = "";
  let r = "";
  let add = "";
  while (c != "rgba(255, 255, 255, 1)") {
    r = hash(string + add);
    //console.log(r);
    add += ".";
    c = r.color;
  }
  return r.backgroundColor;
}

export function uploadImage(
  path,
  width,
  height,
  callback = null,
  fileType = "jpg"
) {
  var storage = firebase.storage();
  var storageRef = storage.ref();
  var imagesRef = storageRef.child("uploads/" + getUID() + "/images");
  var fileName = uuidv4();
  var imageRef = imagesRef.child(fileName + "." + fileType);
  imageRef.putFile(path).then(function(snapshot) {
    //console.log(snapshot);
    registerImage({
      path: snapshot.ref,
      url: snapshot.downloadURL,
      width: width,
      height: height
    }).then(() => {
      if (callback) {
        callback({
          width: width,
          height: height,
          path: snapshot.ref,
          url: snapshot.downloadURL,
          user: getUID()
        });
      }
    });
  });
}

function registerImage(snap) {
  let userId = getUID();
  let image = {
    user: userId,
    path: snap.path.replace("/", ""),
    url: snap.url,
    width: snap.width,
    height: snap.height
  };
  //console.log(image);
  return firebase
    .firestore()
    .doc(image.path)
    .set(image);
}

export function report(path, reason, moreInfo) {
  let userId = getUID();
  let r = {
    user: userId,
    path: path,
    reason: reason,
    moreInfo: moreInfo,
    time: firebase.firestore.FieldValue.serverTimestamp()
  };
  //console.log(image);
  return firebase
    .firestore()
    .collection("reports")
    .doc()
    .set(r);
}

function isFree(username) {
  return firebase
    .firestore()
    .collection("usernames")
    .doc(username)
    .get()
    .then(d => {
      if (d.exists) {
        //username already taken.
        return false;
      } else {
        return true;
      }
    });
}

export function makeUser(u) {
  if (!u.username) {
    return Promise.reject();
  }
  return isFree(u.username).then(ans => {
    if (!ans) {
      return Promise.reject();
    } else {
      u = {
        ...u,
        id: getUID(),
        time: firebase.firestore.FieldValue.serverTimestamp()
      };
      console.log(u);
      return firebase
        .firestore()
        .collection("users")
        .doc(getUID())
        .set(u);
    }
  });
}
function getPathId(p) {
  let a = p.split("/");
  return a[a.length - 1];
}
export function doSave(path, onlySave, showToast = true) {
  let uid = getUID();
  let ref = firebase
    .firestore()
    .collection("users")
    .doc(uid)
    .collection("saved")
    .doc(getPathId(path));

  return ref.get().then(snap => {
    console.log(snap);
    if (snap.exists) {
      //remove watching.
      if (!onlySave) {
        firebase
          .messaging()
          .unsubscribeFromTopic(getPathId(path))
          .then(r => {
            console.log(r);
          });
        showToast &&
          ToastAndroid.show("No longer watching that", ToastAndroid.SHORT);
        return ref.delete();
      }
    } else {
      //add to watchlist.
      firebase.messaging().subscribeToTopic(getPathId(path));
      showToast && ToastAndroid.show("Watching that", ToastAndroid.SHORT);
      return ref.set({
        path: path,
        time: firebase.firestore.FieldValue.serverTimestamp()
      });
    }
    //if (snap.)
  });
}
