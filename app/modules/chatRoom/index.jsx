import React from 'react';
import Component from '../../containers/component.jsx';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as SseActions from './actions';
import {Button, FormGroup, ControlLabel, FormControl, ButtonGroup} from 'react-bootstrap';
import {removeReducerPrefixer} from '../../appCommon/prefix';

/*import '../style/chatRoom.less';*/

class Chat extends Component {
    state = {
        userName: "",
        namespace: ""
    };

    componentWillMount() {
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

    componentDidUpdate() {
        let chat = this.props.chat.toJS ? this.props.chat.toJS() : {};
        if (chat.hasLogin) {
            this.scrollToEnd.call(this, 'chatCnt')
            this.scrollToEnd.call(this, 'linkerCnt')
        }
    }

    operate(type, refs,e) {
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

    handleKeyDown(type, refs,e){
        if (e.keyCode === 13 && e.ctrlKey) {
            e.preventDefault(); //阻止默认回车换行
            this.operate.call(this,type, refs)
        }
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
        let {message={}, linker} = chat;
        /*if (__DEV__) {
         message = [{
         cnt: "dfaf3424",
         sendTime: new Date().toDateString(),
         sender: "小刘"
         }, {
         cnt: "dfaf3424",
         sendTime: new Date().toDateString(),
         sender: "小刘1"
         }, {
         cnt: "dfaf3424",
         sendTime: new Date().toDateString(),
         sender: "小刘1"
         }, {
         cnt: "dfaf3424",
         sendTime: new Date().toDateString(),
         sender: "小刘1"
         }, {
         cnt: "dfaf3424",
         sendTime: new Date().toDateString(),
         sender: "小刘1"
         }, {
         cnt: "dfaf3424",
         sendTime: new Date().toDateString(),
         sender: "小刘1"
         }, {
         cnt: "dfaf3424",
         sendTime: new Date().toDateString(),
         sender: "小刘1"
         }, {
         cnt: "dfaf3424",
         sendTime: new Date().toDateString(),
         sender: "小刘1"
         }, {
         cnt: "dfaf3424",
         sendTime: new Date().toDateString(),
         sender: "小刘1"
         }, {
         cnt: "dfaf3424",
         sendTime: new Date().toDateString(),
         sender: "小刘最后一个"
         }]
         }*/
        if (!chat.hasLogin) {
            return (
                <form className="page" onSubmit={this.operate.bind(this,'login',['userName','namespace'])}>
                    <FormGroup controlId="userName">
                        <ControlLabel>用户名</ControlLabel>
                        <FormControl type="text" value={this.state.userName}
                                     onChange={this.handleChange.bind(this,'userName')}
                                     placeholder="请输入用户名"/>
                    </FormGroup>
                    <FormGroup controlId="namespace">
                        <ControlLabel>暗号</ControlLabel>
                        <FormControl type="text" value={this.state.namespace}
                                     onChange={this.handleChange.bind(this,'namespace')}
                                     placeholder="请输入暗号"/>
                    </FormGroup>
                    <Button type="submit"> 登录 </Button>
                </form>

            )
        }
        return (
            <div className="cnt" onKeyDown={this.handleKeyDown.bind(this,'sendMessage','writeMessage')}>
                <h2>聊天室</h2>
                <div ref="linkerCnt" className="linker-cnt">
                    <ButtonGroup vertical block>
                        {
                            linker && Object.keys(linker).length > 0 && Object.keys(linker).map((key)=> {
                                let item = linker[key];
                                return <p>{item}</p>
                            })
                        }

                    </ButtonGroup>
                </div>

                <div ref="chatCnt" className="chat-cnt">
                    {
                        message && message.map && message.map((item)=> {
                            return <p>{item.sender} {item.sendTime}说：<br/>{item.cnt}</p>
                        })
                    }
                </div>

                <form>
                    <FormGroup className="send-cnt" controlId="formControlsTextarea">
                        <ControlLabel className="send-label">请输入信息</ControlLabel>
                        <FormControl value={this.state.writeMessage} componentClass="textarea" placeholder="textarea"
                                     onChange={this.handleChange.bind(this,'writeMessage')}/>
                        <Button className="send-btn" type="button" onClick={this.operate.bind(this,'sendMessage','writeMessage')}> （ctrl+enter）发 送 </Button>
                    </FormGroup>
                </form>
            </div>
        );
    }
}

export default connect(
    state=> {
        return removeReducerPrefixer(state, 'CHAT_ROOM')
    },
    dispatch=>({
        actions: bindActionCreators(SseActions, dispatch)
    })
)(Chat);