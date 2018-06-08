import {connect} from 'react-redux';
import {DataLog} from './DataLog/DataLog';
import {DataPlot} from './DataPlot/DataPlot';
import * as actions from './actions';
import React from 'react';


const apps = {
    DataLog: connect(
        state => ({
            log: state.log,
            state: state.dataLog,
        }),
        dispatch => ({
            on: {
                setMaxEntries: entries => dispatch(actions.dataLog.setMaxEntries(entries)),
            }
        }),
    )(DataLog),
    DataPlotSingles: connect(
        state => ({
            log: state.log,
            state: state.dataPlot.singles,
            props: {
                channels: [0, 1, 2, 3],
            },
        }),
        dispatch => ({on: {
            setMaxEntries: entries => dispatch(actions.dataPlot.setMaxEntries('SINGLES', entries)),
            setErrorbars: enable => dispatch(actions.dataPlot.setErrorbars('SINGLES', enable)),
            setRangeAuto: auto => dispatch(actions.dataPlot.setRangeAuto('SINGLES', auto)),
            setShowChannel: (channel, enable) => dispatch(actions.dataPlot.setShowChannel(channel, enable)),
            setRangeMin: value => dispatch(actions.dataPlot.setRangeMin('SINGLES', value)),
            setRangeMax: value => dispatch(actions.dataPlot.setRangeMax('SINGLES', value)),
        }}),
    )(DataPlot),
    DataPlotCoincidences: connect(
        state => ({
            log: state.log,
            state: state.dataPlot.coincidences,
            props: {
                channels: [4, 5, 6, 7],
            },
        }),
        dispatch => ({on: {
            setMaxEntries: entries => dispatch(actions.dataPlot.setMaxEntries('COINCIDENCES', entries)),
            setErrorbars: enable => dispatch(actions.dataPlot.setErrorbars('COINCIDENCES', enable)),
            setRangeAuto: auto => dispatch(actions.dataPlot.setRangeAuto('COINCIDENCES', auto)),
            setShowChannel: (channel, enable) => dispatch(actions.dataPlot.setShowChannel(channel, enable)),
            setRangeMin: value => dispatch(actions.dataPlot.setRangeMin('COINCIDENCES', value)),
            setRangeMax: value => dispatch(actions.dataPlot.setRangeMax('COINCIDENCES', value)),
        }}),
    )(DataPlot),
};

apps['data-log'] = apps.DataLog;
apps['data-plot-singles'] = apps.DataPlotSingles;
apps['data-plot-coincidences'] = apps.DataPlotCoincidences;

const App_ = ({currentApp}) => {
    const SubApp = apps[currentApp];
    return <SubApp/>;
};

export const App = connect(({currentApp}) => ({currentApp}))(App_);
