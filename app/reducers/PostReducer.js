import {
    APP_RESET,
    FETCH_POSTS_SUCCESS
} from '../actions/const/types';

const INITIAL_STATE = null;

export default (state = INITIAL_STATE, action) => {
    switch(action.type) {
        case APP_RESET:
            return INITIAL_STATE;
        case FETCH_POSTS_SUCCESS:
            return action.payload;
        default:
            return state;
    }
}