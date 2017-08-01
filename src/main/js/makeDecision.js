const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');
const CheckboxFilters = require('./modules/checkboxForm');

class MakeDecision extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            makeDecisionForm: [],
            graphInput:{},
            filters:[],
            "style": "pods",
            "productPlacement":"odorElimination",
            "distribution": {
                "convenience":"",
                "club": "",
                "grocery": "",
                "mass": ""
            },
            "media": {
                "print": "",
                "tv": "",
                "radio": "",
                "digitalAds":""
            },
            "unitPrice": 0,
            "unitCost" : 0,
            "productionUnit": "",
            selectedCheckboxes: new Set()
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleChangeNormal = this.handleChangeNormal.bind(this);
        this.toggleCheckboxFilters = this.toggleCheckboxFilters.bind(this);
    }

    componentDidMount() {
        client({method: 'GET', path: '/api/graphs/makeDecisionForm'}).done(response => {
            this.setState({makeDecisionForm: response.entity});
            var makeDecisionFormModel = JSON.parse(response.entity.model);
            var filterKeys = [];
            for(var filterKey in makeDecisionFormModel){
                filterKeys.push(filterKey);
            }
            this.setState({filters: filterKeys});
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        for (const checkbox of this.state.selectedCheckboxes) {
            console.log(checkbox, 'is selected.');
        }

        let graphInput = {};
        var selectedCheckboxes = this.state.selectedCheckboxes;
        var makeDecisionFormModel = JSON.parse(this.state.makeDecisionForm.model);
        var allFilterKeys = [];
        for(var filter in makeDecisionFormModel){
            var graphFilter = new Object();
            for(var filterKey in makeDecisionFormModel[filter]){
                allFilterKeys.push(filterKey);
                if(selectedCheckboxes.has(filterKey)>0
                    || this.state.style === filterKey
                    || this.state.productPlacement === filterKey){
                    graphFilter[filterKey] = 1;
                } else{
                    graphFilter[filterKey] = 0;
                }
            }
            graphInput[filter] = graphFilter;
        }

        graphInput["unitPrice"] = this.state.unitPrice;
        graphInput["unitCost"] = this.state.unitCost;
        graphInput["productionUnit"] = this.state.productionUnit;
        graphInput["distribution"] = this.state.distribution;
        graphInput["media"] = this.state.media;

        console.log(JSON.stringify(graphInput));

        client({
            method: 'POST',
            path: '/submitGraph',
            entity: JSON.stringify(graphInput),
            headers:    {
                'Content-Type': 'application/json',
                'Accept': 'application/hal+json'
            }
        }).done(response => {
            console.log(response.entity);
        });
    }

    toggleCheckboxFilters(label){
        let selectedCheckboxes = this.state.selectedCheckboxes;
        if (selectedCheckboxes.has(label)) {
            selectedCheckboxes.delete(label);
        } else {
            selectedCheckboxes.add(label);
        }
        this.setState({selectedCheckboxes: selectedCheckboxes});
    }

    handleChange(event) {
        event.preventDefault();
        var inputBoxGroupName = this.state[event.target.name.split(".")[0]];
        var inputBoxKey = event.target.name.split(".")[1];
        inputBoxGroupName[inputBoxKey] = event.target.value;
        this.setState({[event.target.name.split(".")[0]]: inputBoxGroupName});
    }

    handleChangeNormal(event) {
        event.preventDefault();
        this.setState({[event.target.name]: event.target.value});
    }

    render() {
        var filters = ["incomeGroup", "ethnicity","householdSizes", "region", "age"];
        var styleAndProduct = ["style", "productPlacement"];
        var makeDecisionForm = this.state.makeDecisionForm.model;
        if(makeDecisionForm !== undefined){
            var makeDecisionFormModel = JSON.parse(makeDecisionForm);
            return (
            <form onSubmit={this.handleSubmit}>
                <div className="decisions">
                    <section className="row">
                        <div className="col-xs-4 formulation">
                            <h3>Formulation in 2020<span data-toggle="popover" data-info="formulation" data-original-title="" title=""></span></h3>
                            <div className="btn-group">
                                <div>
                                    {Object.keys(makeDecisionFormModel["style"]).map((styleType) =>
                                        <label className="btn btn-info btn-xs">
                                            <input type="radio" value={styleType}
                                                   checked={styleType === this.state.style}
                                                   onChange={this.handleChangeNormal}
                                                   name={"style"}/>
                                            {makeDecisionFormModel["style"][styleType]}
                                        </label>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="col-xs-8 features">
                            <h3>Product Features and Positioning in 2020<span data-toggle="popover" data-info="product-features" data-original-title="" title=""></span></h3>
                            <div className="btn-group">
                                {Object.keys(makeDecisionFormModel["productPlacement"]).map((styleType) =>
                                    <label className="btn btn-info btn-xs">
                                        <input type="radio" value={styleType}
                                               checked={styleType === this.state.productPlacement}
                                               onChange={this.handleChangeNormal}
                                               name={"productPlacement"}/>
                                        {makeDecisionFormModel["productPlacement"][styleType]}
                                    </label>
                                )}
                            </div>
                        </div>
                    </section>
                    <section id="forecast-select" className="row">
                        <div className="col-xs-4 unit-decision-cont invalid" id="demand">
                            <h3>Units to Produce in 2020</h3>
                            <input type="text" value={this.state.productionUnit} name="productionUnit" onChange={this.handleChangeNormal}/>
                            <small className="text-nowrap">units</small> &nbsp;
                            <div className="col-xs-4">
                                <label id="toggle-forecast">Forecast Demand</label>
                            </div>
                            <div className="fill-in" data-field-name="production_decision">Click here to fill in the previous year's value</div>
                        </div>
                        <div className="col-xs-4 forecast-obscure price-decision-cont invalid">
                            <h3>Channel Price in 2020</h3>
                            <input type="text" value={this.state.unitPrice} name={"unitPrice"} onChange={this.handleChangeNormal}/>
                            <small className="text-nowrap">per 100 loads</small>
                            <div className="fill-in" data-field-name="price_decision">Click here to fill in the previous year's value</div>
                        </div>
                    </section>
                    <h3>Trade Channel Spend in 2020<span data-toggle="popover" data-info="trade-channel-spend" data-original-title="" title=""></span></h3>
                    <section className="row trade-channel-spend" data-valid="trade_channel_spend_decision">
                        <div className="col-xs-8">
                            <div className="row">
                                <div className="col-xs-2"></div>
                                {Object.keys(makeDecisionFormModel["distribution"]).map((inputBox) =>
                                    <div className="col-xs-2 number">{makeDecisionFormModel["distribution"][inputBox]}</div>
                                )}
                                <div className="col-xs-2 number">Total</div>
                            </div>
                        </div>
                        <div className="col-xs-4">Total Trade Channel Budget: <span data-field="total_trade_channel_spend" data-format="usd-big" data-format-max="1000000">$15.0M</span></div>
                        <div className="col-xs-8">
                            <div className="row">
                                <div className="col-xs-2"></div>
                                {Object.keys(makeDecisionFormModel["distribution"]).map((inputBox) =>
                                    <div className="col-xs-2">
                                        <input type="text" value={this.state.distribution.inputBox} name={"distribution."+ inputBox} onChange={this.handleChange} />
                                    </div>
                                )}
                                <div className="col-xs-2 number trade-channel-total invalid-highlight" data-format="percent" data-format-max="1000">100.0%</div>
                            </div>
                        </div>
                    </section>
                    <h3>Media Spend in 2020<span data-toggle="popover" data-info="media-spend" data-original-title="" title=""></span></h3>
                    <section className="row media-spend" data-valid="media_spend_decision">
                        <div className="col-xs-8">
                            <div className="row">
                                <div className="col-xs-2"></div>
                                {Object.keys(makeDecisionFormModel["media"]).map((inputBox) =>
                                    <div className="col-xs-2 number">{makeDecisionFormModel["distribution"][inputBox]}</div>
                                )}
                            </div>
                        </div>
                        <div className="col-xs-4">Total Media Budget: <span data-field="total_media_spend" data-format="usd-big" data-format-max="1000000">$6.1M</span></div>
                        <div className="col-xs-8">
                            <div className="row">
                                <div className="col-xs-2"></div>
                                {Object.keys(makeDecisionFormModel["media"]).map((inputBox) =>
                                    <div className="col-xs-2">
                                        <input type="text" value={this.state.media.inputBox} name={"media."+ inputBox} onChange={this.handleChange} />
                                    </div>
                                )}
                                <div className="col-xs-2 number media-total invalid-highlight" data-format="percent" data-format-max="1000">100.0%</div>
                            </div>
                        </div>
                    </section>
                    <h3>Target Market Segment for Decisions<span data-toggle="popover" data-info="target-market-segment" data-original-title="" title=""></span></h3>
                    <section className="row" data-valid="target_decision">
                        <div className="col-xs-8" id="filter">
                            <h5>Filters</h5>
                            {filters.map((filter) =>
                                <div>
                                    <p>{filter}</p>
                                    <CheckboxFilters type="checkbox" filters={makeDecisionFormModel[filter]} toggleCheckboxFilters={this.toggleCheckboxFilters}/>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
                <input type="submit" value="Submit" />
            </form>
            )
        } else {
            return (
                <p>A</p>
            )
        }
    }
}

ReactDOM.render(
    <MakeDecision />,
    document.getElementById('makeDecision')
)