import Firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import Axios from 'axios';
import {
    FETCH_POSTS_SUCCESS,
} from './const/types';
import * as URLS from './const/urls';
import { addMessage } from './MessageActions';
import LS from '../services/LocalStorage';
import { extractDataFromSnapshots } from './helpers';
const USER_COLLECTION = 'users';
const POST_COLLECTION = 'posts';


export const fetchPosts = (cb) => async dispatch => {
    try {
        const authInfo = Firebase.auth().currentUser;

        const unsubscribeUser = Firebase.firestore()
        .collection(USER_COLLECTION)
        .doc(authInfo.uid)
        .onSnapshot(snap => {

            let { friends } = snap.data();

            const posts = {};
            const uids = [authInfo.uid, ...Object.keys(friends || {})];

            uids.map(uid => {
                const unsubscribe = Firebase.firestore()
                .collection(POST_COLLECTION)
                .where('authorId', '==', uid)
                .onSnapshot(snaps => {

                    const userPosts = extractDataFromSnapshots(
                        [snaps], 
                        false, 
                        'created',
                    );
    
                    posts[uid] = userPosts;
    
                    dispatch({
                        type: FETCH_POSTS_SUCCESS,
                        payload: posts
                    });

                    if (cb && typeof cb === 'function') {
                        return cb();
                    }
                    
                }, () => {
                    if (!Firebase.auth().currentUser) {
                        unsubscribe();
                    }
                });
            });


        }, err => {
            unsubscribeUser();

            throw err;
        });
    }
    catch(err) {
        // console.error(`Error fetchPosts:`, err);

        dispatch(addMessage({
            field: 'fetchPosts',
            message: err,
            type: 'error'
        }));

        if (cb && typeof cb === 'function') {
            return cb(err);
        }
    }
}

export const addPost = ({ content }, cb) => async dispatch => {
    try {
        await Axios.post(
            URLS.addPost,
            { content },
            LS.createAuthHeader()
        );

        if (cb && typeof cb === 'function') {
            return cb();
        }
    }
    catch(err) {
        // console.error('Error addPost:', err);
        
        dispatch(addMessage({
            field: 'addPost',
            message: err,
            type: 'error'
        }))

        return cb(err);
    }
}

export const updatePost = ({ uid, content }, cb) => async dispatch => {
    try {
        await Axios.post(
            URLS.updatePost,
            { uid, content },
            LS.createAuthHeader()
        );

        return cb();
    }
    catch(err) {
        // console.error('Error updatePost:', err);

        dispatch(addMessage({
            field: 'updatePost',
            message: err,
            type: 'error'
        }))

        return cb(err);
    }
}

export const removePost = ({ uid }, cb) => async dispatch => {
    try {
        await Axios.post(
            URLS.removePost,
            { uid },
            LS.createAuthHeader()
        );

        return cb();
    }
    catch(err) {
        // console.error('Error removePost:', err);

        dispatch(addMessage({
            field: 'removePost',
            message: err,
            type: 'error'
        }))

        return cb(err);
    }
}