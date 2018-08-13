import {
    ADD_MESSAGE,
    REMOVE_MESSAGE
} from './const/types';


export const removeMessage = ({ id }) => {
    return { type: REMOVE_MESSAGE, payload: id };
}


export const addMessage = ({ field, message, type }) => {
    if (!message) {
        return;
    }

    if (typeof message !== 'string') {
        if (message.response && 
            message.response.data) {

            message = message.response.data;
            message = message.error || message;
        }
        else if (message.message) {
            message = message.message;
        }
        else if (message.statusText) {
            message = message.statusText;
        }
    }

    if (typeof message != 'string') {
        try {
            message = JSON.stringify(message);
        }
        catch(err) {
            return;
        }
    }

    return { type: ADD_MESSAGE, payload: { field, content: message, type } }
}