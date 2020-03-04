import {LOGIN_USER, 
        LOGOUT_USER,
        GET_ME, 
    } from './types';
import api from '../api';
    
export const loginUser = (token) => {
    return {
        type: LOGIN_USER,
        token
    }
}

export const getUser = () => async (dispatch, getState)=>{
    const res = await api.get('/profile/me', {
        headers:{
        "x-auth-token": getState().user.token
    }});
    dispatch({
        type: GET_ME,
        payload: res.data
    })
}

export const logOut = () => {
    return {
        type: LOGOUT_USER
    }
}

export const registerUser = (token) =>{
    return {
        type: LOGIN_USER,
        token
    }
}
