const admin = require('firebase-admin');
const COLLECTION = 'posts';

const composePost = (content, { uid }, created) => {
    const now = Date.now();

    return {
        authorId: uid,
        content,
        created: now,
        edited: now,
    }
}

const addPost = (req, res) => {
    const { content } = req.body;

    if (!content) {
        return res.status(422).send({ error: 'Bad Input' })
    }

    const post = composePost(content, req.user);

    admin.firestore()
    .collection(COLLECTION).add(post)
    .then(() => res.sendStatus(200))
    .catch(err => res.status(401).send({ error: err }));
}

const updatePost = (req, res) => {
    const { uid, content } = req.body;

    if (!uid || !content) {
        return res.status(422).send({ error: 'Bad Input' });
    }

    getPost(uid, (err, snap) => {
        if (err) { return res.status(422).send({ error: err }) }

        let doc = snap.data();
            
        if (doc.authorId !== req.user.uid) {
            return res.sendStatus(401);
        }

        admin.firestore()
        .collection(COLLECTION).doc(uid)
        .update({
            content,
            edited: Date.now()
        })
        .then(() => res.sendStatus(200))
        .catch(err => res.status(500).send({ error: err }));
    });
}

const removePost = (req, res) => {
    const { uid } = req.body;

    getPost(uid, (err, snap) => {
        if (err) { return res.status(422).send({ error: err }) }

        let doc = snap.data();
            
        if (!doc || doc.authorId !== req.user.uid) {
            return res.sendStatus(401);
        }
        
        admin.firestore()
        .collection(COLLECTION).doc(uid)
        .delete()
        .then(() => res.sendStatus(200))
        .catch(err =>  res.status(500).send({ error: err }));
    });
}

const getPost = (uid, cb) => {
    admin.firestore()
    .collection(COLLECTION).doc(uid).get()
    .then(snap => cb(null, snap))
    .catch(err => cb(err));    
}

exports.addPost = addPost;
exports.updatePost = updatePost;
exports.removePost = removePost;