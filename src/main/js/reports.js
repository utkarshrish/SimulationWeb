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
            years:["2015", "2016", "2017", "2018", "2019", "2020", "2021", "2022"]
        };

        this.updateGraphFilter = this.updateGraphFilter.bind(this);
    }

    componentDidMount() {
        client({method: 'GET', path: '/api/graphs/'+ this.state.user + '_' +'reportsGraph'}).done(response => {
            this.setState({reports: response.entity});
        });
    }

    updateGraphFilter(changeEvent) {
        event.preventDefault();
        this.setState({
            graphOption: changeEvent.target.value
        });
    }

    render() {
        let costs = this.state.reports.model;
        if(costs !==undefined){
            let costModel = JSON.parse(costs);
            return (
                <div className="container">
                    <GraphNavigation year={this.props.year} capYear={2022} activeKey={2}/>
                    <div className="row">
                        <div className="cols-xs-3">
                            <ul>
                                {Object.keys(this.state.graphTypes).map((graphType) =>
                                    <li>
                                        <label>
                                            <input type="radio" name="variable" value={graphType}
                                                   checked={graphType === this.state.graphOption}
                                                   onChange={this.updateGraphFilter}/>
                                            {this.state.graphTypes[graphType]}
                                        </label>
                                    </li>
                                )}
                            </ul>
                        </div>
                        <div className="cols-xs-9">
                            <div className="Reports">
                                <ReportsTable costs={costModel} graphOption={this.state.graphOption} year={this.state.year}/>
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
                <div className="cols-xs-8">
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