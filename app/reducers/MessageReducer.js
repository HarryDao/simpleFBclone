import {
    APP_RESET,
    ADD_MESSAGE,
    REMOVE_MESSAGE,
} from '../actions/const/types';

const INITIAL_STATE = {};

export default (state = INITIAL_STATE, action) => {
    const now = new Date().getTime();
    const { payload } = action;
    let messages = { ...state };

    switch(action.type) {
        case APP_RESET:
            return INITIAL_STATE;

        case ADD_MESSAGE: 
            payload.id = now;
            return { ...state, [now]: payload }

        case REMOVE_MESSAGE:
            delete messages[action.payload];
            return { ...messages };

        default:
            return state;
    }
}