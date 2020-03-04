import {
    GET_ME, GET_ALL
} from '../actions/types'

const initState = {
    current: {},
    all: [],
    isLoading: true
}

const profileReducer = (state = initState, actions) =>{
    const {type, payload} = actions;
    if (type === GET_ME)
            return {...state,current: payload, isLoading: false};
    else if (type === GET_ALL)
            return {...state, all: payload, isLoading: false};
        else
            return state
}

export default profileReducer