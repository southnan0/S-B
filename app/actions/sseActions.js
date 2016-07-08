export const setData = (data)=> {
    return {
        type: 'SET_DATA',
        payload: data
    }
};

export const setMessage = (data)=> {
    return {
        type: 'SET_MESSAGE',
        payload: data
    }
};

export const getTime = ()=> {
    return (dispatch)=> {
        const es = new EventSource('time_sse.php');
        es.addEventListener('message', (e)=> {
            console.info(e.data);
        });
        es.onmessage = (e)=> {
            console.info(e.data);
            dispatch(setData({time: e.data}));
        };

        es.onerror = (e)=> {
            console.info(e)
        }
    }
};
let socket;
export const initChat = ()=> {
    return (dispatch, getState)=> {
        socket = new io();
        socket.on('login', (obj)=> {
            let {chat} = getState();
            chat = chat.toJS();
            let {message=[]} = chat;
            
            dispatch(setMessage(_.extend({}, chat, obj)));
        });

        socket.on('message', (data)=> {
            let {chat} = getState();
            chat = chat.toJS();
            let {message=[]} = chat;

            let m = _.omit(data, 'hasLogin')
            _.isEmpty(m) || message.push(m);
            chat.message = message;

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

