const functions = require('firebase-functions');
const admin = require('firebase-admin');
const serviceAccount = require('./configs/fb.json');
const {
  onAuthenticatedRequest
} = require('./middlewares');

const {
  createUser,
  deleteUser,
  requestFriend,
  acceptFriendRequest,
  rejectFriendRequest,
  cancelPendingRequest,
  removeFriend,
} = require('./funcs/user');

const {
  addPost,
  updatePost,
  removePost,
} = require('./funcs/post');


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://simplefbclone-3d1af.firebaseio.com'
});

exports.deleteUser = functions.auth.user().onDelete(deleteUser);

exports.createUser = onAuthenticatedRequest(createUser);
exports.requestFriend = onAuthenticatedRequest(requestFriend);
exports.acceptFriendRequest = onAuthenticatedRequest(acceptFriendRequest);
exports.rejectFriendRequest = onAuthenticatedRequest(rejectFriendRequest);
exports.cancelPendingRequest = onAuthenticatedRequest(cancelPendingRequest);
exports.removeFriend = onAuthenticatedRequest(removeFriend);

exports.addPost = onAuthenticatedRequest(addPost);
exports.updatePost = onAuthenticatedRequest(updatePost);
exports.removePost = onAuthenticatedRequest(removePost);
