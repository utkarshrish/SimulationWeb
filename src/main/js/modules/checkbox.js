const React = require('react');

class Checkbox extends React.Component {

    constructor(props){
        super(props);
        this.state = {isChecked: false};
        this.toggleCheckboxChange = this.toggleCheckboxChange.bind(this);
    }

    toggleCheckboxChange(){
        let label = this.props.label;
        const { handleCheckboxChange} = this.props;
        this.setState(({ isChecked }) => ({ isChecked: !isChecked}));
        if(this.props.name){
            label = this.props.name+ "_" + label;
        }
        handleCheckboxChange(label);
    }

    render() {
        const { label, filterKey, type, boxCss} = this.props;
        const { isChecked } = this.state;
        let active = "";
        if(isChecked){
            active = " active";
        }
        return (
                <label className={boxCss + active} >
                    <input name={this.props.name?this.props.name:""} type={type} value={filterKey} checked={isChecked} onChange={this.toggleCheckboxChange}/>
                    {label}
                </label>
        );
    }
}

module.exports = Checkbox;