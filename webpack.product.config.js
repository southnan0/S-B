const webpack = require('webpack');
const path = require('path');
const merge = require('webpack-merge');
const CleanPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
// const HtmlwebpackPlugin = require('html-webpack-plugin');

const pkg = require('./package.json');
const common = require('./webpack.common.config');
const PATHS = {
    app: path.join(__dirname, 'app'),
    build: path.join(__dirname, 'build'),
    node_modules: path.join(__dirname, 'node_modules')
};
// pack into vendors unless server side depend on.
const whiteLists = [
    'express',
    'body-parser',
    'compression',
    'ejs'
]

const vendors = Object.keys(pkg.dependencies).filter((v) => {
    return whiteLists.indexOf(v) === -1
})

module.exports = merge(common, {
    entry: {
        app: PATHS.app,
        vendors: vendors
    },
    devtool: 'eval-source-map',
    debug: true,
    output: {
        path: PATHS.build,
        filename: '[name].[chunkhash:4].js',
        chunkFilename: '[chunkhash:4].js',
    },
    resolve: {
        alias: {
            // 'react': path.resolve(PATHS.node_modules, 'react/dist/react.js'),
            // 'react-dom': path.resolve(PATHS.node_modules, 'react-dom/dist/react-dom.js'),
            'react-redux': path.resolve(PATHS.node_modules, 'react-redux/dist/react-redux.js'),
            'react-router': path.resolve(PATHS.node_modules, 'react-router/lib/index.js'),
            'redux': path.resolve(PATHS.node_modules, 'redux/dist/redux.js')
        }
    },
    node: {
        console: true, fs: 'empty', tls: 'empty'
    },
    module: {
        noParse: [
            'ws'
        ],
        loaders: [
            {
                test: /\.(gif|jpg|png|woff|svg|eot|ttf)\??.*$/,
                loader: 'url-loader?limit=50000&name=[path][name].[ext]'
            },
            { test: /\.jsx?$/, loaders: ['babel'], include: PATHS.app },
            { test: /\.json$/, loaders: ['json'] },
            {test: /\.less$/, loader: ExtractTextPlugin.extract('style', 'css!less')},
            {test: /\.css$/, loader: ExtractTextPlugin.extract('style', 'css')}
        ]
    },
    externals: ['ws'],
    plugins: [
        new HtmlwebpackPlugin({
            template: 'node_modules/html-webpack-template/index.html',
            title: 'S-B',
            appMountId: 'app'
        }),
        new webpack.optimize.CommonsChunkPlugin({name: 'vendors'}),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false
            },
            sourceMap: false
        }),
        new webpack.DefinePlugin({
            'process.env': {
                NODE_ENV: '"production"'
            },
            __DEV__: false
        }),
        new CleanPlugin([PATHS.build]),
        new ExtractTextPlugin('[name].[contenthash:4].css')
    ]
})

