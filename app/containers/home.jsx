import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {immutableRenderDecorator} from 'react-immutable-render-mixin';
import SearchBar from '../components/SearchBar';
import Content from '../components/Content';
import Footer from '../components/Footer';
import * as ItemActions from '../actions/itemActions';
import {Link} from 'react-router';
import {Button} from 'antd';

@immutableRenderDecorator

class Home extends React.Component {

    static propTypes = {
        items: React.PropTypes.object,
        filter: React.PropTypes.string
    };

    goToStart() {
        this.props.history.pushState(null, '/chatRoom');
    }

    render() {
        const actions = this.props.actions;

        return (
            <div>
                <div className="main-cnt">
                    <h1>Hello!</h1>
                    <p>Welcome to S&B chat room,have a fun day!</p>
                    <p><Button onClick={this.goToStart.bind(this)} bsStyle="primary">Start</Button></p>
                </div>
            </div>
        )
    }
}

export default connect(
    state => ({
        items: state.items,
        filter: state.filter
    }),
    dispatch => ({
        actions: bindActionCreators(ItemActions, dispatch)
    })
)(Home)