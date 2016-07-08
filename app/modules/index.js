import React from 'react';
import {Jumbotron} from 'react-bootstrap';

const App = (props) => {

    return (
        <div className="main-body">
            <Jumbotron className="whole-cnt">
                {props.children}
            </Jumbotron>
        </div>
    )
}

export default App