import React from 'react';
import ReactDOM from 'react-dom';
import DataLinePlot from './DataLinePlot.js';
import DataLog from './DataLog.js';
import DataBarPlot from './DataBarPlot.js';
import './root.css';

const apps = [
    'data-log',
    'data-plot-singles',
    'data-plot-coincidences',
    'data-bar-singles',
    'data-bar-coincidences',
];

const appNames = {
    'data-log': 'data log',
    'data-plot-singles': 'singles plot',
    'data-plot-coincidences': 'coincidences plot',
    'data-bar-singles': 'singles bar plot',
    'data-bar-coincidences': 'coincidences bar plot',
};

function getCurrentApp() {
    return window.location.hash.substring(1);
}

if (!apps.includes(getCurrentApp())) {
    window.location = '#' + apps[0];
}

class Root extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            app: 'data-bar-coincidences',
            log: [],
            showEntries: 100,
            showChannels: {
                0: true, 1: true, 2: false, 3: false,
                4: true, 5: false, 6: false, 7: false
            },
            plotEntries: 100,
            showErrorbars: false,
        };
        
        this.updateShowEntries = this.updateShowEntries.bind(this);
        this.updateShowChannels = this.updateShowChannels.bind(this);
        this.updatePlotEntries = this.updatePlotEntries.bind(this);
        this.updateShowErrorbars = this.updateShowErrorbars.bind(this);
    }

    componentDidMount() {
        
        this.ws = new window.WebSocket('ws://'+window.location.host+'/ws');

        this.messageReceived = messageBundle => {
            let log = this.state.log;
            let message = JSON.parse(messageBundle.data);

            if (message.type == 'data-log' || message.type == 'data-dump') {
                
                message.payload.time = Date(message.payload.time);
                for (let i = 0; i < message.payload.length; ++i) {
                    let dataEntry = message.payload[i];
                    dataEntry.time = new Date(dataEntry.time);
                    log = [...log, dataEntry];
                }
                
            }

            
            this.setState({log: log});
            
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

    updateShowEntries(event) {
        let value = event.target.value;
        if (value < 1 || value > 500) {
            return;
        }
        this.setState({showEntries: value});
    };

    updatePlotEntries(event) {
        let value = event.target.value;
        if (value < 1 || value > 500) {
            return;
        }
        this.setState({plotEntries: value});
    };

    updateShowChannels(event) {
        let showChannels = Object.assign(this.state.showChannels,
                                         {[event.target.name]: event.target.checked});
        this.setState({showChannels: showChannels});
    }

    updateShowErrorbars(event) {
        this.setState({showErrorbars: event.target.checked});
    }
    
    render() {

        let app;
        switch (getCurrentApp()) {
        case 'data-log':
            app = (
                <DataLog
                  log={this.state.log}
                  showEntries={this.state.showEntries}
                  updateShowEntries={this.updateShowEntries}/>
            );
            break;
        case 'data-plot-singles':
            app = (
                <DataLinePlot
                  log={this.state.log}
                  showChannels={this.state.showChannels}
                  channels={[0, 1, 2, 3]}
                  toggleChannel={this.updateShowChannels}
                  plotEntries={this.state.plotEntries}
                  updatePlotEntries={this.updatePlotEntries}
                  showErrorbars={this.state.showErrorbars}
                  updateShowErrorbars={this.updateShowErrorbars}/>
            );
                break;
                case 'data-plot-coincidences':
                app = (
                    <DataLinePlot
                      log={this.state.log}
                      showChannels={this.state.showChannels}
                      channels={[4, 5, 6, 7]}
                      toggleChannel={this.updateShowChannels}
                      plotEntries={this.state.plotEntries}
                      updatePlotEntries={this.updatePlotEntries}
                      showErrorbars={this.state.showErrorbars}
                      updateShowErrorbars={this.updateShowErrorbars}/>
                );
            break;
        case 'data-bar-singles':
            app = (
                <DataBarPlot
                  log={this.state.log}
                  channels={[0, 1, 2, 3]}
                  showErrorbars={this.state.showErrorbars}
                  updateShowErrorbars={this.updateShowErrorbars}/>
            );
            break;
        case 'data-bar-coincidences':
                app = (
                    <DataBarPlot
                      log={this.state.log}
                      channels={[4, 5, 6, 7]}
                      showErrorbars={this.state.showErrorbars}
                      updateShowErrorbars={this.updateShowErrorbars}/>
                );
                break;
            default:
                app = <div></div>;
            }


            let menuItems = apps.map(app => (
                <li key={app}
                    className={getCurrentApp() == app ? 'active' : 'inactive'}>
                  <a href={'#' + app}>
                    {appNames[app]}
                  </a>
                </li>
            ));

            return (
                <div>
                  <div id="navigation-bar">
                    <ul>
                      {menuItems}
                    </ul>
                  </div>
                  <div id="main-panel">
                    {app}
                  </div>
                </div>
            );
        }
}

function render() {
    ReactDOM.render(
        <Root/>,
        document.getElementById('root'),
    );

}

window.addEventListener('hashchange', render);

render();

