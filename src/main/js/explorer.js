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
			year: document.getElementById('user').innerText.trim().split("_")[1],
			user: document.getElementById('user').innerText.trim().split("_")[0],
			graph: [],
			graphTypes:[],
			graphOption: 'operatingProfit',
			filterFactors: [],
			selectedCheckboxes: new Set(),
			factor:0.0,
			explorerFilterFactors: []
		};

		this.updateGraphFilter = this.updateGraphFilter.bind(this);
		this.toggleCheckboxFilters = this.toggleCheckboxFilters.bind(this);
		this.setFactor = this.setFactor.bind(this);
	}

	componentDidMount() {
		client({method: 'GET', path: '/api/graphs/'+ this.state.user + '_' +'explorer'}).done(response => {
			this.setState({graph: response.entity});
		});
		client({method: 'GET', path: '/api/graphs/graphTypes'}).done(response => {
			this.setState({graphTypes: response.entity});
		});
		client({method: 'GET', path: '/api/graphs/explorerFilterFactor'}).done(response => {
			let filterFactor = {};
			filterFactor = JSON.parse(response.entity.model);
			let explorerFilterFactors = {};
			for(let filter in filterFactor){
				for(let factorType in filterFactor[filter]){
					explorerFilterFactors[factorType] = filterFactor[filter][factorType];
				}
			}

			this.setState({filterFactors:filterFactor});
			this.setState({explorerFilterFactors:explorerFilterFactors});
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
		let factor = this.state.factor;
		if (selectedCheckboxes.has(label)) {
			factor = factor - this.state.explorerFilterFactors[label];
			selectedCheckboxes.delete(label);
			this.setState({factor: factor})
		} else {
			factor = factor + this.state.explorerFilterFactors[label];
			selectedCheckboxes.add(label);
			this.setState({factor: factor})
		}
		this.setState({selectedCheckboxes: selectedCheckboxes});
	}

	setFactor(){
		this.setState({factor:0.0});
		this.setState({selectedCheckboxes: new Set()})
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
					<div className="header clearfix">
						<Nav bsStyle="pills" pullRight="true">
							<NavItem eventKey={1} href="/logout">Logout</NavItem>
						</Nav>
						<h3 className="text-muted">Analytics Simulation</h3>
					</div>
					<Nav bsStyle="tabs" justified activeKey={3}>
						<NavItem eventKey={1} href="/dashboard">Dashboard</NavItem>
						<NavItem eventKey={2} href="/reports">Reports</NavItem>
						<NavItem eventKey={3} href="/explorer">Data Explorer</NavItem>
						<NavItem eventKey={4} href="/makeDecision"> | Make Decision</NavItem>
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
									graphLegends={graphTypesModel.graphTypes[this.state.graphOption]["legends"]}
									graphLegendsType={graphTypesModel.graphTypes[this.state.graphOption]["legendsType"]}
									factor={this.state.factor<0.01 ? 1.0: this.state.factor}
									year={this.state.year}
							/>
							<div className="GraphFilters cols-xs-3">
								<h4>Filters</h4>
								<Accordion trigger="Start here">
									{Object.keys(this.state.filterFactors).map((filterFactor) =>
										<Panel header={filterFactor} eventKey={eventKey++} onSelect={this.setFactor}>
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

ReactDOM.render(
	<App />,
	document.getElementById('explorer')
)

