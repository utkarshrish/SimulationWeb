const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');
const SimulationGraph = require('./modules/simulationGraph');
import PieChart from "react-svg-piechart"
const GraphNavigation = require('./modules/graphNavigation');
const Modal = require('react-bootstrap/lib/Modal');
const Button = require('react-bootstrap/lib/Button');

class Dashboard extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            year: document.getElementById('user').innerText.trim().split("_")[1],
            user: document.getElementById('user').innerText.trim().split("_")[0],
            dashboard: [],
            marketData: [],
            years:["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022"],
            expandedSector: null,
            showPrepare: document.getElementById('user').innerText.trim().split("_")[1] === "2018"
        };
        this.handleMouseEnterOnSector = this.handleMouseEnterOnSector.bind(this)
    }

    handleMouseEnterOnSector(sector) {
        this.setState({expandedSector: sector})
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
        let prepare = () => this.setState({ showPrepare: false});

        let costs = this.state.dashboard.model;
        let marketShare = this.state.marketData.model;
        if(costs !== undefined && marketShare !== undefined){
            let costModel = JSON.parse(costs);
            let marketShareModel = JSON.parse(marketShare);
            let redMarketShare = 100 - marketShareModel[this.state.year]["blue"]
                - marketShareModel[this.state.year]["green"] - marketShareModel[this.state.year]["yellow"];
            const marketSharePieModel = [
                {label: "Blue", value: marketShareModel[this.state.year]["blue"], color: "#00bdd4"},
                {label: "Turbo", value: marketShareModel[this.state.year]["green"], color: "#8cc24a"},
                {label: "Fresh", value: marketShareModel[this.state.year]["yellow"], color: "#ffc400"},
                {label: "Store", value: redMarketShare, color: "#f0544f"}
            ];

            return (
                <div className="container">
                    <GraphNavigation title="Analytics Simulation| Dashboard" year={this.state.year} capYear={2022}  activeKey={1}/>
                    <div className="modal-container" style={{height: 200}}>
                        <Modal
                            show={this.state.showPrepare}
                            onHide={prepare}
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
                                <Button id="prepare" onClick={prepare}>Prepare</Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                    <div className="row">
                        <div className="col-xs-12">
                            <div id="upperChart" className="cols-xs-6">
                                <h4>
                                    <span>Market Share      </span>
                                    <small>(in %)</small>
                                </h4>
                                <PieChart
                                    data={ marketSharePieModel }
                                    expandedSector={this.state.expandedSector}
                                    sectorStrokeWidth={0}
                                    viewBoxWidth={40}
                                    onSectorHover={this.handleMouseEnterOnSector}
                                    expandOnHover
                                    shrinkOnTouchEnd
                                    expandPx={2}
                                />
                                <div>
                                    {
                                        marketSharePieModel.map((element, i) => (
                                            <div key={i}>
                                                <span style={{fontWeight: this.state.expandedSector === i ? "bold" : null,
                                                              color: element.color}}>
                                                    {element.label} : {element.value.toFixed(2)}
                                                </span>
                                            </div>
                                        ))
                                    }
                                </div>
                            </div>
                            <SimulationGraph graph={costModel}
                                             label={"Profitability"}
                                             units={"(in $US)"}
                                             graphOption={"operatingProfit"}
                                             graphLegends={["Blue", "Turbo", "Fresh", "Store"]}
                                             graphLegendsType={"s"}
                                             factor={1.0}
                                             year={this.state.year}
                            />
                        </div>

                        <SimulationGraph graph={costModel}
                                         label={"Revenue"}
                                         units={"(in $US)"}
                                         graphOption={"revenue"}
                                         graphLegends={["Blue", "Turbo", "Fresh", "Store"]}
                                         graphLegendsType={"s"}
                                         factor={1.0}
                                         year={this.state.year}
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