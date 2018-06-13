import * as actions from './actions';
import {log, motor} from './websocket/reducers';
import {app} from './App/reducers';
import * as Redux from 'redux';



export const root = Redux.combineReducers({
    log,
    motor,
    currentApp: (state = 'DataLog', action) => (
        action.type == actions.SET_APP ?
            action.app :
            state
    ),
    app,
});

