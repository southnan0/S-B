import React from 'react';
import Header from '../components/Header.jsx';

const App = (props) => {

    return (
        <div>
            <div className="main">
                {props.children}
            </div>
        </div>
    )
}

export default App