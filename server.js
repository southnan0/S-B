import path from 'path';
import express from 'express';
import bodyParser from 'body-parser';
import fs from 'fs';

import React from 'react';
import {renderToString} from 'react-dom/server';
import './app/appCommon/date';

const app = express();
const port = process.env.PORT || 80;

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(bodyParser.json());
app.use('/build', express.static(path.join(__dirname, 'build')));
app.use(handleRender);
var server = require('http').createServer(app);
var io = require('socket.io')(server);

import timer from './servers/timer';
import defaults from './servers/defaults';
let writerStream;
let createFileName = (room, type, fileType = 'txt')=> {
    return `./chatData/${room}${type}${(new Date()).format('yyyyMMdd')}.${fileType}`
};

let readData = (data)=> {
        let arr = data.toString().split('\n');
        let arrData = [];
        arr.map((item)=> {
            if(!item) return;
            try {
                let obj = JSON.parse(item.toString())
                arrData.push(obj)
            } catch (e) {
                console.info('===JSON.parse===');
                console.info(e)
            }
        });
        return arrData;
}

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
        let msg = {
            sender: socket.name,
            cnt: mes.writeMessage,
            sendTime: (new Date()).format('yyyy-MM-dd hh:mm:ss')
        };

        fs.appendFile(createFileName(socket.room, 'message'), JSON.stringify(msg) + '\n', (err)=> {
            if (err) throw err;
            io.to(socket.room).emit('message', {message: [msg]});
        })

    });

    socket.on('login', (obj)=> {
        socket.name = obj.userName;
        socket.room = obj.namespace || 'default';
        socket.join(socket.room);
        let hasOldMessage = false;
        let msgFile;
        try{
            msgFile = fs.readFileSync(createFileName(socket.room, 'message'));
            hasOldMessage = readData(msgFile);
        }catch(e){
            fs.appendFileSync(createFileName(socket.room, 'message'),'');
        }
        let hasLinkers = false;
        let usersFile;
        try{
            usersFile = fs.readFileSync(createFileName(socket.room, 'users'));
            hasLinkers = readData(usersFile);
        }catch(e){
            fs.appendFileSync(createFileName(socket.room, 'users'),'');
        }
        let users = {
            name: obj.userName,
            id: new Date().getTime() + (Math.random() * 10000).toFixed(0)
        };
        fs.appendFile(createFileName(socket.room, 'users'), JSON.stringify(users) + '\n', (err)=> {
            if (err) throw err;
            socket.emit('message', {
                hasLogin: true,
                userName: socket.name,
                linker: hasLinkers || [],
                message: hasOldMessage || []
            });

            io.to(socket.room).emit('message', {
                linker: [users]
            });
        });
    });
});

//todo  当某个用户推出登录时，清除用户表信息

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