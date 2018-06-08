import * as Redux from 'redux';
import * as actions from './actions';
import {plottingReducer} from '../common/plottingReducers';


export const dataPlot = plottingReducer(actions, {
    singles: {
        maxEntries: 100,
        showChannels: {0: true, 1: true, 2: false, 3: false},
        errorbars: false,
        range: {auto: true, min: 0, max: 100000},
    },
    coincidences: {
        maxEntries: 100,
        showChannels: {4: true, 5: false, 6: false, 7: false},
        errorbars: false,
        range: {auto: true, min: 0, max: 2000},
    },
});
