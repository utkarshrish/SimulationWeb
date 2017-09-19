const Nav = require('react-bootstrap/lib/Nav');
const NavItem = require('react-bootstrap/lib/NavItem');
const Button = require('react-bootstrap/lib/Button');
const React = require('react');
const Modal = require('react-bootstrap/lib/Modal');

class GraphNavigation extends React.Component {
    constructor(props){
        super(props);
        this.state = { showDesc: props.showPrepare };

        this.closeShowPrepare = this.closeShowPrepare.bind(this);
        this.openShowPrepare = this.openShowPrepare.bind(this);
    }

    openShowPrepare() {
        this.setState({ showDesc: true })
    }

    closeShowPrepare() {
        this.setState({ showDesc: false })
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
                <Nav id="logout" bsStyle="tabs" pullRight="true">
                    <NavItem eventKey={1} onClick={this.openShowPrepare}>Show Description</NavItem>
                    <NavItem eventKey={2} href="/logout">Logout</NavItem>
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
                <Modal
                    show={this.state.showDesc}
                    onHide={this.closeShowPrepare}
                    container={this}
                    aria-labelledby="contained-modal-title"
                >
                    <Modal.Header closeButton>
                        <Modal.Title id="contained-modal-title">Background</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>
                            You have just been hired as a brand manager at Blue, a multinational consumer goods company. Recently the firm invested in the development of a series of systems and processes that allow the use of up-to-date data and advanced analytics to drive informed decision making about Blue. It is 2018. The system is populated with 4 years of historical data.
                        </p>
                        <p>
                            As brand manager for K-W’s Blue laundry detergent, you are tasked to lead the brand's turnaround. Use the Vision platform to to develop your strategy and grow Blue’s market share over the next 4 years.
                        </p>
                        <p>
                            Your objectives:
                        </p>
                        <p>
                            Use the Blue dashboard, reports and data explorer screens to identify issues and opportunities for Blue in the market.
                        </p>
                        <p>
                            Make decisions that support the Blue brand:
                        </p>
                        <p>
                            ◦ Predict market demand and set production
                        </p>
                        <p>
                            ◦ Set channel price
                        </p>
                        <p>
                            ◦ Make formulation decisions
                        </p>
                        <p>
                            ◦ Determine promotional spending decisions
                        </p>
                        <p>
                            ◦ Communicate your strategy to your managers
                        </p>
                        <p>
                            The simulation begins in 2019. Make decisions for 4 years, ending in 2022.
                        </p>
                    </Modal.Body>
                    <Modal.Footer>
                        <Button id="prepare" onClick={this.closeShowPrepare}>OK</Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

module.exports = GraphNavigation;