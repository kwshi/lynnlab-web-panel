import * as actions from './actions'
import {dataLog} from './dataLog/reducers'
import {dataPlot} from './dataPlot/reducers'
import {dataBar} from './dataBar/reducers'
import * as Redux from 'redux';




export const root = Redux.combineReducers({
    log: (state = [], action) => (
        state
    ),
    currentApp: (state = 'data-log', action) => (
        action.type == actions.SET_APP ?
            action.app :
            state
    ),
    dataLog,
    dataPlot,
    dataBar
});

