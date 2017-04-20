import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {immutableRenderDecorator} from 'react-immutable-render-mixin';
import * as ItemActions from './actions';

@immutableRenderDecorator
class Home extends React.Component {

    static propTypes = {};

    render() {
        const actions = this.props.actions;

        return (
            <div className="cnt">
                <div className="menu-btn">
                    <a>logo</a>
                        <span className="link-cnt">
                            <a className="menu-link" href="#/test">TEST</a>
                            <a className="menu-link" href="#/chatRoom">chatroom</a>
                        </span>
                </div>
                <div className="main-cnt">
                    <h1>Hello!</h1>
                    <p>Welcome to S&B chat room,have a fun day!</p>
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({}),
    dispatch => ({
        actions: bindActionCreators(ItemActions, dispatch)
    })
)(Home)