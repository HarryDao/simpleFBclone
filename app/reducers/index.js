import { combineReducers } from 'redux';
import auth from './AuthReducer';
import allUsers from './AllUsersReducer';
import posts from './PostReducer';
import messages from './MessageReducer';

export default combineReducers({
    auth,
    allUsers,
    posts,
    messages,
});