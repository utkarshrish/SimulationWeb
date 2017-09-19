const React = require('react');
const ReactDOM = require('react-dom');
const Accordion = require('react-bootstrap/lib/Accordion');
const Panel = require('react-bootstrap/lib/Panel');
const Checkbox = require('./modules/checkbox');
const client = require('./client');
const SimulationGraph = require('./modules/simulationGraph');
const GraphNavigation = require('./modules/graphNavigation');

class Explorer extends React.Component {

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
			factor: 1.0,
			filters:{}
		};

		this.updateGraphFilter = this.updateGraphFilter.bind(this);
		this.toggleCheckboxFilters = this.toggleCheckboxFilters.bind(this);
	}

	componentDidMount() {
		client({method: 'GET', path: '/api/graphs/'+ this.state.user + '_' +'explorer'}).done(response => {
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
		this.setState({
			graphOption: changeEvent.target.value
		});
	}

	toggleCheckboxFilters(label){
		function addMultiMap(test, key, value) {
			if (!test[key]) {
				// Create 1-element array with this value.
				test[key] = [value];
			}
			else {
				// Append element to existing array.
				test[key].push(value);
			}
		}

		function sum(input){

			if (toString.call(input) !== "[object Array]")
				return false;

			var total =  0;
			for(var i=0;i<input.length;i++)
			{
				if(isNaN(input[i])){
					continue;
				}
				total += Number(input[i]);
			}
			return total;
		}

		let selectedCheckboxes = this.state.selectedCheckboxes;
		if (selectedCheckboxes.has(label)) {
			selectedCheckboxes.delete(label);
		} else {
			selectedCheckboxes.add(label);
		}
		let filters = {};
		for (let item of selectedCheckboxes.values()){
			if(item.split("_")[0]!=="Region") {
				addMultiMap(filters, item.split("_")[0], this.state.filterFactors[item.split("_")[0]][item.split("_")[1]]);
			}
		}

		let factor = 1;
		for(let filter in filters){
			factor = factor * sum(filters[filter]);
		}

		this.setState({selectedCheckboxes: selectedCheckboxes});
		this.setState({factor: factor});
		this.setState({filters: filters});
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
					<GraphNavigation title="Analytics Simulation| Explorer" year={this.state.year} capYear={2022}
									 activeKey={3} showPrepare={false}/>
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
										<Panel header={filterFactor} eventKey={eventKey++}>
											{Object.keys(this.state.filterFactors[filterFactor]).map((factorType) =>
												<Checkbox name={filterFactor} type="checkbox" label={factorType} filterKey={factorType}
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
	<Explorer />,
	document.getElementById('explorer')
)

