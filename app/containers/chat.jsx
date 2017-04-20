import React from 'react';
import ReactDOM from 'react-dom';
import Component from './component.jsx';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as SseActions from '../actions/sseActions';
import {Button} from 'antd';

class Chat extends Component {
    componentWillMount() {
        this.props.actions.initChat();
    }

    operate(type, refs) {
        let obj = {};
        if (refs.shift) {
            for (var i = 0; i < refs.length; i++) {
                let key = refs[i];
                let el = ReactDOM.findDOMNode(this.refs[key]);
                obj[key] = el.value;
                el.value = '';
            }
        } else {
            let el = ReactDOM.findDOMNode(this.refs[refs]);
            obj[refs] = el.value;
            el.value = '';
        }

        this.props.actions[type](obj);
    }

    render() {
        let {chat={}} = this.props;
        let {message} = chat;
        if (!chat.hasLogin) {
            return (
                <div>
                    用户名：<input ref="userName" placeholder="请输入用户名"/>
                    暗号：<input ref="namespace" placeholder="你们约定好的哦~"/>
                    <Button onClick={this.operate.bind(this,'login',['userName','namespace'])}> 登录 </Button>
                </div>
            )
        }

        return (
            <div>
                <p>聊天室</p>
                <div style={{border:'1px solid',height:'300px',overflow:'auto'}}>
                    {
                        message.map && message.map((item)=> {
                            return <p>{item.sender} {item.sendTime}说：{item.cnt}</p>
                        })
                    }
                </div>
                <textarea ref="writeMessage" cols="30" rows="10"/>
                <Button onClick={this.operate.bind(this,'sendMessage','writeMessage')}> 发 送 </Button>
            </div>
        );
    }
}

export default connect(
    state=>({
        chat: state.chat.toJS()
    }),
    dispatch=>({
        actions: bindActionCreators(SseActions, dispatch)
    })
)(Chat);