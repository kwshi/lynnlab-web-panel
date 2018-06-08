import {connect} from 'react-redux';
import {DataLog} from './DataLog/DataLog';
import {DataPlot} from './DataPlot/DataPlot';
import {DataBar} from './DataBar/DataBar';
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
    DataBarSingles: connect(
        state => ({
            log: state.log,
            state: state.dataBar.singles,
            props: {
                channels: [0, 1, 2, 3],
            },
        }),
        dispatch => ({on: {
            setMaxEntries: entries => dispatch(actions.dataBar.setMaxEntries('SINGLES', entries)),
            setErrorbars: enable => dispatch(actions.dataBar.setErrorbars('SINGLES', enable)),
            setRangeAuto: auto => dispatch(actions.dataBar.setRangeAuto('SINGLES', auto)),
            setShowChannel: (channel, enable) => dispatch(actions.dataBar.setShowChannel(channel, enable)),
            setRangeMax: value => dispatch(actions.dataBar.setRangeMax('SINGLES', value)),
        }}),
    )(DataBar),
    DataBarCoincidences: connect(
        state => ({
            log: state.log,
            state: state.dataBar.coincidences,
            props: {
                channels: [4, 5, 6, 7],
            },
        }),
        dispatch => ({on: {
            setMaxEntries: entries => dispatch(actions.dataBar.setMaxEntries('COINCIDENCES', entries)),
            setErrorbars: enable => dispatch(actions.dataBar.setErrorbars('COINCIDENCES', enable)),
            setRangeAuto: auto => dispatch(actions.dataBar.setRangeAuto('COINCIDENCES', auto)),
            setShowChannel: (channel, enable) => dispatch(actions.dataBar.setShowChannel(channel, enable)),
            setRangeMax: value => dispatch(actions.dataBar.setRangeMax('COINCIDENCES', value)),
        }}),
    )(DataBar),
};

apps['data-log'] = apps.DataLog;
apps['data-plot-singles'] = apps.DataPlotSingles;
apps['data-plot-coincidences'] = apps.DataPlotCoincidences;
apps['data-bar-singles'] = apps.DataBarSingles;
apps['data-bar-coincidences'] = apps.DataBarCoincidences;

const App_ = ({currentApp}) => {
    const SubApp = apps[currentApp];
    return <SubApp/>;
};

export const App = connect(({currentApp}) => ({currentApp}))(App_);
