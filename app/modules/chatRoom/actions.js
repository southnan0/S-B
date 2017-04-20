import {isEmpty,pick} from 'lodash';
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
        __DEV__ || (socket = new io());
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
            console.info(data)
            isEmpty(data.message) || (message = message.concat(data.message));
            chat.message = message;
            console.info(chat)
            if(data.linker && data.linker.length>0){
                data.linker.map((l)=>{
                    let id = l.id;
                    chat.linker || (chat.linker = {});
                    chat.linker['_l' + id] = l.name;
                })
            }

            dispatch(setMessage(Object.assign({}, chat, pick(data, 'hasLogin','userName'))));
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