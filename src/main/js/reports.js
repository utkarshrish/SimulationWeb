const React = require('react');
const ReactDOM = require('react-dom');
const Nav = require('react-bootstrap/lib/Nav');
const Table = require('react-bootstrap/lib/Table');
const NavItem = require('react-bootstrap/lib/NavItem');
const client = require('./client');

class Reports extends React.Component {

    constructor(props){
        super(props);
        this.state = {costs: [], filterFactor : []};
    }

    componentDidMount() {
        client({method: 'GET', path: '/api/costs'}).done(response => {
            this.setState({costs: response.entity._embedded.costs});
        });
    }

    render() {
        let incomeFilters = {"All Incomes":"All Incomes", "No Income Focus":"No Income Focus", "$20,000 - $39,999":"$20,000 - $39,999", "$40,000 - $59,999":"$40,000 - $59,999", "$60,000 and Over":"$60,000 and Over"};
        return (
            <div className="container">
                <Nav bsStyle="pills" activeKey={1}>
                    <NavItem eventKey={1} href="/reports">Reports</NavItem>
                    <NavItem eventKey={2} href="/explorer">Data Explorer</NavItem>
                    <NavItem eventKey={3} href="/makeDecision"> | Make Decision</NavItem>
                </Nav>
            <div className="Reports">
                <Table condensed hover>
                    <thead>
                        <tr className="l1 number">
                            <td></td>
                            <td>2015</td>
                            <td>2016</td>
                            <td>2017</td>
                            <td>2018</td>
                            <td>2019</td>
                            <td>2020</td>
                            <td>2021</td>
                            <td>2022</td>
                        </tr>
                    </thead>
                    <tbody>
                        <CostRow rowCss="l2 number" costs={this.state.costs} costProperty="revenue" costPropertyName="Revenue"/>
                        <tr className="l2 number">
                            <td>Costs</td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                            <td></td>
                        </tr>
                        <CostRow rowCss="l2 number" costs={this.state.costs} costProperty="variableCost" costPropertyName="Variable Costs"/>
                        <CostRow rowCss="l2 number" costs={this.state.costs} costProperty="fixedCost" costPropertyName="Fixed Costs"/>
                        <CostRow rowCss="l2 number" costs={this.state.costs} costProperty="otherCost" costPropertyName="Other Costs"/>
                        <CostRow rowCss="l2 number" costs={this.state.costs} costProperty="totalCost" costPropertyName="Total Costs"/>
                        <CostRow rowCss="l2 number" costs={this.state.costs} costProperty="operatingProfit" costPropertyName="Operating Profit"/>
                    </tbody>
                    <tfoot>
                        <CostRow rowCss="l2 number" costs={this.state.costs} costProperty="cumulativeOperatingProfit" costPropertyName="Cumulative Operating Profit"/>
                    </tfoot>
                </Table>
            </div>
            </div>
        );
    }
}

class CostRow extends React.Component{
    render(){
        if(this.props.costPropertyName!= undefined && this.props.costs != undefined && this.props.costProperty != undefined) {
            return(
                <tr className={this.props.rowCss}>
                    <td>{this.props.costPropertyName.toString()}</td>

                    {this.props.costs.map((cost) =>
                        <CostItem cost={cost} costProperty={this.props.costProperty}/>
                    )}
                </tr>
            )
        }
        return(
            <tr></tr>
        )
    }
}

class CostItem extends React.Component{
    render(){
        if(this.props.cost != undefined && this.props.costProperty!= undefined ) {
            let cost = this.props.cost;
            const costMap = new Map();
            Object.keys(cost).forEach(key => {
                costMap.set(key, cost[key]);
            });
            return (
                <td>{costMap.get(this.props.costProperty)}</td>
            )
        }
        return(
            <td></td>
        )
    }
}

ReactDOM.render(
    <Reports />,
    document.getElementById('reports')
)