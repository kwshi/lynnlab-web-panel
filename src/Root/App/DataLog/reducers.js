import * as Redux from 'redux';
import * as actions from './actions'

const maxEntries = (state = 100, action) => (
    (action.type == actions.SET_MAX_ENTRIES &&
     action.entries > 0 &&
     action.entries <= 500) ?
        action.entries :
        state
);

export const dataLog = Redux.combineReducers({
    maxEntries
});
