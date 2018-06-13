
export const RECEIVE_MESSAGE = 'websocket/RECEIVE_MESSAGE';

export const RECEIVE_LOG = 'websocket/RECEIVE_MESSAGE/RECEIVE_LOG';
export const RECEIVE_MOTOR_LIST = 'websocket/RECEIVE_MESSAGE/RECEIVE_MOTOR_LIST';
export const RECEIVE_MOTOR_STATE = 'websocket/RECEIVE_MESSAGE/RECEIVE_MOTOR_STATE';



export const receiveMessage = (json) => (dispatch, store, websocket) => {
    const messages = JSON.parse(json.data);

    for (let message of messages) {
        switch (message.type) {
        case 'log':
            dispatch(receiveLog(message.payload));
        case '':
        }
    }
};

export const receiveLog = (entries) => ({
    type: RECEIVE_LOG,
    entries,
});



export const receiveMotorState = state => ({
    type: RECEIVE_MOTOR_STATE,
    state,
});
