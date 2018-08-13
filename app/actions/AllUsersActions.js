import Firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import { FETCH_ALL_USERS_SUCCESS } from './const/types';
import { addMessage } from './MessageActions';
import { extractDataFromSnapshots } from './helpers';
const COLLECTION = 'users';


export const fetchAllUsers = (cb) => async dispatch => {
    let users = {};

    const fetchEnd = (err) => {
        if (!err) {
            dispatch({
                type: FETCH_ALL_USERS_SUCCESS, 
                payload: users
            });
        }
        else {
            // console.error('Error getAllUsers:', err);
            
            dispatch(addMessage({
                field: 'fetch all users',
                message: err,
                type: 'error'
            }));
        }

        if (cb && typeof cb === 'function') {
            return cb(err);
        }
    }

    try {
        const unsubscribe = Firebase.firestore()
        .collection(COLLECTION)
        .onSnapshot(snaps => {
            users = extractDataFromSnapshots([snaps], true);

            return fetchEnd();
        }, () => {
            if (!Firebase.auth().currentUser) {
                unsubscribe();
            }
        });
    }
    catch(err) {
        return fetchEnd(err);
    }   
}