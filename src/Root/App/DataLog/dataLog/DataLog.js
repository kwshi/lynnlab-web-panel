import React from 'react';


export const DataLog = ({log, state, on}) => {
    const rows = log.slice(
         state.showEntries > log.length ?
             0 :
             -state.showEntries
     ).map(entry => {
         return (
             <DataLogEntry entry={entry}/>
         );
     });
     
     
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
                     <th colSpan="2">
                       <span>C0 (A)</span><div>C0 (A)</div>
                     </th>
                     <th colSpan="2">
                       <span>C1 (B)</span><div>C1 (B)</div>
                     </th>
                     <th colSpan="2">
                       <span>C2 (A')</span><div>C2 (A')</div>
                     </th>
                     <th colSpan="2">
                       <span>C3 (B')</span><div>C3 (B')</div>
                     </th>
                     <th colSpan="2">
                       <span>C4</span><div>C4</div>
                     </th>
                     <th colSpan="2">
                       <span>C5</span><div>C5</div>
                     </th>
                     <th colSpan="2">
                       <span>C6</span><div>C6</div>
                     </th>
                     <th colSpan="2">
                       <span>C7</span><div>C7</div>
                     </th>
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


