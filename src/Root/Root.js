import React from 'react';
import ReactDOM from 'react-dom';
import * as ReactRedux from 'react-redux';
import * as Redux from 'redux';
import thunk from 'redux-thunk';
import DataLinePlot from './App/DataPlot/DataLinePlot.js';
import {DataLog} from './App/DataLog/DataLog.js';
import DataBarPlot from './App/DataBar/DataBarPlot.js';
import * as actions from './actions';
import {store} from './store';
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

/*
  function getCurrentApp() {
  return window.location.hash.substring(1);
  }

  if (!apps.includes(getCurrentApp())) {
  window.location = '#' + apps[0];
  }
*/

const App = ReactRedux.connect(
    state => ({
        log: state.log,
        state: state.dataLog,
    }),
    dispatch => ({
        on: {
            setMaxEntries: entries => dispatch(actions.dataLog.setMaxEntries(entries)),
        }
    }),
)(DataLog);

class RootRedux extends React.Component {
    constructor(props) {
        super(props);
    }

    componentWillMount() {
        // open ws
        
    }
    
    render() {
        const {state, on} = this.props;

        const menuItems = apps.map(app => (
            <li key={app}
                className={state.currentApp == app ? 'active' : 'inactive'}>
              <a href="#" onClick={() => on.setApp(app)}>
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
                <App/>
              </div>
            </div>
        );
    }
}

const RootWrapped = ReactRedux.connect(
    state => ({state}),
    dispatch => ({
        on: {
            setApp: app => dispatch(actions.setApp(app)),
            
        },
    }),
)(RootRedux);

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
            barRangeSinglesAuto: false,
            barRangeSinglesMax: 100000,
            barRangeCoincidencesAuto: false,
            barRangeCoincidencesMax: 2000,
            plotRangeSinglesAuto: false,
            plotRangeSinglesMin: 0,
            plotRangeSinglesMax: 100000,
            plotRangeCoincidencesAuto: false,
            plotRangeCoincidencesMin: 0,
            plotRangeCoincidencesMax: 2000,
        };
        
        this.updateShowEntries = this.updateShowEntries.bind(this);
        this.updateShowChannels = this.updateShowChannels.bind(this);
        this.updatePlotEntries = this.updatePlotEntries.bind(this);
        this.updateShowErrorbars = this.updateShowErrorbars.bind(this);
        this.updateBarRangeSinglesAuto = this.updateBarRangeSinglesAuto.bind(this);
        this.updateBarRangeSinglesMax = this.updateBarRangeSinglesMax.bind(this);
        this.updateBarRangeCoincidencesAuto = this.updateBarRangeCoincidencesAuto.bind(this);
        this.updateBarRangeCoincidencesMax = this.updateBarRangeCoincidencesMax.bind(this);

        this.updatePlotRangeSinglesAuto = this.updatePlotRangeSinglesAuto.bind(this);
        this.updatePlotRangeSinglesMin = this.updatePlotRangeSinglesMin.bind(this);
        this.updatePlotRangeSinglesMax = this.updatePlotRangeSinglesMax.bind(this);
        this.updatePlotRangeCoincidencesAuto = this.updatePlotRangeCoincidencesAuto.bind(this);
        this.updatePlotRangeCoincidencesMin = this.updatePlotRangeCoincidencesMin.bind(this);
        this.updatePlotRangeCoincidencesMax = this.updatePlotRangeCoincidencesMax.bind(this);
    }

    componentDidMount() {
        
        this.ws = new window.WebSocket('ws://'+window.location.host+'/ws');

        this.messageReceived = messageBundle => {
            let log = this.state.log;
            let message = JSON.parse(messageBundle.data);

            if (message.type == 'log') {

                for (let dataEntry of message.payload) {
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
        let showChannels = Object.assign({},
                                         this.state.showChannels,
                                         {[event.target.name]: event.target.checked});
        this.setState({showChannels: showChannels});
    }

    updateShowErrorbars(event) {
        this.setState({showErrorbars: event.target.checked});
    }

    updateBarRangeSinglesAuto(event) {
        if (!event.target.checked) {
            return;
        }
        this.setState({barRangeSinglesAuto: !!event.target.value});
    }

    updateBarRangeSinglesMax(event) {
        let value = event.target.value;
        if (value < 0) {
            return;
        }
        this.setState({barRangeSinglesMax: value});
    }

    updateBarRangeCoincidencesAuto(event) {
        if (!event.target.checked) {
            return;
        }
        this.setState({barRangeCoincidencesAuto: !!event.target.value});
    }

    updateBarRangeCoincidencesMax(event) {
        let value = event.target.value;
        if (value < 0) {
            return;
        }
        this.setState({barRangeCoincidencesMax: value});
    }

    updatePlotRangeSinglesAuto(event) {
        if (!event.target.checked) {
            return;
        }
        this.setState({plotRangeSinglesAuto: !!event.target.value});
    }
    updatePlotRangeSinglesMin(event) {
        let value = event.target.value;
        if (value < 0) {
            return;
        }
        this.setState({plotRangeSinglesMin: value});
    }
    updatePlotRangeSinglesMax(event) {
        let value = event.target.value;
        if (value < 0) {
            return;
        }
        this.setState({plotRangeSinglesMax: value});
    }
    updatePlotRangeCoincidencesAuto(event) {
        if (!event.target.checked) {
            return;
        }
        this.setState({plotRangeCoincidencesAuto: !!event.target.value});
    }
    updatePlotRangeCoincidencesMin(event) {
        let value = event.target.value;
        if (value < 0) {
            return;
        }
        this.setState({plotRangeCoincidencesMin: value});
    }
    updatePlotRangeCoincidencesMax(event) {
        let value = event.target.value;
        if (value < 0) {
            return;
        }
        this.setState({plotRangeCoincidencesMax: value});
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
                  updateShowErrorbars={this.updateShowErrorbars}
                  rangeAuto={this.state.plotRangeSinglesAuto}
                  rangeMin={this.state.plotRangeSinglesMin}
                  rangeMax={this.state.plotRangeSinglesMax}
                  updateRangeAuto={this.updatePlotRangeSinglesAuto}
                  updateRangeMin={this.updatePlotRangeSinglesMin}
                  updateRangeMax={this.updatePlotRangeSinglesMax}/>
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
                  updateShowErrorbars={this.updateShowErrorbars}
                  rangeAuto={this.state.plotRangeCoincidencesAuto}
                  rangeMin={this.state.plotRangeCoincidencesMin}
                  rangeMax={this.state.plotRangeCoincidencesMax}
                  updateRangeAuto={this.updatePlotRangeCoincidencesAuto}
                  updateRangeMin={this.updatePlotRangeCoincidencesMin}
                  updateRangeMax={this.updatePlotRangeCoincidencesMax}/>
            );
            break;
        case 'data-bar-singles':
            app = (
                <DataBarPlot
                  log={this.state.log}
                  channels={[0, 1, 2, 3]}
                  showErrorbars={this.state.showErrorbars}
                  updateShowErrorbars={this.updateShowErrorbars}
                  rangeAuto={this.state.barRangeSinglesAuto}
                  updateRangeAuto={this.updateBarRangeSinglesAuto}
                  rangeMax={this.state.barRangeSinglesMax}
                  updateRangeMax={this.updateBarRangeSinglesMax}/>
            );
            break;
        case 'data-bar-coincidences':
            app = (
                <DataBarPlot
                  log={this.state.log}
                  channels={[4, 5, 6, 7]}
                  showErrorbars={this.state.showErrorbars}
                  updateShowErrorbars={this.updateShowErrorbars}
                  rangeAuto={this.state.barRangeCoincidencesAuto}
                  updateRangeAuto={this.updateBarRangeCoincidencesAuto}
                  rangeMax={this.state.barRangeCoincidencesMax}
                  updateRangeMax={this.updateBarRangeCoincidencesMax}/>
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
        <ReactRedux.Provider store={store}>
          <RootWrapped/>
        </ReactRedux.Provider>,
        document.getElementById('root'),
    );

}

window.addEventListener('hashchange', render);

render();
