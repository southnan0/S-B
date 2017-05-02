import {isEmpty,pick} from 'lodash';
import {removeReducerPrefixer} from '../../appCommon/prefix';
import {chatRoom} from '../setting';
const {actionTypes} = chatRoom;
const io = require('socket.io-client');
let socket;
export const setMessage = (data)=> {
    return {
        type: actionTypes.SET_MESSAGE,
        payload: data
    }
};

export const initChat = ()=> {
    return (dispatch, getState)=> {
        __DEV__ || (socket = new io());
        socket.on('login', (data)=> {
            let {chat} = removeReducerPrefixer(getState(), 'CHAT_ROOM');
            chat = chat.toJS();

            if(data && data.linker && data.linker.length>0){
                data.linker.map((l)=>{
                    let id = l.id;
                    chat.linker || (chat.linker = {});
                    chat.linker['_l' + id] = l.name;
                });
                dispatch(setMessage(Object.assign({}, chat, pick(data, 'hasLogin','userName','message'))));
            }else if(!data.hasLogin){
                dispatch(setMessage(pick(data, 'hasLogin','errorMessage')))
            }else{
                console.info('您尚未登录')
            }
        });

        socket.on('online',({linker})=>{
            let {chat} = removeReducerPrefixer(getState(), 'CHAT_ROOM');
            chat = chat.toJS();
            chat.linker || (chat.linker = {});
            chat.linker['_l'+linker.id] = linker.name;
            dispatch(setMessage(chat));
        });

        socket.on('message', (data)=> {
            let {chat} = removeReducerPrefixer(getState(), 'CHAT_ROOM');
            chat = chat.toJS();
            let {message=[]} = chat;
            isEmpty(data.message) || (message = message.concat(data.message));
            chat.message = message;
            dispatch(setMessage(Object.assign({}, chat, pick(data, 'hasLogin','userName'))));
        });

        socket.on('broadcasted', (data)=> {
            console.info(data.message);
        });

        socket.on('disconnect',function(){
            console.info(arguments)
            console.info('您已成功退出！')
        });

        socket.on('offline',({linker})=>{
            console.info(linker.name+'下线了。')
        })
    }
};

export const sendMessage = (message)=> {
    return (dispatch)=> {
        socket.emit('message', message);
    }
};

export const login = (data)=> {
    return (dispatch)=> {
        socket.emit('login', data);
    }
};

export const exit = ()=>{
    return ()=>{
        socket.close();
    }
}