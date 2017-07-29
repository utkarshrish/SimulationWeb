const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');

class App extends React.Component {

	constructor(props) {
		super(props);
		this.state = {graph: [], graphTypes: [], graphOption: 'operating_profit'};
		this.updateGraphFilter = this.updateGraphFilter.bind(this);
	}

	componentDidMount() {
		client({method: 'GET', path: '/api/graphs/operating_profit'}).done(response => {
			this.setState({graph: response.entity});
		});
		client({method: 'GET', path: '/api/graphs/graphTypes'}).done(response => {
			this.setState({graphTypes: response.entity});
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

	render() {
		var graphTypes = this.state.graphTypes.model;
		if(graphTypes !== undefined) {
			var graphTypesModel = JSON.parse(graphTypes);
			return (
				<div className="graph">
					<SimulationGraph graph={this.state.graph}/>
					<div className="GraphTypes">
						<ul>
							{graphTypesModel.graphTypes.map((graphType) =>
								<li>
									<label>
										<input type="radio" name="variable" value={graphType.value}
											   checked={graphType.value === this.state.graphOption}
											   onChange={this.updateGraphFilter}/>
										{graphType.label}
									</label>
								</li>
							)}
						</ul>

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
			var xLegends = {};
			var axisItemSize = Object.keys(xAxisTicks).length - 1;
			var xAxisTick = 0;

			xAxisTicks.map((axisTick) =>
				xLegends[axisTick.text] = length/axisItemSize*xAxisTick++);
			return xLegends;
		}

		function createYLegends(yAxisTicks, length){
			var yLegends = {};
			var axisItemSize = Object.keys(yAxisTicks).length - 1;

			var yAxisTick = axisItemSize;

			yAxisTicks.map((axisTick) =>
				yLegends[axisTick.text] = length/axisItemSize*yAxisTick--);

			return yLegends;
		}

		var graph = this.props.graph.model;
		if(graph !== undefined) {
			var model = JSON.parse(graph);
			var width = model.width;
			var height = model.height;

			var viewBox = "0 0 ".concat(width.toString(), " ", height.toString());

			var xLegends = createXLegends(model.xAxis.ticks, model.xAxis.width);
			var yLegends = createYLegends(model.yAxis.ticks, model.yAxis.height);

			var transformGraphData = "translate(".concat(model.graphTransformAxisX.toString(), ",", model.graphTransformAxisY, ")");

			return (
			<div className="SimulationGraph">

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
		var transformAxis = "translate(".concat(this.props.transformAxisX, "," , this.props.transformAxisY, ")");
		var axisPath;

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

			var transformY = 0;

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

			var transformX = 0;

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
		var strategy = this.props.strategy;
		var tickTextLengthEm = strategy==="xAxis" ? ".71em" : ".35em";
		var tickXTextLength = strategy==="xAxis" ? 0 : -10;
		var tickYTextLength = strategy==="xAxis" ? 12 : 0;
		var tickTextStyle = strategy==="xAxis" ? 'middle' : 'end';

		var tickLineX = strategy==="xAxis" ? 0 : -6;
		var tickLineY = strategy==="xAxis" ? 6 : 0;

		//props.text = 2015;
		//props.transformX = 0;
		//props.transformY = 0;
		var transform = "translate("+ this.props.transformX + "," + this.props.transformY + ")";
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
		var path = "";

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

