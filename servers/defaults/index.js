import React from 'react';
import {renderToString} from 'react-dom/server';
import {match, RoutingContext} from 'react-router';
import {createStore, applyMiddleware, compose} from 'redux';
import {Provider} from 'react-redux';
import createLocation from 'history/lib/createLocation';
import createMemoryHistory from 'history/lib/createMemoryHistory';

import rootReducer from '../../app/reducers';
import middleware from '../../app/middleware';
import createRoutes from '../../app/routes/routes';

export default (req,res)=> {
    const history = createMemoryHistory();
    const routes = createRoutes(history);
    const location = createLocation(req.url);

    match({routes, location}, (err, redirectLocation, renderProps) => {
        if (err) {
            return res.status(500).send(err.message)
        }

        if (!renderProps) {
            return res.status(404).send('not found')
        }

        const store = compose(
            applyMiddleware.apply(this, middleware)
        )(createStore)(rootReducer);

        // render the component to string
        const initialView = renderToString(
            <div>
                <Provider store={store}>
                    { <RoutingContext {...renderProps} /> }
                </Provider>
            </div>
        );

        const initialState = store.getState();

        const assets = require('../../stats.json');

        res.render('index', {
            html: initialView,
            assets,
            initialState
        })
    })
}