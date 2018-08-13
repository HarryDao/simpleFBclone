import { SERVER_URL } from '../../../configs';

export const createUser = `${SERVER_URL}/createUser`;
export const requestFriend = `${SERVER_URL}/requestFriend`;
export const acceptFriendRequest = `${SERVER_URL}/acceptFriendRequest`;
export const rejectFriendRequest = `${SERVER_URL}/rejectFriendRequest`;
export const cancelPendingRequest = `${SERVER_URL}/cancelPendingRequest`;
export const removeFriend = `${SERVER_URL}/removeFriend`;

export const addPost = `${SERVER_URL}/addPost`;
export const updatePost = `${SERVER_URL}/updatePost`;
export const removePost = `${SERVER_URL}/removePost`;