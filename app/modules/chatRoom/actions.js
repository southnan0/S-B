import _ from 'lodash';
import {removeReducerPrefixer} from '../../appCommon/prefix';
import {chatRoom} from '../setting';
const {actionTypes} = chatRoom;
let socket;
export const setMessage = (data)=> {
    return {
        type: actionTypes.SET_MESSAGE,
        payload: data
    }
};

export const initChat = ()=> {
    return (dispatch, getState)=> {
        socket = new io();
        socket.on('login', (obj)=> {
            let {chat} = removeReducerPrefixer(getState(), 'CHAT_ROOM');
            chat = chat.toJS();
            let {message=[]} = chat;

            dispatch(setMessage(_.extend({}, chat, obj)));
        });

        socket.on('message', (data)=> {
            let {chat} = removeReducerPrefixer(getState(), 'CHAT_ROOM');
            chat = chat.toJS();
            let {message=[]} = chat;

            let m = _.omit(data, 'hasLogin', 'linker');
            _.isEmpty(m) || message.push(m);
            chat.message = message;
            if(data.linker){
                let id = data.linker.id;
                chat.linker || (chat.linker = {});
                chat.linker['_l' + id] = data.linker.name;
            }

            dispatch(setMessage(_.extend({}, chat, _.pick(data, 'hasLogin'))));
        });

        socket.on('broadcasted', (data)=> {
            console.info(data.message);
        });
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