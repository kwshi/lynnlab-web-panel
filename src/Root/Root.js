import React from 'react';
import * as Redux from 'redux';
import {connect} from 'react-redux';
import thunk from 'redux-thunk';
import {App} from './App/App';
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

