import React from 'react';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import {immutableRenderDecorator} from 'react-immutable-render-mixin';
import {Link} from 'react-router';
import {Jumbotron, Button} from 'react-bootstrap';

@immutableRenderDecorator

class Home extends React.Component {

    render() {
        return (
            <Jumbotron>
                <h1>TEST</h1>
            </Jumbotron>
        )
    }
}

export default Home