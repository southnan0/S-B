import React from 'react';
import {Jumbotron} from 'react-bootstrap';

const App = React.createClass({

    render() {
        let {props} = this;
        return (
            <div className="main-body">
                <Jumbotron className="whole-cnt">
                    {props.children}
                </Jumbotron>
            </div>
        )
    }
})

export default App