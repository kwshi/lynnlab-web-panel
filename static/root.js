

//const Plot = createPlotlyComponent(Plotly);

class Root extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            app: 'data-plot',
            dataLog: [],
        };

    }

    componentDidMount() {

        this.ws = new WebSocket('ws://'+location.host+'/ws');

        this.messageReceived = messageBundle => {
            let dataLog = this.state.dataLog;
            let message = JSON.parse(messageBundle.data);

            if (message.type == 'data-log' || message.type == 'data-dump') {
                
                message.payload.time = Date(message.payload.time);
                for (let i = 0; i < message.payload.length; ++i) {
                    let dataEntry = message.payload[i];
                    dataEntry.time = new Date(dataEntry.time);
                    dataLog.push(dataEntry);
                }
                
            }

            
            this.setState({dataLog: dataLog});
            
        };

        this.onConnectionOpen = () => {
            console.log('connected');
            this.ws.addEventListener('message', this.messageReceived);
        };

        this.ws.addEventListener('open', this.onConnectionOpen);
    }
    
    componentWillUnmount() {
        this.ws.removeEventListener('open', this.onConnectionOpen);
        this.ws.removeEventListener('message', this.messageReceived);
    }

    selectApp(app) {
        this.setState({app: app});
    }

    render() {
        let activeClass = app => this.state.app == app ? 'active' : 'inactive';

        let app = <div></div>;
        if (this.state.app == 'data-log') {
            app = <DataLog log={this.state.dataLog}/>;
        } else if (this.state.app == 'data-plot') {
            app = <DataPlot log={this.state.dataLog}/>;
        }


        return (
            <div>
              <div id="navigation-bar">
                <ul>
                  <li className={activeClass('data-log')}
                      onClick={() => this.selectApp('data-log')}>Live data log</li>
                  <li className={activeClass('data-plot')}
                      onClick={() => this.selectApp('data-plot')}>Live plots</li>
                  <li className={activeClass('motor')}
                      onClick={() => this.selectApp('motor')}>Motor controller</li>
                  <li className={activeClass('data-record')}
                      onClick={() => this.selectApp('data-record')}>Record data</li>
                  <li className={activeClass('scripts')}
                      onClick={() => this.selectApp('scripts')}>Automated scripts</li>
                </ul>
              </div>
              <div id="main-panel">
                {app}
              </div>
            </div>
        );
    }
}


class DataLog extends React.Component {
        constructor(props) {
            super(props);

            this.state = {
                scrollTop: 0,
                showEntries: 100,
            };

            this.setShowEntries = event => {
                let value = event.target.value;
                if (value < 1 || value > 500) {
                    return;
                }
                this.setState({showEntries: value});
            };

        }


        componentDidUpdate() {
        }

        
        render() {
            const rows  = this.props.log.slice(
                this.state.showEntries > this.props.log.length ?
                    0 :
                    -this.state.showEntries
            ).map(entry => {
                return (
                    <DataLogEntry key={entry.sample}
                                  sample={entry.sample} time={entry.time}
                                  mean={entry.mean} sem={entry.sem}/>
                );
            });

            
            return (
                <div>
                  <div id="entries-options">
                    <label htmlFor="entries">maximum number of entries to show:</label>
                    <input name="entries" type="number"
                           value={this.state.showEntries}
                           onChange={this.setShowEntries}/>
                  </div>
                  <div id="entries-container"
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
        let values = Array(8*2);
        for (let i = 0; i < 8; ++i) {
            values[2*i] = (
                <td key={"mean" + i} className="mean">{this.props.mean[i].toFixed(2)}</td>
            );
            values[2*i+1] = (
                <td key={"sem" + i} className="sem">{this.props.sem[i].toFixed(2)}</td>
            );
        }

        
        return (
            <tr className={this.props.sample%2 == 0 ? 'even' : 'odd'}>
              <td className="sample">{this.props.sample}</td>
              <td className="time">
                {this.props.time.getHours()}:
                {this.props.time.getMinutes()}:
                {this.props.time.getSeconds()}
              </td>
              {values}
            </tr>
        );
    }
}

class DataPlot extends React.Component {
    constructor(props) {
        super(props);


        this.state = {
            layout: {
                autosize: true,
                margin: {
                    l: 0,
                    r: 0,
                    b: 0,
                    t: 0,
                    pad: 0,
                },
            },
            frames: [],
            config: {},
        };
    }
    render() {
        let x = this.props.log.slice(-100).map(entry => entry.sample);
        let y = this.props.log.slice(-100).map(entry => entry.mean[0]);
        

        return (
            <div id="plot-container">
              <Recharts.LineChart width={800} height={400}
                                  data={[
                                      {uv: 1},
                                      {uv: 2},
                                      {uv: 1.5},
                                  ]}>
                <Recharts.Line type="monotone" dataKey="uv" stroke="#8884d8" />
              </Recharts.LineChart>
            </div>
        );
    }
}



ReactDOM.render(
        <Root/>,
        document.getElementById('root'),
    );

    //ReactDOM.render(
//    dataLog,
//    document.getElementById('log-panel')
//);

