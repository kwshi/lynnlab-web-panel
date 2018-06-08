import * as Redux from 'redux';
import * as actions from './actions';
import {plottingReducer} from '../common/plottingReducers';


export const dataBar = plottingReducer(actions, {
    singles: {
        showChannels: {0: true, 1: true, 2: true, 3: true},
        errorbars: true,
        range: {auto: true, min: 0, max: 100000},
    },
    coincidences: {
        showChannels: {4: true, 5: true, 6: true, 7: true},
        errorbars: true,
        range: {auto: true, min: 0, max: 2000},
    },
});
