const React = require('react');
const GraphPathItem = require('./graphPathItem');
const TickItem = require('./tickItem');

class GraphAxis extends React.Component {

    constructor(props){
        super(props);
    }

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
                    {this.props.axisTicks.map((axisTick) =>
                        <TickItem strategy={this.props.strategy} transformX={this.props.legends[axisTick.text]}
                                  transformY={transformY} text={axisTick.text + this.props.unit}/>
                    )}
                    <GraphPathItem className="axis" pathCoordinates={axisPath.pathCoordinates} factor={1}/>
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
                    <GraphPathItem className = "axis" pathCoordinates={axisPath.pathCoordinates} factor={1}/>
                </g>
            );
        }
    }
}

module.exports = GraphAxis;