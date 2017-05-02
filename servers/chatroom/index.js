import fs from 'fs';
let socketIO = require('socket.io');

let createFileName = (room='', type, fileType = 'txt') => {
    return `./chatData/${room}${type}.${fileType}`
};

//读取历史信息
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

// 获取历史消息记录
const getOldMessage = (room)=>{
    let hasOldMessage = false;
    let msgFile;

    try {
        msgFile = fs.readFileSync(createFileName(room, 'message'));
        hasOldMessage = readData(msgFile);
    } catch (e) {
        fs.appendFileSync(createFileName(room, 'message'), '');
    }

    return hasOldMessage;
}

//获取联系人列表
const getLinkers = (room)=>{
    let hasLinkers = false;
    let usersFile;
    try {
        usersFile = fs.readFileSync(createFileName(room, 'users'));
        hasLinkers = readData(usersFile);
    } catch (e) {
        fs.appendFileSync(createFileName(room, 'users'), '');
    }
    return hasLinkers;
}

//检查是否需要登录
const checkLogon = (userName)=>{
    const allLinkers = getLinkers() || [];

    return allLinkers.find((user)=>user.name === userName) || {};
}

//校验密码是否正确
const checkUserPassword = (storePassword,password)=>{
    return storePassword === password;
}


//用户注册
const doLogon = (users,room)=>{
    const linker = Object.assign({},users,{id: new Date().getTime() + (Math.random() * 10000).toFixed(0)});
    try{
        fs.appendFileSync(createFileName(room, 'users'), JSON.stringify(linker) + '\n');
        return linker;
    }catch(e){
        throw e;
    }
}

export default (server) => {
    let io = socketIO(server);
    //todo 用于查看当前所有连接的id
    io.of('/').adapter.clients((err,clients)=>{
        if(err) {
            return console.info(err)
        }
        console.info(clients)
    });

    io.on('connection', function (socket) { 
        socket.on('message', (mes) => {
            if (socket.name) {
                let msg = {
                    sender: socket.name,
                    cnt: mes.writeMessage,
                    sendTime: (new Date()).format('yyyy-MM-dd hh:mm:ss')
                };

                return fs.appendFile(createFileName(socket.room, 'message'), JSON.stringify(msg) + '\n', (err) => {
                    if (err) throw err;
                    io.to(socket.room).emit('message', { message: [msg] });
                });
            }

            return socket.emit('login');
        });

        socket.on('login', (obj) => {
            socket.name = obj.userName;
            socket.password = obj.password;
            
            let linker = checkLogon(obj.userName);
            let users = {
                name: obj.userName,
                password:obj.password
            };
            if(!linker.name){
                linker = doLogon(users,socket.room);
            }else if(!checkUserPassword(linker.password,obj.password)){
                return socket.emit('login', {
                    hasLogin: false,
                    userName:obj.userName,
                    errorCode:'9',
                    errorMessage:'用戶名密碼錯誤'
                });
            }

            Object.assign(users,{id:linker.id});
            socket.idid = linker.id;

            if(!io.users){
                io.users = {};
            }

            io.users[obj.userName] = 'online';

            socket.room = obj.room || 'default';
            socket.join(socket.room);
            
            // 向房间广播通知谁上线了。
            io.to(socket.room).emit('online',{
                linker
            });

            let hasOldMessage = getOldMessage(socket.room) || [];

            let hasLinkers = getLinkers('') || [];

            let allUsers = [];
            hasLinkers.map((user)=>{
                allUsers.push(Object.assign({status:io.users[user.name]},user));
            });

            socket.emit('login', {
                hasLogin: true,
                userName: socket.name,
                linker: allUsers,
                message: hasOldMessage
            });        
        });

        socket.on('disconnect',()=>{
            io.to(socket.room).emit('offline',{
                linker:{
                    name:socket.name,
                    id:socket.idid,
                    password:socket.password
                }
            });
        })
    });
}




