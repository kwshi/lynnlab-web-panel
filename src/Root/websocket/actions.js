
export const RECEIVE_MESSAGE = 'websocket/RECEIVE_MESSAGE';

export const RECEIVE_LOG = 'websocket/RECEIVE_MESSAGE/RECEIVE_LOG';
export const RECEIVE_MOTOR_LIST = 'websocket/RECEIVE_MESSAGE/RECEIVE_MOTOR_LIST';
export const RECEIVE_MOTOR_STATE = 'websocket/RECEIVE_MESSAGE/RECEIVE_MOTOR_STATE';



export const receiveMessages = (json) => (dispatch, store, websocket) => {
    const messages = JSON.parse(json.data);

    for (let message of messages) {
        dispatch(receiveMessage(message));

        dispatch({
            log: receiveLog,
            motorList: receiveMotorList,
            motorState: receiveMotorState,
        }[message.type](message.payload));
    }
};

export const receiveMessage = message => ({
    type: RECEIVE_MESSAGE,
    message,
});

export const receiveLog = (entries) => ({
    type: RECEIVE_LOG,
    entries,
});

export const receiveMotorList = list => ({
    type: RECEIVE_MOTOR_LIST,
    list,
});


export const receiveMotorState = state => ({
    type: RECEIVE_MOTOR_STATE,
    state,
});

export const sendMotorMove = (motor, position) => (dispatch, store, websocket) => {
    websocket.send('motor-move', {
        motor,
        position,
    });
};

