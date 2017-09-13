const Nav = require('react-bootstrap/lib/Nav');
const NavItem = require('react-bootstrap/lib/NavItem');
const React = require('react');

class GraphNavigation extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        if(this.props.year >= this.props.capYear){
            return(
                <div className="header clearfix">
                    <Nav bsStyle="pills" pullRight="true">
                        <NavItem eventKey={1} href="/logout">Logout</NavItem>
                    </Nav>
                    <h3 className="text-muted">Analytics Simulation</h3>
                    <Nav bsStyle="tabs" justified activeKey={this.props.activeKey}>
                        <NavItem eventKey={1} href="/dashboard">Dashboard</NavItem>
                        <NavItem eventKey={2} href="/reports">Reports</NavItem>
                        <NavItem eventKey={3} href="/explorer">Data Explorer</NavItem>
                        <NavItem eventKey={4} disabled href="/makeDecision"> | Make Decision</NavItem>
                    </Nav>
                    <Button bsStyle="danger">Game Over</Button>
                    <Button bsStyle="danger">Start Over</Button>
                </div>
            );
        } else{
            return(
                <div className="header clearfix">
                    <Nav bsStyle="pills" pullRight="true">
                        <NavItem eventKey={1} href="/logout">Logout</NavItem>
                    </Nav>
                    <h3 className="text-muted">Analytics Simulation</h3>
                    <Nav bsStyle="tabs" justified activeKey={this.props.activeKey}>
                        <NavItem eventKey={1} href="/dashboard">Dashboard</NavItem>
                        <NavItem eventKey={2} href="/reports">Reports</NavItem>
                        <NavItem eventKey={3} href="/explorer">Data Explorer</NavItem>
                        <NavItem eventKey={4} href="/makeDecision"> | Make Decision</NavItem>
                    </Nav>
                </div>
            );
        }
    }
}

module.exports = GraphNavigation;