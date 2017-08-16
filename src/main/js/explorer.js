const React = require('react');
const ReactDOM = require('react-dom');
const Accordion = require('react-bootstrap/lib/Accordion');
const Panel = require('react-bootstrap/lib/Panel');
const Nav = require('react-bootstrap/lib/Nav');
const NavItem = require('react-bootstrap/lib/NavItem');
const Checkbox = require('./modules/checkbox');
const client = require('./client');
const SimulationGraph = require('./modules/simulationGraph');

class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {
			graph: [],
			graphTypes:[],
			graphOption: 'operatingProfit',
			filterFactors: [],
			selectedCheckboxes: new Set()
		};

		this.updateGraphFilter = this.updateGraphFilter.bind(this);
		this.toggleCheckboxFilters = this.toggleCheckboxFilters.bind(this);
	}

	componentDidMount() {
		client({method: 'GET', path: '/api/graphs/explorer'}).done(response => {
			this.setState({graph: response.entity});
		});
		client({method: 'GET', path: '/api/graphs/graphTypes'}).done(response => {
			this.setState({graphTypes: response.entity});
		});

		client({method: 'GET', path: '/api/graphs/explorerFilterFactor'}).done(response => {
			this.setState({filterFactors: JSON.parse(response.entity.model)});
		});
	}

	updateGraphFilter(changeEvent) {
		event.preventDefault();
		this.setState({
			graphOption: changeEvent.target.value
		});
	}

	toggleCheckboxFilters(label){
		let selectedCheckboxes = this.state.selectedCheckboxes;
		if (selectedCheckboxes.has(label)) {
			selectedCheckboxes.delete(label);
		} else {
			selectedCheckboxes.add(label);
		}
		this.setState({selectedCheckboxes: selectedCheckboxes});
	}

	render() {
		let graphTypes = this.state.graphTypes.model;
		let graphModel = this.state.graph.model;
		if(graphTypes !== undefined && graphModel !== undefined) {
			let graphTypesModel = JSON.parse(graphTypes);
			let graph = JSON.parse(graphModel);
			let eventKey = 1;
			return (
				<div className="container">
					<Nav bsStyle="pills" activeKey={2}>
						<NavItem eventKey={1} href="/reports">Reports</NavItem>
						<NavItem eventKey={2} href="/explorer">Data Explorer</NavItem>
						<NavItem eventKey={3} href="/makeDecision"> | Make Decision</NavItem>
					</Nav>
					<div className="row">
						<div className="cols-xs-12">
							<div className="GraphTypes cols-xs-3">
								<ul>
									{Object.keys(graphTypesModel.graphTypes).map((graphType) =>
									<li>
										<label>
											<input type="radio" name="variable" value={graphType}
											   checked={graphType === this.state.graphOption}
											   onChange={this.updateGraphFilter}/>
											{graphTypesModel.graphTypes[graphType]["label"]}
										</label>
									</li>
									)}
								</ul>
							</div>
							<SimulationGraph graph={graph}
									label={graphTypesModel.graphTypes[this.state.graphOption]["label"]}
									units={graphTypesModel.graphTypes[this.state.graphOption]["units"]}
									graphOption={this.state.graphOption}
									graphLegends={["Blue", "Turbo", "Fresh", "Store"]}
									graphLegendsType="s"
							/>
							<div className="GraphFilters cols-xs-3">
								<h4>Filters</h4>
								<Accordion trigger="Start here">
									{Object.keys(this.state.filterFactors).map((filterFactor) =>
										<Panel header={filterFactor} eventKey={eventKey++}>
											{Object.keys(this.state.filterFactors[filterFactor]).map((factorType) =>
												<Checkbox type="checkbox" label={factorType} filterKey={factorType}
													handleCheckboxChange={this.toggleCheckboxFilters}/>
											)}
										</Panel>
									)}
								</Accordion>
							</div>
						</div>
					</div>
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
	<App />,
	document.getElementById('react')
)

