import {combineReducers} from 'redux';

import {dataLog} from './DataLog/reducers';
import {dataPlot} from './DataPlot/reducers';
import {dataBar} from './DataBar/reducers';

export const app = combineReducers({
    dataLog,
    dataPlot,
    dataBar,
});
