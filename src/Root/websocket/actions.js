
export const RECEIVE_MESSAGE = 'websocket/RECEIVE_MESSAGE';

export const RECEIVE_LOG = 'websocket/RECEIVE_MESSAGE/RECEIVE_LOG';


export const receiveMessage = (json) => {
    const message = JSON.parse(json.data);

    switch (message.type) {
    case 'log':
        return receiveLog(message.payload);
    }
};

export const receiveLog = (entries) => ({
    type: RECEIVE_LOG,
    entries,
});

