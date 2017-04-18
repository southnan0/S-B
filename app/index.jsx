// 入口文件

import './main.less';
import './modules/style/chatRoom.less'

import React from 'react'
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import createHashHistory from 'history/lib/createHashHistory'

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
const history = createHashHistory();

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

ReactDOM.render(
    <div>
        <Provider store={ store }>
            {createRoutes(history)}
        </Provider>
        {/*renderDevTools(store)*/}
    </div>
, document.getElementById('app'));