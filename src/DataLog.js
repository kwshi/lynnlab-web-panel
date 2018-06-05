import React from 'react';


export default class DataLog extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            scrollTop: 0,
        };


    }


    componentDidUpdate() {
    }

    
    render() {
        const rows  = this.props.log.slice(
            this.props.showEntries > this.props.log.length ?
                0 :
                -this.props.showEntries
        ).map(entry => {
            return (
                <DataLogEntry key={entry.sample}
                              sample={entry.sample} time={entry.time}
                              mean={entry.mean} sem={entry.sem}/>
            );
        });

        
        return (
            <div className="main-panel-box">
              <div id="entries-options" className="toolbar">
                <span className="input-section">
                  <label htmlFor="entries">maximum number of entries to show:</label>
                  <input name="entries" type="number"
                         value={this.props.showEntries}
                         onChange={this.props.updateShowEntries}/>
                </span>
              </div>
              <div id="entries-container" className="container"
                   ref={element => { this.container = element; }}>
                <div id="entries-header"></div>
                <div id="entries-scroll"
                     ref={element => { this.scroller = element; }}>
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
    }
}

class DataLogEntry extends React.Component {
    constructor(props) {
        super(props);
    }

    dateString() {
        let time = this.props.time;
        return '' + time.getFullYear() + '-' + time.getMonth();
    }

    render() {
        let values = Array(8);
        for (let i = 0; i < 8; ++i) {
            values[i] = Array(2);
            values[i][0] = (
                <td key={"mean" + i} className="mean">{this.props.mean[i].toFixed(2)}</td>
            );
            values[i][1] = (
                <td key={"sem" + i} className="sem">{this.props.sem[i].toFixed(2)}</td>
            );
        }

        
        return (
            <tr className={this.props.sample%2 == 0 ? 'even' : 'odd'}>
              <td className="sample">{this.props.sample}</td>
              <td className="time">
                {this.props.time.getHours()}:
                {('' + this.props.time.getMinutes()).padStart(2, '0')}:
                {('' + this.props.time.getSeconds()).padStart(2, '0')}
              </td>
              {values}
            </tr>
        );
    }
}
    
