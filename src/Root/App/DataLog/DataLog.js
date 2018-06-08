import React from 'react';

const columnKeys = [
    'C0 (A)',
    'C1 (B)',
    'C2 (A\')',
    'C3 (B\')',
    'C4',
    'C5',
    'C6',
    'C7',
];


export const DataLog = ({log, state, on}) => {
    const rows = log.slice(
        state.maxEntries > log.length ?
            0 :
            -state.maxEntries
    ).map(entry => {
        return (
            <DataLogEntry key={entry.sample} entry={entry}/>
        );
    });

    const headers = columnKeys.map(column => (
        <th colSpan="2" key={column}>
          <span>{column}</span><div>{column}</div>
        </th>
    ));
    
    
    return (
        <div className="main-panel-box">
          <div id="entries-options" className="toolbar">
            <span className="input-section">
              <label htmlFor="entries">maximum number of entries to show:</label>
              <input name="entries" type="number"
                     value={state.maxEntries}
                     onChange={event => on.setMaxEntries(event.target.value)}/>
            </span>
          </div>
          <div id="entries-container" className="container">
            <div id="entries-header"></div>
            <div id="entries-scroll">
              <table id="entries-table">
                <thead>
                  <tr>
                    <th>
                      <span>sample</span><div>sample</div>
                    </th>
                    <th>
                      <span>time</span><div>time</div>
                    </th>
                    {headers}
                  </tr>
                </thead>
                <tbody>
                  {rows}
                </tbody> 
              </table>
            </div>
          </div>
        </div>
    );
};


const dateString = () => {
    let time = this.props.time;
    return '' + time.getFullYear() + '-' + time.getMonth();
};

const DataLogEntry = ({entry}) => {
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
            {entry.time.getHours()}:
            {('' + entry.time.getMinutes()).padStart(2, '0')}:
            {('' + entry.time.getSeconds()).padStart(2, '0')}
          </td>
          {values}
        </tr>
    );
};


