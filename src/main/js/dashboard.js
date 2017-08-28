const React = require('react');
const ReactDOM = require('react-dom');
const Nav = require('react-bootstrap/lib/Nav');
const NavItem = require('react-bootstrap/lib/NavItem');
const client = require('./client');
const SimulationGraph = require('./modules/simulationGraph');
import PieChart from "react-svg-piechart"

class Dashboard extends React.Component {

    constructor(props){
        super(props);
        const userData = document.getElementById('user').innerText.trim();
        this.state = {
            year: userData.substring("_")[0],
            user: userData.substring("_")[1],
            dashboard: [],
            marketData: [],
            years:["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022"]
        };
    }

    componentDidMount() {
        client({method: 'GET', path: '/api/graphs/'+ this.state.user + '_' +'explorer'}).done(response => {
            this.setState({dashboard: response.entity});
        });
        client({method: 'GET', path: '/api/graphs/'+ this.state.user + '_' +'marketShare'}).done(response => {
            this.setState({marketData: response.entity});
        });
    }

    render() {
        let costs = this.state.dashboard.model;
        let marketShare = this.state.marketData.model;
        if(costs !== undefined && marketShare !== undefined){
            let costModel = JSON.parse(costs);
            let marketShareModel = JSON.parse(marketShare);
            const marketSharePieModel = [
                {label: "Blue", value: marketShareModel[this.state.year]["blue"], color: "#00f"},
                {label: "Turbo", value: marketShareModel[this.state.year]["green"], color: "#009933"},
                {label: "Fresh", value: marketShareModel[this.state.year]["yellow"], color: "#ff0"},
                {label: "Store", value: marketShareModel[this.state.year]["red"], color: "#cb2027"}
            ];

            const {expandedSector} = this.state;

            return (
                <div className="container">
                    <div className="header clearfix">
                        <Nav bsStyle="pills" pullRight="true">
                            <NavItem eventKey={1} href="/logout">Logout</NavItem>
                        </Nav>
                        <h3 className="text-muted">Analytics Simulation</h3>
                    </div>
                    <Nav bsStyle="pills" activeKey={1}>
                        <NavItem eventKey={1} href="/dashboard">Dashboard</NavItem>
                        <NavItem eventKey={2} href="/reports">Reports</NavItem>
                        <NavItem eventKey={3} href="/explorer">Data Explorer</NavItem>
                        <NavItem eventKey={4} href="/makeDecision"> | Make Decision</NavItem>
                    </Nav>
                    <div className="row">
                        <div className="cols-xs-6">
                            <h4>
                                <span>Market Share      </span>
                                <small>(in %)</small>
                            </h4>
                            <div className="cols-xs-4">
                                <PieChart
                                data={ marketSharePieModel }
                                sectorStrokeWidth={0}
                                viewBoxWidth={50}
                            />
                            </div>
                        </div>

                        <SimulationGraph graph={costModel}
                                         label={"Profitability"}
                                         units={"(in $US)"}
                                         graphOption={"operatingProfit"}
                                         graphLegends={["Blue", "Turbo", "Fresh", "Store"]}
                                         graphLegendsType={"s"}
                        />

                        <SimulationGraph graph={costModel}
                                         label={"Revenue"}
                                         units={"(in $US)"}
                                         graphOption={"revenue"}
                                         graphLegends={["Blue", "Turbo", "Fresh", "Store"]}
                                         graphLegendsType={"s"}
                        />

                    </div>
                    <footer className="footer">
                        <p> &copy; 2017 Analytics Simulation</p>
                    </footer>
                </div>
            );
        }else {
            return (
                <p></p>
            )
        }
    }
}

ReactDOM.render(
    <Dashboard />,
    document.getElementById('dashboard')
)