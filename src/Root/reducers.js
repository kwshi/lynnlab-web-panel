import * as actions from './actions';
import {log, motors} from './websocket/reducers';
import {app} from './App/reducers';
import * as Redux from 'redux';



export const root = Redux.combineReducers({
    log,
    motors,
    currentApp: (state = 'MotorConsole', action) => (
        action.type == actions.SET_APP ?
            action.app :
            state
    ),
    app,
});

