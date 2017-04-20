import React from 'react';

const App = React.createClass({

    render() {
        let {props} = this;
        return (
            <div className="main-body">
                <div className="whole-cnt">
                    {props.children}
                </div>
            </div>
        )
    }
})

export default App