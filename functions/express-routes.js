const admin = require('firebase-admin');
const serviceAccount = require('./configs/fb.json');
const { onExpressRequest } = require('./middlewares');

const {
    createUser,
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

module.exports = (app) => {
    onExpressRequest(app, '/requestFriend', requestFriend);
    onExpressRequest(app, '/createUser', createUser);
    onExpressRequest(app, '/acceptFriendRequest', acceptFriendRequest);
    onExpressRequest(app, '/rejectFriendRequest',rejectFriendRequest);
    onExpressRequest(app, '/cancelPendingRequest', cancelPendingRequest);
    onExpressRequest(app, '/removeFriend', removeFriend);
    
    onExpressRequest(app, '/addPost', addPost);
    onExpressRequest(app, '/updatePost', updatePost);
    onExpressRequest(app, '/removePost', removePost);
    
    app.get('/ping', (req, res) => res.send('pong')); 

    return app;
}