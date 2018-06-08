
export const RECEIVE_MESSAGE = 'websocket/RECEIVE_MESSAGE';

export const RECEIVE_LOG = 'websocket/RECEIVE_MESSAGE/RECEIVE_LOG';


export const receiveMessage = (json) => (dispatch, getState, websocket) => {
    const message = JSON.parse(json.data);

    switch (message.type) {
    case 'log':
        dispatch(receiveLog(message.payload));
    }

};

export const receiveLog = (entries) => ({
    type: RECEIVE_LOG,
    entries,
});

