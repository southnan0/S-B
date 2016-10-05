const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const CleanPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

const common = require('./webpack.common.config');
const PATHS = {
    app: path.join(__dirname, 'app'),
    build: path.join(__dirname, 'build'),
    node_modules: path.join(__dirname, 'node_modules')
}

module.exports = merge(common, {
    output: {
        path: path.join(__dirname, 'dev'),
        publicPath: '/dev/',
        filename: 'bundle.js'
    },
    devtool: 'eval-source-map',
    debug: true,
    watch: true,
    watchOptions: {
        aggregateTimeout: 300,
        poll: 1000
    },
    colors: true,
    module: {
        loaders: [
            { test: /\.less$/, loader: 'style!css!less', include: PATHS.app },
            { test: /\.css$/, loaders: ['style', 'css'], include: PATHS.app }
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.DefinePlugin({
            __DEV__: true,
            __WINDOW__: {}
        })
    ]
})








