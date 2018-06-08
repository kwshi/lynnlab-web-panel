

import * as React from 'react';

const timeString = time => (
    '' +
        time.getHours() + ':' +
        ('' + time.getMinutes()).padStart(2, '0') + ':' +
        ('' + time.getSeconds()).padStart(2, '0')
);

export const Entry = ({entry}) => {
    let values = Array(8);
    for (let i = 0; i < 8; ++i) {
        values[i] = Array(2);
        values[i][0] = (
            <td key={"mean" + i} className="mean">{entry.data[i].mean.toFixed(2)}</td>
        );
        values[i][1] = (
            <td key={"sem" + i} className="sem">{entry.data[i].sem.toFixed(2)}</td>
        );
    }


    return (
        <tr className={entry.sample%2 == 0 ? 'even' : 'odd'}>
          <td className="sample">{entry.sample}</td>
          <td className="time">
            {timeString(entry.time)}
          </td>
          {values}
        </tr>
    );
};


