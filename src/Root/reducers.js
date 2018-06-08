import * as actions from './actions'
import {dataLog} from './App/dataLog/reducers'
import {dataPlot} from './App/dataPlot/reducers'
import {dataBar} from './App/DataBar/reducers'
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

