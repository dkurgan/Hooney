import {LOGIN_USER, 
        LOGOUT_USER,
        GET_ME,
    } from './types';
import api from '../api';
import {setAlert} from './alerts'
    
export const loginUser = (token) => {
    if (token) localStorage.setItem('Token', token);
    return {
        type: LOGIN_USER,
        token
    }
}

export const authUser = (email, password) => async dispatch =>{
    try {
        const res = await api.post('/auth', {
            password,
            email
        });
        dispatch ({
            type: LOGIN_USER,
            token: res.data.token
        })
        localStorage.setItem('Token', res.data.token);
    } catch (err) {
        const errors = Object.values(err.response.data);
        console.log(errors, "tut")
        if (errors) {
            errors.forEach(error => dispatch(setAlert(error, 'red')));
        }
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

export const registerUser = (token) => {
    localStorage.setItem('Token', token);
    return {
        type: LOGIN_USER,
        token
    }
}

//Update user password/email
export const updUser = (email, passwordOld, passwordNew, notifications) => async (dispatch, getState) => {
    try {
        const res = await api.patch("/users/update",{
            email, passwordOld, passwordNew, notifications
          },{
            headers: { "x-auth-token": getState().user.token }
          }
        );
        if (res.data) {
            dispatch(setAlert("User updated", 'green'));
        }
        dispatch({
            type: LOGIN_USER
        })
    } catch (err) {
        console.log(err.response.data.msg)
            dispatch(setAlert(err.response.data.msg, 'red'));
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