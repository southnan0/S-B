// 路由

import React from 'react';
import {Router, Route, IndexRoute, Redirect} from 'react-router'

import App from '../modules';
import Home from '../modules/home';
// import NotFound from '../modules/notFound';
//import Sse from '../containers/sse.jsx';
import ChatRoom from '../modules/chatRoom';
import  Test from '../modules/test';

function routes(history) {
    return (
        <Router history={history}>
            <Route path="/" component={App}>
                <IndexRoute component={Home}/>
                <Route path="home" component={Home}/>
                <Route path="chatRoom" component={ChatRoom}/>
                <Route path="test" component={Test}/>
                <Route path="404" component={App} />
                <Redirect from='*' to='/404'/>
            </Route>
        </Router>
    )
}

export default routes;