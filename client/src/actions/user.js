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
    const res = await api.get('/users/', {
        headers:{
            "x-auth-token": getState().user.token
    }});
    console.log(res.data, "aaaa");
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

export const checkVerify = (token) => async (dispatch, getState)=>{
    const res = await api.post('/auth/verify',{id: token});
    dispatch({
        type: LOGIN_USER,
        token: res.data
    })
}

export const resetPassword = (email) => async dispatch =>{
    await api.post('/users/reset', {email});
    dispatch({
        type: null
    })
}

export const patchPassword = (id, password) => async dispatch =>{
    await api.patch('/users/reset', {id, password});
    dispatch({
        type: null
    })
}

export const deleteUser = (token) => async dispatch =>{
    await api.delete('/users', {headers:{"x-auth-token": token}});
    dispatch({
        type: LOGOUT_USER
    })
}