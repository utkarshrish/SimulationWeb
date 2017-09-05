const React = require('react');
const GraphAxis = require('./graphAxis');
const GraphPathItem = require('./graphPathItem');
const GraphHoverAxis = require('./graphHoverAxis');

class SimulationGraph extends React.Component{

    constructor(props){
        super(props);
    }

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

        let model = this.props.graph;
        let width = model["width"];
        let height = model.height;
        let yAxisName = this.props.graphOption+"YAxis";
        let yAxis = model[yAxisName];

        let viewBox = "-50 0 ".concat(width.toString(), " ", height.toString());

        let xLegends = createXLegends(model.xAxis.ticks, model.xAxis.width);
        let yLegends = createYLegends(yAxis.ticks, yAxis.height);

        let transformGraphData = "translate(".concat(model.graphTransformAxisX.toString(), ",", model.graphTransformAxisY, ")");

        let hoverTicks = {};
        for(let year = 2015; year<=this.props.year; year++) {
            let hoverTick = [];
            for (let count=0; count< model[this.props.graphOption].length; count++) {
                let tick = {};
                tick["x"] = year;
                tick["y"] =  model[this.props.graphOption][count].data[year-2015].y;
                hoverTick.push(tick);
            }
            hoverTicks[year] = hoverTick;
        }
        const factor = this.props.factor;

        return (
            <div className="SimulationGraph cols-xs-6">
                <h4>
                    <span>{this.props.label}     </span>
                    <small>{this.props.units}</small>
                </h4>
                <svg width={width} viewBox={viewBox} preserveAspectRatio="xMinYMin" className="graph" height={height} aria-labelledby="c-title  c-desc">

                    <GraphAxis axisId="xAxis" transformAxisX={model.xAxis.transformAxisX}
                               transformAxisY={model.xAxis.transformAxisY}
                               legends={xLegends} strategy="xAxis"
                               axisTicks={model.xAxis.ticks}
                               length={model.xAxis.width}
                               unit={model.xAxis.unit}
                               opacity="1"
                    />

                    <GraphAxis axisId="yAxis" transformAxisX={yAxis.transformAxisX}
                               transformAxisY={yAxis.transformAxisY}
                               legends={yLegends} strategy="yAxis"
                               axisTicks={yAxis.ticks}
                               length={yAxis.height}
                               unit={yAxis.unit}
                               opacity="1"
                    />
                    <g className="axis" transform={transformGraphData}>
                        {model[this.props.graphOption].map(
                            (graphItem) =>
                                <GraphPathItem className={graphItem.type} legends={xLegends}
                                               pathCoordinates={graphItem.data}
                                               yMax={yAxis.ticks[yAxis.ticks.length-1].text}
                                               negativeYMax={yAxis.ticks[0].text}
                                               height={yAxis.height}
                                               factor={factor}
                                               year={this.props.year}
                                />
                        )}
                        {Object.keys(hoverTicks).map((year) =>
                            <GraphHoverAxis axisId={"legend"+ year} xLegends={xLegends} yLegends={yLegends}
                                hoverTick={hoverTicks[year]} unit={yAxis.unit}
                                yMax={yAxis.ticks[yAxis.ticks.length-1].text} negativeYMax={yAxis.ticks[0].text}
                                height={yAxis.height} factor={factor} year={year} opacity="0"
                            />
                        )}
                    </g>
                </svg>

                <div id="legend">
                    <div className="entry">
                        <span className={this.props.graphLegendsType + "-1"}/>{this.props.graphLegends[0]}
                    </div>
                    <div className="entry">
                        <span className={this.props.graphLegends[1]!==undefined ? this.props.graphLegendsType + "-2": ""}/>{this.props.graphLegends[1]}
                    </div>
                    <div className="entry">
                        <span className={this.props.graphLegends[2]!==undefined ? this.props.graphLegendsType + "-3": ""}/>{this.props.graphLegends[2]}
                    </div>
                    <div className="entry">
                        <span className={this.props.graphLegends[3]!==undefined ? this.props.graphLegendsType + "-4":""}/>{this.props.graphLegends[3]!==undefined ?this.props.graphLegends[3]:""}
                    </div>
                </div>
            </div>
        )

    }
}

module.exports = SimulationGraph;