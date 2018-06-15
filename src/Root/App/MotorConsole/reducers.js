import * as actions from './actions';
import {combineReducers} from 'redux';

const position = (state = {}, action) => {
    switch (action.type) {

    case actions.SET_MOTOR_POSITION:
        const position = parseFloat(action.position);
        if (isNaN(position)) {
            return state;
        }
        return {
            ...state,
            [action.sn]: action.position,
        };
        
    case actions.websocket.RECEIVE_MOTOR_STATE:
        return {
            ...Object.keys(action.state).reduce((object, sn) => ({
                ...object,
                [sn]: action.state[sn].position,
            }), {}),
            ...state,
        };

    default:
        return state;
    }
};

export const motorConsole = combineReducers({
    position,
});
