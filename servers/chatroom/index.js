import fs from 'fs';
let socketIO = require('socket.io');

let createFileName = (room, type, fileType = 'txt') => {
    return `./chatData/${room}${type}${(new Date()).format('yyyyMMdd')}.${fileType}`
};

let readData = (data) => {
    let arr = data.toString().split('\n');
    let arrData = [];
    arr.map((item) => {
        if (!item) return;
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

export default (server) => {
    let io = socketIO(server);

    io.on('connection', function (socket) {
    socket.on('message', (mes) => {
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

        fs.appendFile(createFileName(socket.room, 'message'), JSON.stringify(msg) + '\n', (err) => {
            if (err) throw err;
            io.to(socket.room).emit('message', { message: [msg] });
        })
    });

    socket.on('login', (obj) => {
        socket.name = obj.userName;
        socket.room = obj.namespace || 'default';
        socket.join(socket.room);
        let hasOldMessage = false;
        let msgFile;
        try {
            msgFile = fs.readFileSync(createFileName(socket.room, 'message'));
            hasOldMessage = readData(msgFile);
        } catch (e) {
            fs.appendFileSync(createFileName(socket.room, 'message'), '');
        }
        let hasLinkers = false;
        let usersFile;
        try {
            usersFile = fs.readFileSync(createFileName(socket.room, 'users'));
            hasLinkers = readData(usersFile);
        } catch (e) {
            fs.appendFileSync(createFileName(socket.room, 'users'), '');
        }
        let users = {
            name: obj.userName,
            id: new Date().getTime() + (Math.random() * 10000).toFixed(0)
        };
        fs.appendFile(createFileName(socket.room, 'users'), JSON.stringify(users) + '\n', (err) => {
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
}




