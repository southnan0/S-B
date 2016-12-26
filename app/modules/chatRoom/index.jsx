import React from 'react';
import Component from '../../containers/component.jsx';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as SseActions from './actions';
import {immutableRenderDecorator} from 'react-immutable-render-mixin';
import {Button, FormGroup, ControlLabel, FormControl, ButtonGroup} from 'react-bootstrap';
import {removeReducerPrefixer} from '../../appCommon/prefix';
import Im from 'immutable';
const TITLE = 'S&B聊天室';
import {Editor} from '../../components/Editor';

@immutableRenderDecorator

class Chat extends Component {
    state = {
        userName: "",
        namespace: "",
        lastMessageLength: 0
    };

    componentWillMount() {
        let _self = this;
        document.addEventListener('visibilitychange', function () {
            if (document.hidden) {

            } else {
                document.title = TITLE;
                _self.setState({lastMessageLength: 0});
            }
        }, false);
        if (__DEV__) return;
        if (io) {
            this.props.actions.initChat();
        } else {
            this.props.history.pushState(null, '/');
        }
    }

    componentDidMount() {
        let chat = this.props.chat.toJS ? this.props.chat.toJS() : {};
        if (chat.hasLogin) {
            this.scrollToEnd.call(this, 'chatCnt');
            this.scrollToEnd.call(this, 'linkerCnt')
        }
    }

    componentDidUpdate(prevProps) {
        let chat = this.props.chat.toJS ? this.props.chat.toJS() : {message: []};
        let prevChat = prevProps.chat.toJS ? prevProps.chat.toJS() : {message: []};
        let count = 0;
        let chatMessage = chat.message || [];
        let prevChatMessage = prevChat.message || [];
        let lastMessageLength = 0;
        if (chatMessage.length !== prevChatMessage.length) {
            lastMessageLength = this.state.lastMessageLength + 1;
        }

        if (chat.hasLogin && (count = lastMessageLength) && count > 0) {
            if (document.hidden) {
                document.title = `您有${count}条消息未读……`;
                this.setState({lastMessageLength})
            } else {
                document.title = TITLE;
                this.setState({lastMessageLength: 0});
            }
            let el = ReactDOM.findDOMNode(this.refs.message_video);
            if (chatMessage[chatMessage.length - 1].sender !== chat.userName) {
                el.play();
            }

            this.scrollToEnd.call(this, 'chatCnt');
            this.scrollToEnd.call(this, 'linkerCnt');
        }
    }

    operate(message) {
        this.props.actions.sendMessage({
            writeMessage: message
        });
        return true;
    }

    handleLogin(type, refs, e) {
        e && e.preventDefault();
        let obj = {}, newObj = {};
        if (refs.shift) {
            for (var i = 0; i < refs.length; i++) {
                let key = refs[i];
                obj[key] = this.state[key];
                newObj[key] = '';
            }
        } else {
            obj[refs] = this.state[refs];
            newObj[refs] = '';
        }
        this.props.actions[type](obj);
        this.setState(newObj);
    }

    handleChange(attr, e) {
        this.setState({
            [attr]: e.currentTarget.value
        });
    }

    scrollToEnd(ref) {
        let el = ReactDOM.findDOMNode(this.refs[ref]);
        el.scrollTop = el.scrollHeight || 0;
    }

    render() {
        let chat = this.props.chat.toJS ? this.props.chat.toJS() : {};
        let {message = {}, linker} = chat;
        if (__DEV__ ? false : !chat.hasLogin) {
            return (
                <form className="page" onSubmit={this.handleLogin.bind(this, 'login', ['userName', 'namespace'])}>
                    <FormGroup controlId="userName">
                        <ControlLabel>用户名</ControlLabel>
                        <FormControl type="text" value={this.state.userName}
                                     onChange={this.handleChange.bind(this, 'userName')}
                                     placeholder="请输入用户名"/>
                    </FormGroup>
                    <FormGroup controlId="namespace">
                        <ControlLabel>暗号</ControlLabel>
                        <FormControl type="text" value={this.state.namespace}
                                     onChange={this.handleChange.bind(this, 'namespace')}
                                     placeholder="请输入暗号"/>
                    </FormGroup>
                    <Button type="submit"> 登录 </Button>
                </form>

            )
        }
        let {writeMessage} = this.state;
        return (
            <div className="cnt">
                <p>聊天室</p>
                <div ref="linkerCnt" className="linker-cnt">
                    <ButtonGroup vertical block>
                        {
                            linker && Object.keys(linker).length > 0 && Object.keys(linker).map((key, index) => {
                                let item = linker[key];
                                return <p className="link-name" key={index}>{item}</p>
                            })
                        }

                    </ButtonGroup>
                </div>

                <div ref="chatCnt" className="chat-cnt">
                    {
                        message && message.map && message.map((item, index) => {
                            return <div key={index}
                                        className={item.sender === chat.userName ? 'right col-green' : ''}>{item.sender} {item.sendTime}说：
                                <div dangerouslySetInnerHTML={{__html: item.cnt}}/>
                            </div>
                        })
                    }
                </div>

                <form className="input-cnt">
                    <FormGroup className="send-cnt" controlId="formControlsTextarea">
                        <ControlLabel className="send-label">请输入信息</ControlLabel>
                        <Editor content=""
                                handleSend={this.operate.bind(this)}
                        />
                    </FormGroup>
                </form>
                <audio ref="message_video" width="0">
                    <source src="../../../../voice/message.mp3" type="audio/mpeg"/>
                </audio>
            </div>
        );
    }
}

export default connect(
    state => {
        return removeReducerPrefixer(state, 'CHAT_ROOM')
    },
    dispatch => ({
        actions: bindActionCreators(SseActions, dispatch)
    })
)(Chat);