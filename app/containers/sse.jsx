import React from 'react';
import Component from './component.jsx';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import * as SseActions from '../actions/sseActions';
import {Button} from 'antd';

class Sse extends Component {

    render() {
        let {time} = this.props;
        console.info(time);
        return (
            <div>
                <p>当前时间是{}</p>
                <Button onClick={this.props.actions.getTime}> 开启当前时间 </Button>
            </div>
        );
    }
}

export default connect(
    state=>({
        time: state.data.time || '--'
    }),
    dispatch=>({
        actions: bindActionCreators(SseActions, dispatch)
    })
)(Sse);