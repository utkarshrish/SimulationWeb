const React = require('react');
const ReactDOM = require('react-dom');
const Table = require('react-bootstrap/lib/Table');
const client = require('./client');
const SimulationGraph = require('./modules/simulationGraph');
const GraphNavigation = require('./modules/graphNavigation');

class Reports extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            year: document.getElementById('user').innerText.trim().split("_")[1],
            user: document.getElementById('user').innerText.trim().split("_")[0],
            reports: [],
            graphOption : "incomeStatement",
            graphTypes : {
                incomeStatement: "Income Statement",
                production : "Production v. Demand",
                unitPrice: "Pricing"
            },
            years:["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022"],
            marketData: [],
            blueAverage: {}
        };

        this.updateGraphFilter = this.updateGraphFilter.bind(this);
    }

    componentDidMount() {
        client({method: 'GET', path: '/api/graphs/'+ this.state.user + '_' +'reportsGraph'}).done(response => {
            this.setState({reports: response.entity});
        });
        client({method: 'GET', path: '/api/graphs/'+ this.state.user + '_' +'marketShare'}).done(response => {
            this.setState({marketData: JSON.parse(response.entity.model)});
        });
        client({method: 'GET', path: '/api/graphs/blueAverage'}).done(response => {
            this.setState({blueAverage: JSON.parse(response.entity.model)});
        });
    }

    updateGraphFilter(changeEvent) {
        this.setState({
            graphOption: changeEvent.target.value
        });
    }

    render() {
        let costs = this.state.reports.model;
        if(costs !==undefined){
            let graphTypes = this.state.graphTypes;
            if(this.state.year>=2019){
                graphTypes["trend"] = "Market Share Trend";
            }
            let costModel = JSON.parse(costs);
            return (
                <div className="container">
                    <GraphNavigation title="Analytics Simulation| Reports" year={this.state.year} capYear={2022}
                                     activeKey={2} showPrepare={false}/>
                    <div className="row">
                        <div className="col-xs-3">
                            <ul>
                                {Object.keys(graphTypes).map((graphType) =>
                                    <li>
                                        <label>
                                            <input type="radio" name="variable" value={graphType}
                                                   checked={graphType === this.state.graphOption}
                                                   onChange={this.updateGraphFilter}/>
                                            {graphTypes[graphType]}
                                        </label>
                                    </li>
                                )}
                            </ul>
                        </div>
                        <div className="col-xs-9">
                            <div className="Reports">
                                <ReportsTable costs={costModel} graphOption={this.state.graphOption}
                                              year={this.state.year} marketData={this.state.marketData} blueAverage={this.state.blueAverage}/>
                            </div>
                        </div>
                    </div>
                    <footer class="footer">
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

class ReportsTable extends React.Component{

    constructor(props){
        super(props);
        this.state = {
            incomeStatement:{
                "units" : "(in $US)",
                "label": "Income Statement"
            },
            production : {
                "units" : "(in units)",
                "label": "Production v. Inventory v. Demand",
                "legends": ["Production", "Demand", "Inventory"],
                "legendsType": "secondary"
            },
            unitPrice: {
                "units" : "(in $US)",
                "label": "Pricing",
                "legends": ["Blue", "Turbo", "Fresh", "Store"],
                "legendsType": "s"
            },
            blueAverage: {
                2019: 16.87,
                2020: 19.38,
                2021: 21.43,
                2022: 27.00
            },
            years:["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022"]
        };
    }

    render(){
        if(this.props.graphOption == "incomeStatement") {
            let years = new Set();
            {
                Object.keys(this.props.costs[this.props.graphOption]).map((year) =>
                    years.add(year)
                )
            }
            let costs = this.props.costs[this.props.graphOption];
            return (
                <div className="col-xs-12">
                    <h4>
                        <span>Income Statement     </span>
                        <small>(in $US)</small>
                    </h4>
                    <Table>
                        <thead>
                        <tr className="l1 number">
                            <td></td>
                            {this.state.years.map((year) =>
                                <td>{year}</td>
                            )}
                        </tr>
                        </thead>
                        <tbody>
                        <CostRow rowCss="l2 number" costs={costs} years={years} costProperty="revenue"
                                 costPropertyName="Revenue"/>
                        <tr className="l2 number">
                            <td>Costs</td>
                            {this.state.years.map((year) =>
                                <td></td>
                            )}
                        </tr>
                        <CostRow rowCss="l3 number" costs={costs} years={years}
                                 costProperty="variableCost" costPropertyName="Variable Costs"/>
                        <CostRow rowCss="l3 number" costs={costs} years={years}
                                 costProperty="fixedCost" costPropertyName="Fixed Costs"/>
                        <CostRow rowCss="l3 number" costs={costs} years={years}
                                 costProperty="otherCost" costPropertyName="Other Costs"/>
                        <CostRow rowCss="l2 number" costs={costs} years={years}
                                 costProperty="totalCost" costPropertyName="Total Costs"/>
                        <CostRow rowCss="l2 number" costs={costs} years={years}
                                 costProperty="operatingProfit" costPropertyName="Operating Profit"/>
                        </tbody>
                        <tfoot>
                        <CostRow rowCss="l2 number" costs={costs} years={years}
                                 costProperty="cumulativeOperatingProfit" costPropertyName="Cumulative Operating Profit"/>
                        </tfoot>
                    </Table>
                </div>
            )
        } else if(this.props.graphOption == "trend"){
            let playedYears = [];
            for (let year = 2019; year <= this.props.year; year++){
                playedYears.push(year);
            }
            if(this.props.marketData && this.state.blueAverage) {
                return (
                    <div className="col-xs-12">
                        <h4>
                            <span>Market Share Trend     </span>
                            <small>(in %)</small>
                        </h4>
                        <Table>
                            <thead>
                            <tr className="l1 number">
                                <td></td>
                                <td>2019</td>
                                <td>2020</td>
                                <td>2021</td>
                                <td>2022</td>
                            </tr>
                            </thead>
                            <tbody>
                            <tr className="l2 number">
                                <td>Blue's Market Share</td>
                                {playedYears.map((playedYear)=>
                                    <td>
                                        {this.props.marketData[playedYear]["blue"].toFixed(2)}
                                    </td>
                                )}
                            </tr>
                            <tr className="l2 number">
                                <td>Global Blue's Average Market Share</td>
                                {playedYears.map((playedYear)=>
                                    <td>
                                        {this.state.blueAverage[playedYear]}
                                    </td>
                                )}
                            </tr>
                            </tbody>
                        </Table>
                    </div>
                )
            } else {
                return (
                    <p>A</p>
                )
            }
        } else {
            return (
                <SimulationGraph graph={this.props.costs}
                                 label={this.state[this.props.graphOption]["label"]}
                                 units={this.state[this.props.graphOption]["units"]}
                                 graphOption={this.props.graphOption}
                                 graphLegends={this.state[this.props.graphOption]["legends"]}
                                 graphLegendsType={this.state[this.props.graphOption]["legendsType"]}
                                 factor={1}
                                 year={this.props.year}
                />
            )
        }
    }
}

class CostRow extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            years:["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022"]
        };
    }


    render(){
        if(this.props.costPropertyName!= undefined && this.props.costs != undefined && this.props.costProperty != undefined) {
            let yearsLeft = new Set(this.state.years.filter(x => !this.props.years.has(x)));
            return(
                <tr className={this.props.rowCss}>
                    <td>{this.props.costPropertyName.toString()}</td>

                    {[...this.props.years].map((year)=>
                        <td>{this.props.costs[year][this.props.costProperty]}</td>
                    )}

                    {[...yearsLeft].map((year)=>
                        <td></td>
                    )}

                </tr>
            )
        }
        return(
            <tr></tr>
        )
    }
}

ReactDOM.render(
    <Reports />,
    document.getElementById('reports')
)