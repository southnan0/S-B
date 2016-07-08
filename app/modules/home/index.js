import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {immutableRenderDecorator} from 'react-immutable-render-mixin';
import * as ItemActions from './actions';
import {Button} from 'react-bootstrap';

@immutableRenderDecorator

class Home extends React.Component {

    static propTypes = {};

    goToStart() {
        this.props.history.pushState(null, '/chatRoom');
    }

    goToTEST() {
        this.props.history.pushState(null, '/test');
    }

    render() {
        const actions = this.props.actions;

        return (
            <div className="cnt">
                <div className="menu-btn">
                    <Button bsStyle="link">logo</Button>
                        <span className="link-cnt">
                        <Button bsStyle="link" onClick={this.goToTEST.bind(this)}>TEST</Button>
                        <Button bsStyle="link" onClick={this.goToStart.bind(this)}>chatroom</Button>
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