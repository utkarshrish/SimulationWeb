const React = require('react');
const Checkbox = require('./checkbox');

class CheckboxFilters extends React.Component {
    constructor(props){
        super(props);
        this.toggleCheckbox = this.toggleCheckbox.bind(this);
    }

    toggleCheckbox(label){
        const {toggleCheckboxFilters } = this.props;

        toggleCheckboxFilters(label);
    }
//{this.props.filters.keys().map((filterLabel,filterKey)=>
//<li>
//<Checkbox label={filterLabel} handleCheckboxChange={this.toggleCheckbox} key={filterKey}/>
//</li>
//)}
//    var filterKeys = [];
//    for(var filterKey in this.props.filters){
//    filterKeys.push(filterKey);
//}
    render() {
        return (
            <ul>
                {Object.keys(this.props.filters).map((filterKey) =>
                    <li>
                        <Checkbox
                            type={this.props.type}
                            label={this.props.filters[filterKey]}
                            handleCheckboxChange={this.toggleCheckbox}
                            filterKey={filterKey}
                            boxCss={this.props.boxCss}
                        />
                    </li>
                )}
            </ul>
        );
    }
}

module.exports = CheckboxFilters;