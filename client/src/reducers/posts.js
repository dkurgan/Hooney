import {
    GET_POSTS,
    GET_POST
} from '../actions/types';

const initState = {
    posts: [],
    post: [],
    isLoading: true
}

const  postReducers = (state = initState, action) =>{
    const {type, payload } = action;
    switch(type){
        case GET_POSTS:
            return {...state, posts: payload, isLoading: false};
        case GET_POST:
            const res = {...state, post: payload, isLoading: false}
            return res;
    default: return state;
    }
}

export default postReducers