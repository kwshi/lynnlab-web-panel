import React from 'react';
import './MotorConsole.css';

export const MotorConsole = ({on, state, motors, props}) => {

    const entries = Object.keys(motors).map(sn => (
        <li key={sn}>
          <div>
            <span className="serial">{sn}</span>
            <span className="position">{motors[sn].position}</span>
            <span className="moving">{motors[sn].moving ? 'moving' : 'idle'}</span>
          </div>
          <div>
            <input type="number"
                   value={state.position[sn]}
                   step={.1}
                   onChange={event => on.setMotorPosition(sn, event.target.value)}/>
              <input type="button" value="move"
                     onClick={event => on.moveMotor(sn, state.position[sn])}/>
          </div>
        </li>
    ));

    return (
        <div id="motor-console">
          <ul>
            {entries}
          </ul>
        </div>
    );

    
    
};
