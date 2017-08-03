const React = require('react');
const ReactDOM = require('react-dom');
const Accordion = require('react-bootstrap/lib/Accordion');
const Panel = require('react-bootstrap/lib/Panel');
const Nav = require('react-bootstrap/lib/Nav');
const NavItem = require('react-bootstrap/lib/NavItem');
const Checkbox = require('./modules/checkbox');
const client = require('./client');

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
		client({method: 'GET', path: '/api/graphs/operatingProfit'}).done(response => {
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
		var path = '/api/graphs/' + changeEvent.target.value ;
		client({method: 'GET', path: path}).done(response => {
			this.setState({graph: response.entity});
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
		if(graphTypes !== undefined) {
			var graphTypesModel = JSON.parse(graphTypes);
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
							<SimulationGraph graph={this.state.graph}
									label={graphTypesModel.graphTypes[this.state.graphOption]["label"]}
									units={graphTypesModel.graphTypes[this.state.graphOption]["units"]}
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
				<p>A</p>
			)
		}
	}
}

class SimulationGraph extends React.Component{
	render() {
		function createXLegends(xAxisTicks, length){
			let xLegends = {};
			let axisItemSize = Object.keys(xAxisTicks).length - 1;
			let xAxisTick = 0;

			xAxisTicks.map((axisTick) =>
				xLegends[axisTick.text] = length/axisItemSize*xAxisTick++);
			return xLegends;
		}

		function createYLegends(yAxisTicks, length){
			let yLegends = {};
			let axisItemSize = Object.keys(yAxisTicks).length - 1;

			let yAxisTick = axisItemSize;

			yAxisTicks.map((axisTick) =>
				yLegends[axisTick.text] = length/axisItemSize*yAxisTick--);

			return yLegends;
		}

		let graph = this.props.graph.model;
		if(graph !== undefined) {
			let model = JSON.parse(graph);
			let width = model.width;
			let height = model.height;

			let viewBox = "0 0 ".concat(width.toString(), " ", height.toString());

			let xLegends = createXLegends(model.xAxis.ticks, model.xAxis.width);
			let yLegends = createYLegends(model.yAxis.ticks, model.yAxis.height);

			let transformGraphData = "translate(".concat(model.graphTransformAxisX.toString(), ",", model.graphTransformAxisY, ")");

			return (
			<div className="SimulationGraph cols-xs-7">
				<h4>
					<span>{this.props.label}     </span>
					<small>{this.props.units}</small>
				</h4>
				<svg width={width} viewBox={viewBox} preserveAspectRatio="xMinYMin" className="graph" height={height} aria-labelledby="c-title  c-desc">

					<GraphAxis transformAxisX={model.xAxis.transformAxisX} transformAxisY={model.xAxis.transformAxisY} legends={xLegends} strategy="xAxis" axisTicks={model.xAxis.ticks} length={model.xAxis.width} unit={model.xAxis.unit}/>

					<GraphAxis transformAxisX={model.yAxis.transformAxisX} transformAxisY={model.yAxis.transformAxisY} legends={yLegends} strategy="yAxis" axisTicks={model.yAxis.ticks} length={model.yAxis.height} unit={model.yAxis.unit}/>

					<g className="axis" transform={transformGraphData}>
						{model.graphData.map(
							(graphItem) =>
								<GraphPathItem className={graphItem.type} legends={xLegends} pathCoordinates={graphItem.data} yMax={model.yAxis.height} height={model.yAxis.height}/>
						)}
					</g>
				</svg>
			</div>
			)
		} else {
			return (
				<p>A</p>
			)
		}
	}
}

class GraphAxis extends React.Component {
	render() {
		let transformAxis = "translate(".concat(this.props.transformAxisX, "," , this.props.transformAxisY, ")");
		let axisPath;

		if(this.props.strategy==="xAxis") {
			axisPath = {
				"pathCoordinates": [
					{
						"x": 0,
						"y": 0
					},
					{
						"x": this.props.length,
						"y": 0
					}
				]
			};

			let transformY = 0;

			return (
				<g transform={transformAxis}>
					{this.props.axisTicks.map((axisTick) => <TickItem strategy={this.props.strategy} transformX={this.props.legends[axisTick.text]} transformY={transformY} text={axisTick.text + this.props.unit}/>)}
					<GraphPathItem className = "axis" pathCoordinates={axisPath.pathCoordinates}/>
				</g>
			);
		}
		else {
			axisPath = {
				"pathCoordinates": [
					{
						"x": 0,
						"y": 0
					},
					{
						"x": 0,
						"y": this.props.length
					}
				]
			};

			let transformX = 0;

			return (
				<g transform={transformAxis}>
					{this.props.axisTicks.map((axisTick) => <TickItem strategy={this.props.strategy} transformX={transformX} transformY={this.props.legends[axisTick.text]} text={axisTick.text + this.props.unit}/>)}
					<GraphPathItem className = "axis" pathCoordinates={axisPath.pathCoordinates}/>
				</g>
			);
		}
	}
}

class TickItem extends React.Component {
	render(){
		let strategy = this.props.strategy;
		let tickTextLengthEm = strategy==="xAxis" ? ".71em" : ".35em";
		let tickXTextLength = strategy==="xAxis" ? 0 : -10;
		let tickYTextLength = strategy==="xAxis" ? 12 : 0;
		let tickTextStyle = strategy==="xAxis" ? 'middle' : 'end';

		let tickLineX = strategy==="xAxis" ? 0 : -6;
		let tickLineY = strategy==="xAxis" ? 6 : 0;

		//props.text = 2015;
		//props.transformX = 0;
		//props.transformY = 0;
		let transform = "translate("+ this.props.transformX + "," + this.props.transformY + ")";
		//style={{marginRight: spacing + 'em'}}
		return(
			<g className="axis" transform={transform} opacity="1">
				<line y2={tickLineY} x2={tickLineX}></line>
				<text className={strategy} y={tickYTextLength} x={tickXTextLength} dy={tickTextLengthEm} text-anchor={tickTextStyle}>{this.props.text}</text>
			</g>
		);
	}
}

class GraphPathItem extends React.Component {
	render() {
		let path = "";

		if (this.props.yMax != undefined) {
			this.props.pathCoordinates.map(
				(coordinate) =>
					path = path + "L" + this.props.legends[coordinate.x] + "," + this.props.height * (1 - coordinate.y / this.props.yMax) + " "
			)
		} else {
			this.props.pathCoordinates.map(
				(coordinate) => path = path + "L" + coordinate.x + "," + coordinate.y + " "
			)
		}
		path = "M" + path.substring(1, path.length);
		return (
			<path className={this.props.className} d={path}></path>
		)
	}
}

ReactDOM.render(
	<App />,
	document.getElementById('react')
)

