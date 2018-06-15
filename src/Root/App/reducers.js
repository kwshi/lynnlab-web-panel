import {combineReducers} from 'redux';

import {dataLog} from './DataLog/reducers';
import {dataPlot} from './DataPlot/reducers';
import {dataBar} from './DataBar/reducers';
import {motorConsole} from './MotorConsole/reducers';

export const app = combineReducers({
    dataLog,
    dataPlot,
    dataBar,
    motorConsole,
});
