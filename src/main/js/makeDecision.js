const React = require('react');
const ReactDOM = require('react-dom');

class MakeDecision extends React.Component {

    constructor(props){
        super(props);
    }

    render() {
        return (
            <div>
                <p>test</p>
            </div>
        );
    }
}

ReactDOM.render(
    <MakeDecision />,
    document.getElementById('makeDecision')
)