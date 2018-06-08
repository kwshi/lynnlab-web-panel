import {Root} from './Root/Root';
import {Provider} from 'react-redux';
import ReactDOM from 'react-dom';
import React from 'react';
import {store} from './Root/store';


function render() {
    ReactDOM.render(
        <Provider store={store}>
          <Root/>
        </Provider>,
        document.getElementById('root'),
    );

}

window.addEventListener('hashchange', render);

render();
