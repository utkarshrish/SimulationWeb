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

module.exports = TickItem;