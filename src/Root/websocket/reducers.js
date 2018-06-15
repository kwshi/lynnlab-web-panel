import * as actions from './actions';

export const log = (state = [], action) => (
    action.type == actions.RECEIVE_LOG ?
        ([
            ...state,
            ...action.entries.map(entry => ({
                ...entry,
                time: new Date(entry.time),
            })),
        ].slice(-500)) :
        state
);

export const motors = (state = {}, action) => (
    action.type == actions.RECEIVE_MOTOR_STATE ?
        action.state :
        state
);
