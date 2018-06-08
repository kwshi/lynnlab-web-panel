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
            state: state.app.dataLog,
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
            state: state.app.dataPlot.singles,
            props: {
                channels: [0, 1, 2, 3],
            },
        }),
        dispatch => ({on: {
            setMaxEntries: entries =>
                dispatch(actions.dataPlot.singles.setMaxEntries(entries)),
            setErrorbars: enable =>
                dispatch(actions.dataPlot.singles.setErrorbars(enable)),
            setRangeAuto: auto =>
                dispatch(actions.dataPlot.singles.setRangeAuto(auto)),
            setShowChannel: (channel, enable) =>
                dispatch(actions.dataPlot.setShowChannel(channel, enable)),
            setRangeMin: value =>
                dispatch(actions.dataPlot.singles.setRangeMin(value)),
            setRangeMax: value =>
                dispatch(actions.dataPlot.singles.setRangeMax(value)),
        }}),
    )(DataPlot),
    DataPlotCoincidences: connect(
        state => ({
            log: state.log,
            state: state.app.dataPlot.coincidences,
            props: {
                channels: [4, 5, 6, 7],
            },
        }),
        dispatch => ({on: {
            setMaxEntries: entries =>
                dispatch(actions.dataPlot.coincidences.setMaxEntries(entries)),
            setErrorbars: enable =>
                dispatch(actions.dataPlot.coincidences.setErrorbars(enable)),
            setRangeAuto: auto =>
                dispatch(actions.dataPlot.coincidences.setRangeAuto(auto)),
            setShowChannel: (channel, enable) =>
                dispatch(actions.dataPlot.setShowChannel(channel, enable)),
            setRangeMin: value =>
                dispatch(actions.dataPlot.coincidences.setRangeMin(value)),
            setRangeMax: value =>
                dispatch(actions.dataPlot.coincidences.setRangeMax(value)),
        }}),
    )(DataPlot),
    DataBarSingles: connect(
        state => ({
            log: state.log,
            state: state.app.dataBar.singles,
            props: {
                channels: [0, 1, 2, 3],
            },
        }),
        dispatch => ({on: {
            setMaxEntries: entries =>
                dispatch(actions.dataBar.singles.setMaxEntries(entries)),
            setErrorbars: enable =>
                dispatch(actions.dataBar.singles.setErrorbars(enable)),
            setRangeAuto: auto =>
                dispatch(actions.dataBar.singles.setRangeAuto(auto)),
            setShowChannel: (channel, enable) =>
                dispatch(actions.dataBar.setShowChannel(channel, enable)),
            setRangeMax: value =>
                dispatch(actions.dataBar.singles.setRangeMax(value)),
        }}),
    )(DataBar),
    DataBarCoincidences: connect(
        state => ({
            log: state.log,
            state: state.app.dataBar.coincidences,
            props: {
                channels: [4, 5, 6, 7],
            },
        }),
        dispatch => ({on: {
            setMaxEntries: entries =>
                dispatch(actions.dataBar.coincidences.setMaxEntries(entries)),
            setErrorbars: enable =>
                dispatch(actions.dataBar.coincidences.setErrorbars(enable)),
            setRangeAuto: auto =>
                dispatch(actions.dataBar.coincidences.setRangeAuto(auto)),
            setShowChannel: (channel, enable) =>
                dispatch(actions.dataBar.setShowChannel(channel, enable)),
            setRangeMax: value =>
                dispatch(actions.dataBar.coincidences.setRangeMax(value)),
        }}),
    )(DataBar),
};

const App_ = ({currentApp}) => {
    const SubApp = apps[currentApp];
    return <SubApp/>;
};

export const App = connect(({currentApp}) => ({currentApp}))(App_);
