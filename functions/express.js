const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan-body');

const admin = require('firebase-admin');
const serviceAccount = require('./configs/fb.json');
const { onExpressRequest } = require('./middlewares');

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://simplefbclone-3d1af.firebaseio.com'
});

const app = express();

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

app.use(bodyParser.json());
morgan(app);

onExpressRequest(app, '/requestFriend', requestFriend);
onExpressRequest(app, '/createUser', createUser);
onExpressRequest(app, '/acceptFriendRequest', acceptFriendRequest);
onExpressRequest(app, '/rejectFriendRequest',rejectFriendRequest);
onExpressRequest(app, '/cancelPendingRequest', cancelPendingRequest);
onExpressRequest(app, '/removeFriend', removeFriend);

onExpressRequest(app, '/addPost', addPost);
onExpressRequest(app, '/updatePost', updatePost);
onExpressRequest(app, '/removePost', removePost);

app.get('/test', (req, res) => {
    res.send('okokokok');
});

app.listen('9999', () => console.log(`Server running on 9999`));

