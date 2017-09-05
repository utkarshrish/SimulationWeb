const React = require('react');

class TickItem extends React.Component {

    constructor(props){
        super(props);
    }

    render(){
        let strategy = this.props.strategy;
        let tickTextLengthEm = strategy==="xAxis" ? ".71em" : ".35em";
        let tickXTextLength = strategy==="xAxis" ? 0 : -10;
        let tickYTextLength = strategy==="xAxis" ? 12 : 0;
        let tickTextStyle = strategy==="xAxis" ? 'middle' : 'end';

        let tickLineX = strategy==="xAxis" ? 0 : -6;
        let tickLineY = strategy==="xAxis" ? 6 : 0;

        let transformY = this.props.transformY;

        if(this.props.yMax!=undefined){
            transformY = this.props.height * (this.props.yMax - this.props.transformY * this.props.factor) / (this.props.yMax - this.props.negativeYMax);
        }

        let transform = "translate("+ this.props.transformX + "," + transformY + ")";
        return(
            <g className="axis" transform={transform}>
                <line y2={tickLineY} x2={tickLineX}></line>
                <text className={strategy} y={tickYTextLength} x={tickXTextLength} dy={tickTextLengthEm} text-anchor={tickTextStyle}>{this.props.text}</text>
            </g>
        );
    }
}

module.exports = TickItem;