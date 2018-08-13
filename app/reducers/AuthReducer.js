import {
    FIREBASE_INITIALIZED,
    APP_RESET,
    AUTH_LOADING,
    USER_REGISTER_FAIL,
    USER_LOGIN_FAIL,
    USER_LOGIN_SUCCESS,
    USER_OAUTH_GOOGLE_FAIL,
} from '../actions/const/types';

const INITIAL_STATE = {
    initialized: false,
    user: null,
    error: '',
    loading: false,
}

export default (state = INITIAL_STATE, action) => {
    const { payload } = action;

    switch(action.type) {
        case FIREBASE_INITIALIZED:
            return { ...state, initialized: true }

        case APP_RESET:
            return { ...INITIAL_STATE, initialized: true };

        case AUTH_LOADING:
            return { ...state, loading: true, error: '' };
            
        case USER_REGISTER_FAIL: 
        case USER_LOGIN_FAIL:
        case USER_OAUTH_GOOGLE_FAIL:
            return { ...state, user: null, error: payload, loading: false };

        case USER_LOGIN_SUCCESS:
            return { ...state, user: payload, error: '', loading: false };

        default:
            return state;
    }
}