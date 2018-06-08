import React from 'react';
import * as Redux from 'redux';
import {connect} from 'react-redux';
import thunk from 'redux-thunk';
import {App} from './App/App';
import * as actions from './actions';
import {store} from './store';
import './root.css';



const apps = [
    'DataLog',
    'DataPlotSingles',
    'DataPlotCoincidences',
    'DataBarSingles',
    'DataBarCoincidences',
];


const appNames = {
    DataLog: 'data log',
    DataPlotSingles: 'singles plot',
    DataPlotCoincidences: 'coincidences plot',
    DataBarSingles: 'singles bar plot',
    DataBarCoincidences: 'coincidences bar plot',
};


class Root_ extends React.Component {
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

export const Root = connect(
    state => ({state}),
    dispatch => ({
        on: {
            setApp: app => dispatch(actions.setApp(app)),
        },
    }),
)(Root_);

