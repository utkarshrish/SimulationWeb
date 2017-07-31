const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');

class Reports extends React.Component {

    constructor(props){
        super(props);
        this.state = {costs: []};
    }

    componentDidMount() {
        client({method: 'GET', path: '/api/costs'}).done(response => {
            this.setState({costs: response.entity._embedded.costs});
        });
    }

    render() {
        return (
            <p>{this.state.costs.toString()}</p>
        );
    }
}

ReactDOM.render(
    <Reports />,
    document.getElementById('reports')
)