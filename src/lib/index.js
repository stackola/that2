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

export function getUser() {
  if (firebase.auth().currentUser !== null) {
    return firebase.auth().currentUser;
  } else {
    return null;
  }
}

export function post(text, image, path) {
  console.log(getUser());
  console.log("GO");
  return sendPost({ text, path, image })
    .then(r => {
      console.log(r);
      doSave(r.data.newPath, true, false);
      doSave(path, true, false);
      return r;
    })
    .catch(err => {
      console.log(err);
    });
}

export function getPosts(path, number) {
  console.log("trying");
  return firebase
    .firestore()
    .doc(path)
    .collection("posts")
    .orderBy("updated", "DESC")
    .limit(number)
    .get();
}

export function subTo(path, number) {
  console.log("trying");
  return firebase
    .firestore()
    .doc(path)
    .collection("posts")
    .orderBy("updated", "DESC")
    .limit(number);
}

export function getColor(string) {
  let c = "";
  let r = "";
  let add = "";
  while (c != "rgba(255, 255, 255, 1)") {
    r = hash(string + add);
    console.log(r);
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
  image = {
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

export function makeUser(u) {
  u = { ...u, id: getUID() };
  if (u.username) {
    return firebase
      .firestore()
      .collection("users")
      .doc(u.username)
      .set(u);
  } else {
    return Promise.reject();
  }
}
function getPathId(p) {
  let a = p.split("/");
  return a[a.length - 1];
}
export function doSave(path, onlySave, showToast=true) {
  let user = getUser();
  let username = user.displayName;
  let ref = firebase
    .firestore()
    .collection("users")
    .doc(username)
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
        showToast && ToastAndroid.show("No longer watching that", ToastAndroid.SHORT);
        return ref.delete();
      }
    } else {
      //add to watchlist.
      firebase.messaging().subscribeToTopic(getPathId(path));
      showToast && ToastAndroid.show("Watching that", ToastAndroid.SHORT);
      return ref.set({ path: path });
    }
    //if (snap.)
  });
}
