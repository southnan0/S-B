import React from 'react';
import ReactDOM from 'react-dom';
import Component from '../../containers/component.jsx';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as SseActions from './actions';
import {immutableRenderDecorator} from 'react-immutable-render-mixin';
import {removeReducerPrefixer} from '../../appCommon/prefix';
import Im from 'immutable';
const TITLE = 'S&B聊天室';
import {Editor} from '../../components/Editor';
import { Form, Input, Select, Button,Layout, Menu  } from 'antd';
const { Header, Content, Footer,Sider } = Layout;
const FormItem = Form.Item;
const Option = Select.Option;

const formItemLayout = {
      labelCol: {
        xs: { span: 24 },
        sm: { span: 6 },
      },
      wrapperCol: {
        xs: { span: 24 },
        sm: { span: 14 },
      },
    };
    const tailFormItemLayout = {
      wrapperCol: {
        xs: {
          span: 24,
          offset: 0,
        },
        sm: {
          span: 14,
          offset: 6,
        },
      },
    };

@immutableRenderDecorator
class Chat extends Component {
    state = {
        userName: "",
        password: "",
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
        this.props.actions.initChat();
    }

    componentDidMount() {
        let chat = this.props.chat.toJS ? this.props.chat.toJS() : {};
        if (chat.hasLogin) {
            this.scrollToEnd.call(this, 'chatCnt');
            this.scrollToEnd.call(this, 'linkerCnt')
        }
    }

    componentWillReceiveProps(nextProps){
        if(nextProps.hasLogin === false && nextProps.errorMessage){
            console.info(nextProps.errorMessage);
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
                <Form className="page" onSubmit={this.handleLogin.bind(this, 'login', ['userName', 'password'])}>
                    <FormItem {...formItemLayout}
                        label="用户名"
                        hasFeedback
                        >
                        <Input type="text" 
                            value={this.state.userName}
                            onChange={this.handleChange.bind(this, 'userName')}
                            placeholder="请输入用户名"/>
                    </FormItem>
                    <FormItem {...formItemLayout}
                        label="密碼"
                        hasFeedback
                        >
                        <Input  type="password" 
                            value={this.state.password}
                            onChange={this.handleChange.bind(this, 'password')}
                            placeholder="请输入密碼"/>
                    </FormItem>
                    <FormItem>
                        <Button  type="primary" htmlType="submit"> 登录 </Button>
                    </FormItem>
                </Form>

            )
        }
        let {writeMessage} = this.state;
        return (
            <div className="cnt">
                <Header style={{backgroundColor:'#fff',fontSize:24}}>聊天室 <Button onClick={this.props.actions.exit}>退出</Button></Header>
                <Content ref="linkerCnt">
                    <Layout style={{ padding: '0 16px 16px', background: '#fff' }}>
                        <Sider width={200} style={{ background: '#fff' }}>
                        <Menu
                            mode="inline"
                            defaultSelectedKeys={['1']}
                            defaultOpenKeys={['sub1']}
                            style={{ height: '100%',border:'1px solid #ccc' }}
                        >
                        {
                            linker && Object.keys(linker).length > 0 && Object.keys(linker).map((key, index) => {
                                let item = linker[key];
                                return <Menu.Item className="link-name" key={index}>{item}</Menu.Item>
                            })
                        }
                        </Menu>
                        </Sider>
                        <Content style={{ padding: '0 0 0 24px', minHeight: 280 }}>
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
                        </Content>
                    </Layout>
                
                </Content>

                <Footer className="input-cnt" style={{padding:0,marginTop:10}}>
                        <p>请输入信息：</p>
                        <Editor content=""
                                handleSend={this.operate.bind(this)}
                        />
                </Footer>
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