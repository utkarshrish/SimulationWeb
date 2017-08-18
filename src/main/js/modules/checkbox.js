const React = require('react');

class Checkbox extends React.Component {

    constructor(props){
        super(props);
        this.state = {isChecked: false};
        this.toggleCheckboxChange = this.toggleCheckboxChange.bind(this);
    }

    toggleCheckboxChange(){
        const { handleCheckboxChange, label } = this.props;
        this.setState(({ isChecked }) => ({ isChecked: !isChecked}));
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
                    <input type={type} value={filterKey} checked={isChecked} onChange={this.toggleCheckboxChange}/>
                    {label}
                </label>
        );
    }
}

module.exports = Checkbox;