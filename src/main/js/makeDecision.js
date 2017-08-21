const React = require('react');
const ReactDOM = require('react-dom');
const Nav = require('react-bootstrap/lib/Nav');
const NavItem = require('react-bootstrap/lib/NavItem');
const client = require('./client');
const CheckboxFilters = require('./modules/checkboxForm');

class MakeDecision extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            makeDecisionForm: [],
            graphInput:{},
            filters:[],
            style: "pods",
            productPlacement:"odorElimination",
            distribution: {
                convenience:"",
                club: "",
                grocery: "",
                mass: ""
            },
            media: {
                print: "",
                tv: "",
                radio: "",
                digitalAds:""
            },
            unitPrice: 0,
            unitCost : 0,
            productionUnit: "",
            buttonClass: "",
            year: document.getElementById('user').innerText,
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

        let graphInput = {};
        var selectedCheckboxes = this.state.selectedCheckboxes;
        var makeDecisionFormModel = JSON.parse(this.state.makeDecisionForm.model);
        var allFilterKeys = [];
        for(var filter in makeDecisionFormModel){
            var graphFilter = new Object();
            for(var filterKey in makeDecisionFormModel[filter]){
                allFilterKeys.push(filterKey);
                if(selectedCheckboxes.has(makeDecisionFormModel[filter][filterKey])>0
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
        graphInput["year"] =  this.state.year;

        console.log(JSON.stringify(graphInput));

        client({
            method: 'POST',
            path: '/submitGraph',
            entity: graphInput,
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
        inputBoxGroupName[inputBoxKey] = event.target.value/100;
        this.setState({[event.target.name.split(".")[0]]: inputBoxGroupName});
    }

    handleChangeNormal(event) {
        event.preventDefault();
        this.setState({[event.target.name]: event.target.value});
        this.setState({buttonClass: "active"})
    }

    render() {
        var filters = {
            "incomeGroup": "Income Group",
            "ethnicity": "Ethnicity",
            "householdSizes":"HouseholdSizes",
            "region": "Region",
            "age":"Age"
        };

        var makeDecisionForm = this.state.makeDecisionForm.model;
        if(makeDecisionForm !== undefined){
            var makeDecisionFormModel = JSON.parse(makeDecisionForm);
            return (

                <div className="container">
                    <div className="header clearfix">
                        <Nav bsStyle="pills" pullRight="true">
                            <NavItem eventKey={1} href="/logout">Logout</NavItem>
                        </Nav>
                        <h3 className="text-muted">Analytics Simulation</h3>
                    </div>
                    <Nav bsStyle="pills" activeKey={4}>
                        <NavItem eventKey={1} href="/dashboard">Dashboard</NavItem>
                        <NavItem eventKey={2} href="/reports">Reports</NavItem>
                        <NavItem eventKey={3} href="/explorer">Data Explorer</NavItem>
                        <NavItem eventKey={4} href="/makeDecision"> | Make Decision</NavItem>
                    </Nav>
                    <div className="row">
                    <form onSubmit={this.handleSubmit}>
                <div className="decisions">
                    <section className="row">
                        <div className="col-xs-4 formulation">
                            <h3>Formulation in {this.state.year}<span data-toggle="popover" data-info="formulation" data-original-title="" title=""></span></h3>
                            <div className="btn-group">
                                <div>
                                    {Object.keys(makeDecisionFormModel["style"]).map((styleType) =>
                                        <label className={"btn btn-info btn-xs " + this.state.buttonClass}>
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
                            <h3>Product Features and Positioning in {this.state.year}<span data-toggle="popover" data-info="product-features" data-original-title="" title=""></span></h3>
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
                            <h3>Units to Produce in {this.state.year}</h3>
                            <input type="text" value={this.state.productionUnit} name="productionUnit" onChange={this.handleChangeNormal}/>
                            <small className="text-nowrap">units</small> &nbsp;
                            <div className="col-xs-4">
                                <label id="toggle-forecast">Forecast Demand</label>
                            </div>
                            <div className="fill-in" data-field-name="production_decision">Click here to fill in the previous year's value</div>
                        </div>
                        <div className="col-xs-4 forecast-obscure price-decision-cont invalid">
                            <h3>Channel Price in {this.state.year}</h3>
                            <input type="text" value={this.state.unitPrice} name={"unitPrice"} onChange={this.handleChangeNormal}/>
                            <small className="text-nowrap">per 100 loads</small>
                            <div className="fill-in" data-field-name="price_decision">Click here to fill in the previous year's value</div>
                        </div>
                    </section>
                    <h3>Trade Channel Spend in {this.state.year}<span data-toggle="popover" data-info="trade-channel-spend" data-original-title="" title=""></span></h3>
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
                    <h3>Media Spend in {this.state.year}<span data-toggle="popover" data-info="media-spend" data-original-title="" title=""></span></h3>
                    <section className="row media-spend" data-valid="media_spend_decision">
                        <div className="col-xs-8">
                            <div className="row">
                                <div className="col-xs-2"></div>
                                {Object.keys(makeDecisionFormModel["media"]).map((inputBox) =>
                                    <div className="col-xs-2 number">{makeDecisionFormModel["media"][inputBox]}</div>
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
                            <ul className="filter">
                                {Object.keys(filters).map((filter) =>
                                    <li>
                                        <div>
                                            <p>{filters[filter]}</p>
                                            <CheckboxFilters type="checkbox" filters={makeDecisionFormModel[filter]} toggleCheckboxFilters={this.toggleCheckboxFilters}/>
                                        </div>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </section>
                </div>
                <input type="submit" value="Submit" />
            </form>
                    </div>
                    <footer class="footer">
                        <p> &copy; 2017 Analytics Simulation</p>
                    </footer>
                </div>
            )
        } else {
            return (
                <p></p>
            )
        }
    }
}

ReactDOM.render(
    <MakeDecision />,
    document.getElementById('makeDecision')
)