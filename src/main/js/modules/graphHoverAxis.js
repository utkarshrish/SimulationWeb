const React = require('react');
const GraphPathItem = require('./graphPathItem');
const TickItem = require('./tickItem');

class GraphHoverAxis extends React.Component {

    constructor(props){
        super(props);
    }

    render() {
        const hoverTick = this.props.hoverTick;

        let axisPath = {
            "pathCoordinates": [
                {
                    "x": this.props.xLegends[this.props.year],
                    "y": 0
                },
                {
                    "x": this.props.xLegends[this.props.year],
                    "y": this.props.height
                }
            ]
        };
        let factor = this.props.factor;

        return (
            <g id={this.props.axisId} opacity={this.props.opacity}>
                {hoverTick.map((tick) =>
                    <TickItem strategy={"yAxis"} transformX={this.props.xLegends[this.props.year]}
                              transformY={tick.y} text={(tick.y * this.props.factor).toFixed(2) + this.props.unit}
                              yMax={this.props.yMax * (factor+0.1>1?factor: factor+0.1)}
                              negativeYMax={this.props.negativeYMax * (factor+0.1>1?factor: factor+0.1)}
                              height={this.props.height}
                              factor={this.props.factor}
                              year={this.props.year}
                    />
                )}
                <GraphPathItem className = "axis" pathCoordinates={axisPath.pathCoordinates} factor={1}/>
            </g>
        );
    }
}

module.exports = GraphHoverAxis;