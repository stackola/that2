const functions = require("firebase-functions");
var admin = require("firebase-admin");
admin.initializeApp(functions.config().firebase);
// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

exports.post = functions.https.onCall((data, context) => {
  // Authentication / user information is automatically added to the request.
  // const uid ="mntjlOUpd6SjfQmE1GhF820Ass62";

  const uid = context.auth.uid;
  const name = context.auth.token.name || null;
  const picture = context.auth.token.picture || null;
  const email = context.auth.token.email || null;

  if (!context.auth || !name) {
    // Throwing an HttpsError so that the client gets the error details.
    return { error: "Not authenticated" };
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

  return newPost
    .set({
      id: newPost.id,
      text,
      image,
      comments: 0,
      parent: path,
      user: uid,
      name: name,
      time: admin.firestore.FieldValue.serverTimestamp(),
      updated: admin.firestore.FieldValue.serverTimestamp()
    })
    .then(() => {
      incrementComments(path);
      return {
        status: "ok",
        postId: newPost.id,
        newPath: path + "/posts/" + newPost.id
      };
    });
});

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
