
export const RECEIVE_MESSAGE = 'websocket/RECEIVE_MESSAGE';

export const RECEIVE_LOG = 'websocket/RECEIVE_MESSAGE/RECEIVE_LOG';


export const receiveMessage = (json) => (dispatch, store, websocket) => {
    const messages = JSON.parse(json.data);
    console.log("message");

    for (let message of messages) {
        switch (message.type) {
        case 'log':
            dispatch(receiveLog(message.payload));
        }
    }
};

export const receiveLog = (entries) => ({
    type: RECEIVE_LOG,
    entries,
});

