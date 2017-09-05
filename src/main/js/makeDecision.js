const React = require('react');
const ReactDOM = require('react-dom');
const Nav = require('react-bootstrap/lib/Nav');
const NavItem = require('react-bootstrap/lib/NavItem');
const ProgressBar = require('react-bootstrap/lib/ProgressBar');
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
            ACTIVE_BUTTON : "btn btn-primary btn-block",
            ACTIVE_SPAN : "glyphicon glyphicon-remove form-control-feedback",
            ACTIVE_DIV :"col-xs-2 form-group has-error has-feedback",
            ACTIVE_INPUT: "form-control",
            PASSIVE_BUTTON: "btn btn-primary btn-block disabled",
            PASSIVE_SPAN: "",
            PASSIVE_DIV: "col-xs-2",
            PASSIVE_INPUT: "",
            distributionBox: {
                input:"",
                div: "col-xs-2",
                span: ""
            },
            mediaBox: {
                input:"",
                div: "col-xs-2",
                span: ""
            },
            userBox: {
                input:"",
                div: "col-xs-4",
                span: ""
            },
            distribution: {
                convenience: 0.0,
                club: 0.0,
                grocery: 0.0,
                mass: 0.0
            },
            media: {
                print: 0.0,
                tv: 0.0,
                radio: 0.0,
                digitalAds: 0.0
            },
            unitPrice: 0.0,
            unitCost : 0.0,
            submitButton : "btn btn-primary btn-block disabled",
            productionUnit: "",
            year: document.getElementById('user').innerText.trim(),
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
        graphInput["productionUnit"] = this.state.productionUnit*1000000;
        graphInput["distribution"] = this.state.distribution;
        graphInput["media"] = this.state.media;
        graphInput["year"] =  this.state.year;

        client({
            method: 'POST',
            path: '/submitGraph',
            entity: graphInput,
            headers:    {
                'Content-Type': 'application/json',
                'Accept': 'application/hal+json'
            }
        }).done(response => {
        });
        window.setTimeout(function(){ window.location = "/dashboard"; },2000);
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

        var inputGroupName = this.state[event.target.name.split(".")[0]];
        var inputKey = event.target.name.split(".")[1];
        inputGroupName[inputKey] = event.target.value/100;
        this.setState({[event.target.name.split(".")[0]]: inputGroupName});

        let distributionValue = this.state.distribution.club + this.state.distribution.convenience
            + this.state.distribution.grocery + this.state.distribution.mass;
        let mediaValue = this.state.media.digitalAds + this.state.media.print
            + this.state.media.radio + this.state.media.tv;

        if(distributionValue>1.0){
            this.setState({
                distributionBox: {
                    input: this.state.ACTIVE_INPUT,
                    div: this.state.ACTIVE_DIV,
                    span: this.state.ACTIVE_SPAN
                }
            });
        }
        else{
            this.setState({
                distributionBox: {
                    input: this.state.PASSIVE_INPUT,
                    div: this.state.PASSIVE_DIV,
                    span: this.state.PASSIVE_SPAN
                }
            });
        }

        if(mediaValue>1.0){
            this.setState({
                mediaBox: {
                    input: this.state.ACTIVE_INPUT,
                    div: this.state.ACTIVE_DIV,
                    span: this.state.ACTIVE_SPAN
                }
            });
        }
        else{
            this.setState({
                mediaBox: {
                    input: this.state.PASSIVE_INPUT,
                    div: this.state.PASSIVE_DIV,
                    span: this.state.PASSIVE_SPAN
                }
            });
        }

        if(mediaValue>1.0 || distributionValue>1.0){
            this.setState({
                submitButton : this.state.PASSIVE_BUTTON
            })
        } else {
            this.setState({
                submitButton : this.state.ACTIVE_BUTTON
            })
        }
    }

    handleChangeNormal(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
        if(event.target.value && isNaN(event.target.value)){
            this.setState({
                userBox: {
                    input: this.state.ACTIVE_INPUT,
                    div: "col-xs-4 form-group has-error has-feedback",
                    span: this.state.ACTIVE_SPAN
                }
            });
            this.setState({
                submitButton : this.state.PASSIVE_BUTTON
            })
        } else {
            this.setState({
                userBox: {
                    input: this.state.PASSIVE_INPUT,
                    div: "col-xs-4",
                    span: this.state.PASSIVE_SPAN
                }
            });
            this.setState({
                submitButton : this.state.ACTIVE_BUTTON
            })
        }
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

            var productionUnit = this.state.productionUnit;
            var tradeChannelSpend;
            var mediaSpend;
            if(productionUnit.indexOf("M") > 0){
                productionUnit = productionUnit.match(/\d+/)[0];
                tradeChannelSpend = 0.4 * productionUnit * this.state.unitPrice ;
                mediaSpend = 0.3 * productionUnit * this.state.unitPrice;
                tradeChannelSpend = tradeChannelSpend + "M";
                mediaSpend = mediaSpend + "M";
            } else if(productionUnit.indexOf("m") > 0){
                productionUnit = productionUnit.match(/\d+/)[0];
                tradeChannelSpend = 0.4 * productionUnit * this.state.unitPrice ;
                mediaSpend = 0.3 * productionUnit * this.state.unitPrice;
                tradeChannelSpend = tradeChannelSpend + "m";
                mediaSpend = mediaSpend + "m";
            } else {
                tradeChannelSpend = 0.4 * productionUnit * this.state.unitPrice ;
                mediaSpend = 0.3 * productionUnit * this.state.unitPrice;
            }
            return (

                <div className="container">
                    <div className="header clearfix">
                        <Nav bsStyle="pills" pullRight="true">
                            <NavItem eventKey={1} href="/logout">Logout</NavItem>
                        </Nav>
                        <h3 className="text-muted">Analytics Simulation</h3>
                    </div>
                    <Nav bsStyle="tabs" justified activeKey={4}>
                        <NavItem eventKey={1} href="/dashboard">Dashboard</NavItem>
                        <NavItem eventKey={2} href="/reports">Reports</NavItem>
                        <NavItem eventKey={3} href="/explorer">Data Explorer</NavItem>
                        <NavItem eventKey={4} href="/makeDecision"> | Make Decision</NavItem>
                    </Nav>
                    <div className="row">
                        <form onSubmit={this.handleSubmit}>
                            <div className="decisions">
                                <section className="row">
                                    <div className="col-xs-4">
                                        <h4>Formulation in {this.state.year}<span data-toggle="popover" data-info="formulation" data-original-title="" title=""></span></h4>
                                        <div id="selectionButton" className="btn-group">
                                            {Object.keys(makeDecisionFormModel["style"]).map((styleType) =>
                                                <label className={(styleType === this.state.style)?"btn btn-info btn-md select": "btn btn-info btn-md"}>
                                                    <input type="radio" value={styleType}
                                                           checked={styleType === this.state.style}
                                                           onChange={this.handleChangeNormal}
                                                           name="style"/>
                                                    {makeDecisionFormModel["style"][styleType]}
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                    <div className="col-xs-8 features">
                                        <h4>Product Features and Positioning in {this.state.year}<span data-toggle="popover" data-info="product-features" data-original-title="" title=""></span></h4>
                                        <div  id="selectionButton" className="btn-group">
                                            {Object.keys(makeDecisionFormModel["productPlacement"]).map((styleType) =>
                                                <label className={(styleType === this.state.productPlacement)?"btn btn-info btn-md select": "btn btn-info btn-md"}>
                                                    <input type="radio" value={styleType}
                                                           checked={styleType === this.state.productPlacement}
                                                           onChange={this.handleChangeNormal}
                                                           name="productPlacement"/>
                                                    {makeDecisionFormModel["productPlacement"][styleType]}
                                                </label>
                                            )}
                                        </div>
                                    </div>
                                </section>
                                <section id="forecast-select" className="row">
                                    <div className={this.state.userBox.div}>
                                        <h4>Units to Produce in {this.state.year}</h4>
                                        <input type="text" className={this.state.userBox.input} value={this.state.productionUnit} name="productionUnit" onChange={this.handleChangeNormal}/>
                                        <span className={this.state.userBox.span}/>
                                        <small className="text-nowrap"> in million units</small> &nbsp;
                                    </div>
                                    <div className={this.state.userBox.div}>
                                        <h4>Channel Price in {this.state.year}</h4>
                                        <input type="text" className={this.state.userBox.input} value={this.state.unitPrice} name="unitPrice" onChange={this.handleChangeNormal}/>
                                        <small className="text-nowrap"> per 100 loads</small> &nbsp;
                                    </div>
                                </section>
                                <h4>Trade Channel Spend in {this.state.year}</h4>
                                <section className="row trade-channel-spend" data-valid="trade_channel_spend_decision">
                                    <div className="col-xs-8">
                                        <div className="row">
                                            <div className="col-xs-2"></div>
                                            {Object.keys(makeDecisionFormModel["distribution"]).map((input) =>
                                                <div className="col-xs-2 number">{makeDecisionFormModel["distribution"][input]}</div>
                                            )}
                                            <div className="col-xs-2 number">Total</div>
                                        </div>
                                    </div>
                                    <div className="col-xs-4">Total Trade Channel Budget: <span data-field="total_trade_channel_spend" data-format="usd-big" data-format-max="1000000">{"$" + tradeChannelSpend + "M"}</span></div>
                                    <div className="col-xs-8">
                                        <div className="row">
                                            <div className="col-xs-2"></div>
                                            {Object.keys(makeDecisionFormModel["distribution"]).map((input) =>
                                                <div className={this.state.distributionBox.div}>
                                                    <input type="text" className={this.state.distributionBox.input} value={this.state.distribution.input} name={"distribution."+ input} onChange={this.handleChange} />
                                                    <span className={this.state.distributionBox.span}/>
                                                </div>
                                            )}
                                            <div className="col-xs-2 number trade-channel-total invalid-highlight" data-format="percent" data-format-max="1000">
                                                {((this.state.distribution.convenience + this.state.distribution.club + this.state.distribution.grocery + this.state.distribution.mass)*100).toFixed(2)}%
                                            </div>
                                        </div>
                                    </div>
                                    <div className="col-xs-4">
                                        <div className="row">
                                            <ProgressBar>
                                                <ProgressBar bsStyle="success" now={this.state.distribution.convenience * 100} key={1} />
                                                <ProgressBar bsStyle="info" now={this.state.distribution.club * 100} key={2} />
                                                <ProgressBar bsStyle="warning" now={this.state.distribution.grocery * 100} key={3} />
                                                <ProgressBar bsStyle="danger" now={this.state.distribution.mass * 100} key={4} />
                                            </ProgressBar>
                                        </div>
                                    </div>

                                </section>
                                <h4>Media Spend in {this.state.year}</h4>
                                <section className="row media-spend" data-valid="media_spend_decision">
                                    <div className="col-xs-8">
                                        <div className="row">
                                            <div className="col-xs-2"></div>
                                            {Object.keys(makeDecisionFormModel["media"]).map((input) =>
                                                <div className="col-xs-2 number">{makeDecisionFormModel["media"][input]}</div>
                                            )}
                                            <div className="col-xs-2 number">Total</div>
                                        </div>
                                    </div>
                                    <div className="col-xs-4">Total Media Budget: <span data-field="total_media_spend" data-format="usd-big" data-format-max="1000000">{"$" + mediaSpend}</span></div>
                                    <div className="col-xs-8">
                                        <div className="row">
                                            <div className="col-xs-2"></div>
                                            {Object.keys(makeDecisionFormModel["media"]).map((input) =>
                                                <div className={this.state.mediaBox.div}>
                                                    <input type="text" className={this.state.mediaBox.input} value={this.state.media.input} name={"media."+ input} onChange={this.handleChange} />
                                                    <span className={this.state.mediaBox.span}/>
                                                </div>
                                            )}
                                            <div className="col-xs-2 number media-total invalid-highlight" data-format="percent" data-format-max="1000">
                                                {((this.state.media.print + this.state.media.tv + this.state.media.radio + this.state.media.digitalAds)*100).toFixed(2)}%</div>
                                        </div>
                                    </div>
                                    <div className="col-xs-4">
                                        <div className="row">
                                            <ProgressBar>
                                                <ProgressBar bsStyle="success" now={this.state.media.print * 100} key={1} />
                                                <ProgressBar bsStyle="info" now={this.state.media.tv * 100} key={2} />
                                                <ProgressBar bsStyle="warning" now={this.state.media.radio * 100} key={3} />
                                                <ProgressBar bsStyle="danger" now={this.state.media.digitalAds * 100} key={4} />
                                            </ProgressBar>
                                        </div>
                                    </div>
                                </section>
                                <h4>Target Market Segment for Decisions</h4>
                                <section className="row" data-valid="target_decision">
                                    <div className="col-xs-8" id="filter">
                                        <ul className="filter">
                                            {Object.keys(filters).map((filter) =>
                                                <li>
                                                    <div>
                                                        {filters[filter]}
                                                    </div>
                                                    <CheckboxFilters type="checkbox" filters={makeDecisionFormModel[filter]} toggleCheckboxFilters={this.toggleCheckboxFilters}/>
                                                </li>
                                            )}
                                        </ul>
                                    </div>
                                </section>
                            </div>
                            <div className="cols-xs-2">
                                <button id="submit" type="submit" className={this.state.submitButton}>Make Decision</button>
                            </div>
                        </form>
                    </div>
                    <footer>
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