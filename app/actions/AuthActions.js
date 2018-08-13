import Firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import Axios from 'axios';
import LS from '../services/LocalStorage';
import {
    FIREBASE_INITIALIZED,
    APP_RESET,
    AUTH_LOADING,
    USER_REGISTER_FAIL,
    USER_LOGIN_FAIL,
    USER_LOGIN_SUCCESS,
    USER_OAUTH_GOOGLE_FAIL,
} from './const/types';
import * as URLS from './const/urls';
const COLLECTION = 'users';


export const firebaseInitialized = () => {
    return { type: FIREBASE_INITIALIZED };
}


export const updateAuthentication = (user) => async dispatch => {
    try {
        if (!user) {
            throw ''
        }

        dispatch({ type: AUTH_LOADING });

        const token = await user.getIdToken();

        LS.setToken(token);

        const unsubscribe = Firebase.firestore()
        .collection(COLLECTION)
        .doc(user.uid).onSnapshot(snap => {
            const user = snap.data();

            if (!user) { return; }

            user.uid = snap.id;

            dispatch({
                type: USER_LOGIN_SUCCESS,
                payload: user,
            });
        }, () => {
            if (!Firebase.auth().currentUser) {
                unsubscribe();
            }
        });
    }
    catch(err) {
        LS.deleteToken();
        dispatch({ type: USER_LOGIN_FAIL, payload: err });
    }
}


export const registerUser = ({ email, password, name }) => async dispatch => {

    try {
        dispatch({ type: AUTH_LOADING });

        if (!name) {
            throw {
                message: 'Your name is required for registration!'
            }
        }

        const { user } = await Firebase.auth().createUserWithEmailAndPassword(email, password);

        if (!user) {
            throw 'Cant find registered user';
        }

        const token = await user.getIdToken();

        await Axios.post(
            URLS.createUser,
            { name },
            LS.createAuthHeader(token)
        );
    }
    catch(err) {
        AuthFail(dispatch, USER_REGISTER_FAIL, err, 'Registration Failed');
    }
}

export const loginUser = ({ email, password }) => async dispatch => {
    try {
        dispatch({ type: AUTH_LOADING });

        await Firebase.auth().signInWithEmailAndPassword(email, password);
    }
    catch(err) {
        AuthFail(dispatch, USER_LOGIN_FAIL, err, 'Login Failed');
    }
}

export const oauthGoogle = () => async dispatch => {
    try {
        dispatch({ type: AUTH_LOADING });

        const provider = new Firebase.auth.GoogleAuthProvider();

        const { user } = await Firebase.auth().signInWithPopup(provider);

        const token = await user.getIdToken();

        await Axios.post(
            URLS.createUser,
            { name: user.displayName },
            LS.createAuthHeader(token)
        );
    }
    catch (err) {
        AuthFail(dispatch, USER_OAUTH_GOOGLE_FAIL, err, 'Google Login Failed');
    }
}


export const logoutUser = () => async dispatch => {
    try {
        await Firebase.auth().signOut();
        dispatch({ type: APP_RESET });

    }
    catch(err) {
        // console.error('Error logoutUser:', err);
    } 
}




const AuthFail = (dispatch, type, err, message = 'Authentication Failed') => {
    if (err && err.message) {
        message = err.message;
    }

    dispatch({ type, payload: message });
}

