import './main.less';
import './modules/style/chatRoom.less'

import React from 'react'
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import createBrowserHistory from 'history/lib/createBrowserHistory';

import createRoutes from './routes/routes';
import configureStore from './store/configureStore';
import { fromJS } from 'immutable';

const initialState = window.__INITIAL_STATE__;
if(initialState) {
    Object.keys(initialState).forEach(key => {
        initialState[key] = fromJS(initialState[key])
    })
}
const store = configureStore(initialState);
const history = createBrowserHistory();

function renderDevTools(store) {
    if(__DEBUG__) {
        const DevTools = require('./modules/DevTools').default;
        return (
            <DevTools store={ store }/>
        )
    }else {
        return null
    }
}

const rootNode = document.getElementById('app');

let render = ()=>
    ReactDOM.render(
        <div>
            <Provider store={ store }>
                {createRoutes(history)}
            </Provider>
            {renderDevTools(store)}
        </div>
    , rootNode);

if (__DEV__) {
    if (module.hot) {
        // Development render functions
        const renderApp = render;
        const renderError = (error) => {
            const RedBox = require('redbox-react').default

            ReactDOM.render(<RedBox error={error} />, MOUNT_NODE)
        };

        // Wrap render in try/catch
        render = () => {
            try {
                renderApp()
            } catch (error) {
                renderError(error)
            }
        };

        // Setup hot module replacement
        module.hot.accept('./routes/routes', () =>
            setImmediate(() => {
                ReactDOM.unmountComponentAtNode(rootNode);
                render()
            })
        )
    }
}

render()