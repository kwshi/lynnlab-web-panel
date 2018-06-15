import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {createLogger} from 'redux-logger';
import {root} from './reducers';
import WebsocketWrapper from './websocket/websocket';
import * as actions from './actions';

const websocket = new WebsocketWrapper('ws://' + window.location.host + '/ws');

const logger = createLogger({
    collapsed: (getState, action) => true,
    predicate: (getState, action) => false,
});

export const store = createStore(
    root,
    applyMiddleware(thunk.withExtraArgument(websocket), logger),
);

websocket.listen(store.dispatch);
