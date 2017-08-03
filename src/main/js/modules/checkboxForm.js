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

    render() {
        return (
            <ul className="sub-filters">
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