import React from 'react';
import ReactDOM from 'react-dom';
import DataPlot from './DataLinePlot.js';
import DataLog from './DataLog.js';
import './root.css';


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



ReactDOM.render(
    <Root/>,
    document.getElementById('root'),
);

