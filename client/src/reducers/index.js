import { combineReducers } from 'redux';
import user from './auth';
import posts from './posts';
import profile from './profile'
import alert from './alerts'

export default combineReducers({
    user,
    posts,
    profile,
    alert
})