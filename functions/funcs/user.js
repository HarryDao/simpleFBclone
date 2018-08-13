const admin = require('firebase-admin');
const deleteField = admin.firestore.FieldValue.delete;
const COLLECTION = 'users';

const getUserOnDB = (uid) => {
    return new Promise((resolve, reject) => {
        if (!uid) {
            reject('Invalid uid');
        }

        admin.firestore().collection(COLLECTION).doc(uid)
            .get()
            .then(snap => {
                let user = snap.data();
                user.uid = snap.id;

                resolve(user);
            })
            .catch(err => reject(err));          
    });
}

const updateUserOnDB = (uid, update) => {
    return new Promise((resolve, reject) => {
        admin.firestore()
        .collection(COLLECTION).doc(uid)
        .update(update)
        .then(() => resolve())
        .catch(err => reject(err));  
    });
}

const checkAuthentication = (req, cb) => {
    if (req && req.headers && req.headers.authorization) {

        admin.auth()
        .verifyIdToken(req.headers.authorization)
        .then(({ uid }) => {

            admin.auth()
            .getUser(uid)
            .then(user => {
                user.uid = uid;

                return cb(user);
            })
            .catch(err => cb(null));  

        })
        .catch(err => { return cb(null) });
    }
    else {
        cb(null);
    }
}

const createUser = (req, res) => {

    const { uid, email } = req.user;
    const { name } = req.body;

    if (!name) {
        return res.status(422).send({ error: 'Bad Input' });
    }

    admin.firestore().collection(COLLECTION).doc(uid)
    .set({
        name,
        email,
        friends: {}
    })
    .then(() => res.send({ ok: true }))
    .catch(err => res.status(422).send({ error: err }));
}


const deleteUser = ({ uid }) => {
    return admin.firestore().collection(COLLECTION).doc(uid).delete()
    .then()
    .catch();
}


const friendRequestProcess = (req, res, getUpdates) => {
    try {
        const { uid } = req.body;

        if (!uid) {
            return res.status(422).send({ error: 'Bad Input' });
        }

        Promise.all([
            getUserOnDB(req.user.uid), 
            getUserOnDB(uid)
        ])
        .then(([user, friend]) => {

            const [userUpdates, friendUpdates] = getUpdates(user, friend);

            Promise.all([
                updateUserOnDB(user.uid, userUpdates),
                updateUserOnDB(uid, friendUpdates)
            ])
            .then(() => res.sendStatus(200))
            .catch(err => res.status(500).send({ error: err })) 

        })
        .catch(err => {
            res.status(422).send({ error: err})
        });
    }
    catch(err) {
        return res.status(500).send({ error: err });
    }    
}

const requestFriend = (req, res) => {
    return friendRequestProcess(req, res, (user, friend) => {
        const userUpdates = {};
        const friendUpdates = {};

        userUpdates[`asking.${friend.uid}`] = true

        friendUpdates[`asked.${user.uid}`] = true

        return [userUpdates, friendUpdates];
    });
}


const acceptFriendRequest = (req, res) => {
    return friendRequestProcess(req, res, (user, friend) => {
        
        if (!user.asked || 
            !user.asked[friend.uid] || 
            !friend.asking || 
            !friend.asking[user.uid]
        ) {
            return res.sendStatus(403);
        }

        const userUpdates = {};
        const friendUpdates = {};

        userUpdates[`friends.${friend.uid}`] = true;
        userUpdates[`asked.${friend.uid}`] = deleteField();

        friendUpdates[`friends.${user.uid}`] = true;
        friendUpdates[`asking.${user.uid}`] = deleteField();

        return [userUpdates, friendUpdates];
    });
}

const rejectFriendRequest = (req, res) => {
    return friendRequestProcess(req, res, (user, friend) => {

        if (!user.asked || 
            !user.asked[friend.uid] || 
            !friend.asking || 
            !friend.asking[user.uid]
        ) {
            return res.sendStatus(403);
        }

        const userUpdates = {};
        const friendUpdates = {};

        userUpdates[`asked.${friend.uid}`] = deleteField();
        friendUpdates[`asking.${user.uid}`] = deleteField();

        return [userUpdates, friendUpdates];
    });
}

const cancelPendingRequest = (req, res) => {
    return friendRequestProcess(req, res, (user, friend) => {

        if (!user.asking ||
            !user.asking[friend.uid] ||
            !friend.asked ||
            !friend.asked[user.uid]
        ) {
            return res.sendStatus(403);
        }

        const userUpdates = {};
        const friendUpdates = {};

        userUpdates[`asking.${friend.uid}`] = deleteField();
        friendUpdates[`asked.${user.uid}`] = deleteField();

        return [userUpdates, friendUpdates];
    });
}

const removeFriend = (req, res) => {
    return friendRequestProcess(req, res, (user, friend) => {

        if (!user.friends || 
            !user.friends[friend.uid] ||
            !friend.friends ||
            !friend.friends[user.uid]
        ) {
            return res.sendStatus(403);
        }

        const userUpdates = {};
        const friendUpdates = {};

        userUpdates[`friends.${friend.uid}`] = deleteField();
        friendUpdates[`friends.${user.uid}`] = deleteField();

        return [userUpdates, friendUpdates];
    });
}

exports.checkAuthentication = checkAuthentication;
exports.getUserOnDB = getUserOnDB;

exports.createUser = createUser;
exports.deleteUser = deleteUser;
exports.requestFriend = requestFriend;
exports.acceptFriendRequest = acceptFriendRequest;
exports.rejectFriendRequest = rejectFriendRequest;
exports.cancelPendingRequest = cancelPendingRequest;
exports.removeFriend = removeFriend;