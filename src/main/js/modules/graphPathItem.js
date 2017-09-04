const React = require('react');

class GraphPathItem extends React.Component {

    constructor(props){
        super(props);
    }

    render() {
        let path = "";

        if (this.props.yMax != undefined) {
            this.props.pathCoordinates.map(
                (coordinate) => {
                    if (coordinate.x <= this.props.year) {
                        path = path + "L" + this.props.legends[coordinate.x] + ","
                            + this.props.height * (this.props.yMax - coordinate.y * this.props.factor) / (this.props.yMax - this.props.negativeYMax)
                            + " "
                    }
                }
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

module.exports = GraphPathItem;