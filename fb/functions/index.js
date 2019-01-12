const functions = require("firebase-functions");
var admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

function getUser(uid) {
  return admin
    .firestore()
    .collection("users")
    .doc(uid)
    .get();
}

exports.post = functions.https.onCall((data, context) => {
  // Authentication / user information is automatically added to the request.
  //const uid ="ygTlBOBr1iUrQtBbxkO64h981ln1";

  const uid = context.auth.uid;

  if (!context.auth) {
    // Throwing an HttpsError so that the client gets the error details.
    return { error: "Not authenticated", uid };
  }

  // TODO: Check ban list. Check allow anonymous. Check if either home town or in raidus.

  const text = data.text || null;
  const image = data.image || null;
  if (!text && !image) {
    return { error: "No text or image" };
  }

  const path = data.path || null;
  if (!path) {
    return { error: "No path" };
  }
  var db = admin.firestore();

  let newPost = db
    .doc(path)
    .collection("posts")
    .doc();
  return getUser(uid).then(u => {
    console.log(u);
    u = u.data();
    return newPost
      .set({
        id: newPost.id,
        text,
        image,
        comments: 0,
        parent: path,
        user: uid,
        name: u.username,
        time: admin.firestore.FieldValue.serverTimestamp(),
        updated: admin.firestore.FieldValue.serverTimestamp()
      })
      .then(() => {
        incrementComments(path);
        addPostToUser(path + "/posts/" + newPost.id, uid);
        sendNotification(
          path,
          "Check that",
          u.username + " replied to a post you are following.",
          {
            path: path,
            type: "reply",
            byUser: uid
          }
        );
        return {
          status: "ok",
          postId: newPost.id,
          newPath: path + "/posts/" + newPost.id
        };
      });
  });
});
function addPostToUser(path, uid) {
  return admin
    .firestore()
    .collection("users")
    .doc(uid)
    .collection("posts")
    .doc()
    .set({ path: path, time: admin.firestore.FieldValue.serverTimestamp() });
}
function incrementComments(path) {
  var db = admin.firestore();
  let ref = db.doc(path);
  return db.runTransaction(t => {
    return t.get(ref).then(doc => {
      // Add one person to the city population
      var comments = (doc.data().comments || 0) + 1;
      t.update(ref, {
        comments: comments,
        updated: admin.firestore.FieldValue.serverTimestamp()
      });
    });
  });
}

function sendNotification(path, title, text, data) {
  data = data || {};
  let id = getPathId(path);
  console.log(data);
  return admin
    .messaging()
    .send({
      topic: id,
      data: data || {},
      android: { notification: { channelId: "test-channel" } },
      notification: {
        title: title,
        body: text
      }
    })
    .then(() => {
      console.log("notification dispatched!");
      return;
    })
    .catch(err => {
      console.log("err", err);
    });
}

function getPathId(p) {
  let a = p.split("/");
  return a[a.length - 1];
}

exports.createUser = functions.firestore
  .document("users/{userId}")
  .onCreate((snap, context) => {
    // Get an object representing the document
    // e.g. {'name': 'Marie', 'age': 66}
    const newValue = snap.data();

    // access a particular field as you would any JS property
    let username = newValue.username.trim();
    username = username.toLowerCase();
    var db = admin.firestore();
    return db
      .collection("usernames")
      .doc(username)
      .set({ taken: true });
    // perform desired operations ...
  });
