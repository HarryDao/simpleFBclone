import Axios from 'axios';
import * as URLS from './const/urls';
import { addMessage } from './MessageActions';
import LS from '../services/LocalStorage';

export const requestFriend = ({ uid, name }, cb) => async dispatch => {
    try {
        await Axios.post(
            URLS.requestFriend,
            { uid },
            LS.createAuthHeader()
        );

        dispatch(addMessage({
            field: 'requesting friend',
            message: `Your request has been sent, please wait for ${name} to accept...`,
            type: 'info'
        }));

        return cb();
    }
    catch(err) {
        dispatch(addMessage({
            field: 'requesting friend',
            message: err,
            type: 'error'
        }));

        return cb();
    }
}

export const acceptFriendRequest = ({ uid, name }, cb) => async dispatch => {
    try {
        await Axios.post(
            URLS.acceptFriendRequest,
            { uid },
            LS.createAuthHeader()
        );

        dispatch(addMessage({
            field: 'accepting friend request',
            message: `Congratulation! ${name} is now your friend!`,
            type: 'success'
        }));

        if (cb && typeof cb === 'function') {
            return cb();
        }
    }
    catch(err) {
        dispatch(addMessage({
            field: 'accepting friend request',
            message: err,
            type: 'error'
        }));

        return cb();
    }
}

export const rejectFriendRequest = ({ uid, name }, cb) => async dispatch => {
    try {
        await Axios.post(
            URLS.rejectFriendRequest,
            { uid },
            LS.createAuthHeader()
        );

        dispatch(addMessage({
            field: 'rejecting friend request',
            message: `You have declined friend request from ${name}!`,
            type: 'info'
        }));


        if (cb && typeof cb === 'function') {
            return cb();
        }        
    }
    catch(err) {
        dispatch(addMessage({
            field: 'rejecting friend request',
            message: err,
            type: 'error'
        }));

        return cb();
    }
}

export const cancelPendingRequest = ({ uid, name }, cb) => async dispatch => {
    try {
        await Axios.post(
            URLS.cancelPendingRequest,
            { uid },
            LS.createAuthHeader()
        );

        if(cb && typeof cb === 'function') {

            dispatch(addMessage({
                field: 'canceling pending request',
                message: `Friend request to ${name} has been cancelled`,
                type: 'info'
            }));

            return cb();
        }
    }
    catch(err) {
        dispatch(addMessage({
            field: 'canceling pending request',
            message: err,
            type: 'error'
        }));

        return cb();
    }
}

export const removeFriend = ({ uid, name }, cb) => async dispatch => {
    try {
        await Axios.post(
            URLS.removeFriend,
            { uid },
            LS.createAuthHeader()
        );

        dispatch(addMessage({
            field: 'removing friend',
            message: `${name} is no longer your friend!`,
            type: 'info',
        }));

        if (cb && typeof cb === 'function') {
            return cb();
        }
    }
    catch(err) {
        dispatch(addMessage({
            field: 'removing friend',
            message: err,
            type: 'error'
        }));

        return cb();
    }
}