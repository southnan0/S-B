import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';

import React from 'react';
import {renderToString} from 'react-dom/server';
import './app/appCommon/date';

const app = express();
const port = process.env.PORT || 3000;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use('/build', express.static(path.join(__dirname, 'build')));
app.use(handleRender);
var server = require('http').createServer(app);
var io = require('socket.io')(server);

import timer from './servers/timer';
import defaults from './servers/defaults';

io.on('connection', function (socket) {
    socket.on('message', (mes)=> {
        if (!socket.name) {
            return socket.emit('login');
        }
        /*socket.to(socket.room).emit('message', {
         sender: socket.name,
         cnt: mes.writeMessage,
         sendTime: new Date()
         });*/

        io.to(socket.room).emit('message', {
            sender: socket.name,
            cnt: mes.writeMessage,
            sendTime: (new Date()).format('yyyy-MM-dd hh:mm:ss')
        });
    });

    socket.on('login', (obj)=> {
        socket.name = obj.userName;
        socket.room = obj.namespace || 'default';
        socket.join(socket.room);
        //todo   如果用socket.emit 的话，别人上线，自己不知道。  还没调通
        socket.emit('message', {
            hasLogin: true
            , userName: socket.name
        });
        io.to(socket.room).emit('message', {
            linker: {
                name: obj.userName,
                id: new Date().getTime() + (Math.random() * 10000).toFixed(0)
            }
        });
    });
    if (socket.name) {
        io.emit('broadcasted', {
            message: socket.name + '上线啦~'
        })
    }
});

function handleRender(req, res) {
    if (req.url === '/time_sse.php') {
        timer(req, res);
    } else if (req.url.match(/\/voice\/(.*)/g)) {
        let url = req.url.match(/\/voice\/(.*)/g)[0];
        res.sendFile(__dirname + url);
    } else {
        // req.url is the full url
        defaults(req, res);
    }
}

server.listen(port, () => {
    console.log('this server is running on ' + port)
});