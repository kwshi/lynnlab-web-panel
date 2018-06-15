
import * as actions from './actions';

export default class WebsocketWrapper {
    constructor(address) {
        this.address = address;
        this.websocket = new window.WebSocket(address);
    }

    listen(dispatch) {
        this.websocket.addEventListener('open', () => {
            console.log('connect');

            this.websocket.addEventListener('message', message => {
                dispatch(actions.receiveMessages(message));

                this.websocket.send('{"type": "pong", "payload": null}');
            });
        });

    }

    send(type, payload) {
        this.websocket.send(JSON.stringify({
            type,
            payload: JSON.stringify(payload),
        }));
    }
}
