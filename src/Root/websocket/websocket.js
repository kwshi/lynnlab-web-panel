
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
                dispatch(actions.receiveMessage(message));
            });
        });

    }
}
