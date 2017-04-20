const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const CleanPlugin = require('clean-webpack-plugin');


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
            {
                test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
                loader: 'url-loader?limit=50000&name=[path][name].[ext]'
            },
            { test: /\.jsx?$/, loaders: ['babel'], include: PATHS.app },
            {test: /\.less$/, loader: 'style!css!less'},
            {test: /\.css$/, loaders: ['style', 'css']}
        ]
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new webpack.NoErrorsPlugin(),
        new webpack.DefinePlugin({
            __DEV__: true,
            __WINDOW__: {}
        })
    ]
})








