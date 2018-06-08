import * as actions from './actions';
import {dataLog} from './App/DataLog/reducers';
import {dataPlot} from './App/DataPlot/reducers';
import {dataBar} from './App/DataBar/reducers';
import {log} from './websocket/reducers';
import * as Redux from 'redux';



export const root = Redux.combineReducers({
    log,
    currentApp: (state = 'data-log', action) => (
        action.type == actions.SET_APP ?
            action.app :
            state
    ),
    dataLog,
    dataPlot,
    dataBar
});

