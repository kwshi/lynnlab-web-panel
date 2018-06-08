import * as Redux from 'redux';
import * as actions from './actions'

const maxEntries = (state = 100, action) => (
    action.type == actions.SET_MAX_ENTRIES ?
        action.entries :
        state
);

export const dataLog = Redux.combineReducers({
    maxEntries
});
