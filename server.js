import path from 'path';
import express from 'express';
var compression = require('compression');
import bodyParser from 'body-parser';
import fs from 'fs';

import React from 'react';
import {renderToString} from 'react-dom/server';
import './app/appCommon/date';

const app = express();
const port = process.env.PORT || 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use(compression());
// app.use(express.logger());
app.use('/build', express.static(path.join(__dirname, 'build')));
app.use(handleRender);
const server = require('http').createServer(app);

import timer from './servers/timer';
import defaults from './servers/defaults';
import chatroom from './servers/chatroom';
import {upload} from './servers/upload';

chatroom(server);

function handleRender(req, res) {
    let {url} = req;
    if (url === '/time_sse.php') {
        timer(req, res);
    } else if (url.match(/\/voice\/(.*)/g)) {
        res.sendFile(__dirname + url);
    } else if (url.match(/uploadfiles/g)) {
        res.sendFile(__dirname + url);
    } else if (url === '/upload') {
        upload(req, res);
    } else {
        // req.url is the full url
        defaults(req, res);
    }
}

server.listen(port, () => {
    console.log('this server is running on ' + port)
});