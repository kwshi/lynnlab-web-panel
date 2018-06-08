import {createStore, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';
import {root} from './reducers';
import WebsocketWrapper from './websocket/websocket';

const websocket = new WebsocketWrapper('ws://' + window.location.host + '/ws');

export const store = createStore(
    root,
    applyMiddleware(thunk.withExtraArgument(websocket)),
);

websocket.listen(store.dispatch);
