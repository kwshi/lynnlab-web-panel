import * as websocket_ from '../../websocket/actions';
export const websocket = websocket_;


export const SET_MOTOR_POSITION = 'App/MotorConsole/SET_MOTOR_POSITION';


export const setMotorPosition = (sn, position) => ({
    type: SET_MOTOR_POSITION,
    sn,
    position,
});




