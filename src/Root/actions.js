import * as dataLog_ from './App/dataLog/actions';
export const dataLog = dataLog_;


export const SET_APP = 'SET_APP';
export const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE';

export const setApp = app => ({
    type: SET_APP,
    app,
});

