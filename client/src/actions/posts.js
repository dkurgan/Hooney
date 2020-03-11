import api from '../api'
import {
    GET_POSTS,
    GET_POST
} from './types';

export const getPosts = () => async dispatch =>{
    const res = await api.get('/posts');
    dispatch({
        type: GET_POSTS,
        payload: res.data
    });
}

export const postComment = (comment_id, text) => async (dispatch, getState) =>{
    await api.post(`/posts/comment/${comment_id}`,{ text}, 
       {headers: { "x-auth-token":  getState().user.token}});
    const res = await api.get('/posts');
    dispatch({
        type: GET_POSTS,
        payload: res.data
    });
}

export const postCom = (post_id, text) => async (dispatch, getState) =>{
    await api.post(`/posts/comment/${post_id}`,{ text}, 
       {headers: { "x-auth-token":  getState().user.token}});
    const res = await api.get(`/posts/${post_id}`);
    dispatch({
        type: GET_POST,
        payload: res.data
    });
}

export const deleteComment = (post_id, comment_id) => async (dispatch, getState) =>{
    await api.delete(`/posts/comment/${post_id}/${comment_id}`, {
        headers:{
            "x-auth-token": getState().user.token
        }
    });
    const res = await api.get(`/posts/${post_id}`);
    dispatch({
        type: GET_POST,
        payload: res.data
    });
}

export const likeUnlike = (post_id) => async (dispatch, getState) =>{
   await api.patch(`posts/like/${post_id}`,{},
        {headers: { "x-auth-token": getState().user.token }});
    const res = await api.get('/posts');
    dispatch({
        type: GET_POSTS,
        payload: res.data
    })
}

export const getPost = id => async dispatch =>{
    const res = await api.get(`/posts/${id}`);
    dispatch({
        type: GET_POST,
        payload: res.data
    });
}

export const createPost = (image) => async (dispatch, getState) =>{
    console.log(image);
    await api.post('/posts',{base64: image},
        {headers:{
            "x-auth-token": getState().user.token,
        },});
    const res = await api.get('/posts');
        dispatch({
            type: GET_POSTS,
            payload: res.data
        })
}

export const deletePost = (id) => async (dispatch, getState) => {
    await api.delete(`/posts/${id}`, {headers:{
        "x-auth-token": getState().user.token,
    }})
    const res = await api.get('/posts');
        dispatch({
            type: GET_POSTS,
            payload: res.data
        })
}