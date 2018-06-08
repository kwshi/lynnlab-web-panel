import React from 'react';
import {Entry} from './Entry/Entry';

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
            <Entry key={entry.sample} entry={entry}/>
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

