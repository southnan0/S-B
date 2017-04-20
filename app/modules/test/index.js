import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {immutableRenderDecorator} from 'react-immutable-render-mixin';
import {Link} from 'react-router';

@immutableRenderDecorator

class Home extends React.Component {

    render() {
        return (
            <div>
                <h1>TEST</h1>
            </div>
        )
    }
}

export default Home