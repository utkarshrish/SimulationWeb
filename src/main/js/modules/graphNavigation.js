const Nav = require('react-bootstrap/lib/Nav');
const NavItem = require('react-bootstrap/lib/NavItem');
const Button = require('react-bootstrap/lib/Button');
const React = require('react');

class GraphNavigation extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        let decisionHistoryEnable = <NavItem eventKey={5} href="/decisionHistory">Decision History</NavItem>;
        let decisionHistoryDisable = <NavItem eventKey={5} disabled href="/decisionHistory">Decision History</NavItem>;
        let decisionHistory = decisionHistoryDisable;

        let makeDecisionEnable = <NavItem eventKey={4} href="/makeDecision">Make Decision</NavItem>;
        let makeDecisionDisable = <NavItem eventKey={4} disabled href="/makeDecision">Make Decision</NavItem>;
        let makeDecision = makeDecisionEnable;

        let gameOver = <p></p>;

        if(this.props.year >= this.props.capYear){
            decisionHistory = decisionHistoryEnable;
            makeDecision = makeDecisionDisable;
            gameOver = <Button bsStyle="danger">Game Over</Button>;
        } else{
            if(this.props.year >= 2019){
                if(this.props.activeKey == 4 && this.props.year == 2019){
                    decisionHistory = decisionHistoryDisable;
                } else{
                    decisionHistory = decisionHistoryEnable;
                }
                makeDecision = makeDecisionEnable;
            } else{
                decisionHistory = decisionHistoryDisable;
                makeDecision = makeDecisionEnable;
            }
        }

        return(
            <div className="header clearfix">
                <Nav id="logout" bsStyle="pills" pullRight="true">
                    <NavItem eventKey={1} href="/logout">Logout</NavItem>
                </Nav>
                <Nav bsStyle="tabs" justified activeKey={this.props.activeKey}>
                    <NavItem eventKey={1} href="/dashboard">Dashboard</NavItem>
                    <NavItem eventKey={2} href="/reports">Reports</NavItem>
                    <NavItem eventKey={3} href="/explorer">Data Explorer</NavItem>
                    {makeDecision}
                    {decisionHistory}
                </Nav>
                <h4>{this.props.title}</h4>
                {gameOver}
            </div>
        );
    }
}

module.exports = GraphNavigation;