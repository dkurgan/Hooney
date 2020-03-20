import { ADD_ALERT, REMOVE_ALERT } from '../actions/types';

const initState = []

const Alerts = (state = initState, action) => {
    const { type, payload } = action
    switch (type) {
        case ADD_ALERT:
            return [...state, payload];
        case REMOVE_ALERT:
            return state.filter(alert => alert.id !== payload);
        default:
            return state;
    }
}
export default Alerts