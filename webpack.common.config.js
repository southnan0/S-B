const webpack = require('webpack');
const path = require('path');
const PATHS = {
    app: path.join(__dirname, 'app'),
    build: path.join(__dirname, 'build'),
    node_modules: path.join(__dirname, 'node_modules')
};

const TARGET = process.env.npm_lifecycle_event;
process.env.BABEL_ENV = TARGET;

module.exports= {
    entry: [
        PATHS.app
    ],
    output: {
        path: PATHS.build,
        filename: 'bundle.js'
    },
    resolve: {
        extensions: ['.js', '.jsx', '.json']
    },
    //todo  hot replace
    plugins: [
        new webpack.DefinePlugin({
            __DEBUG__: JSON.stringify(JSON.parse((TARGET === 'start') || 'false'))
        })]
};