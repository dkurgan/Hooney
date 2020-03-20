import {v4} from 'uuid';
import { ADD_ALERT, REMOVE_ALERT } from './types';

export const setAlert = (msg, alertType) => dispatch =>{
    const id = v4();
    dispatch({
        type: ADD_ALERT,
        payload: {
            msg,
            alertType,
            id
        }
    });
    setTimeout(() => dispatch({
        type: REMOVE_ALERT,
        payload: id
    }), 3000);
}
