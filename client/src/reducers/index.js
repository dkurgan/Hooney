import { combineReducers } from 'redux';
import authReducer from './auth';
import postReducer from './posts';
import profileReducer from './profile'

export default combineReducers({
    user: authReducer,
    posts: postReducer,
    profile: profileReducer
})