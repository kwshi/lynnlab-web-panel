import * as app_ from './App/actions';
export const app = app_;

import * as websocket_ from './websocket/actions';
export const websocket = websocket_;

export const SET_APP = 'SET_APP';
export const RECEIVE_MESSAGE = 'RECEIVE_MESSAGE';

export const setApp = app => ({
    type: SET_APP,
    app,
});

