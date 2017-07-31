const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');

class MakeDecision extends React.Component {

    constructor(props){
        super(props);
        this.state = {abc: ''};
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleSubmit(event) {
        var obj = new Object();
        obj.unitPrice = 8.0;
        obj.unitCost  = 10.0;
        obj.productionUnit = 1000;
        obj.dataPoint = null;
        var jsonString= JSON.stringify(obj);

        client({
            method: 'POST',
            path: '/submitGraph',
            entity: obj,
            headers:    {
                'Content-Type': 'application/json',
                'Accept': 'application/hal+json'
            }
        }).done(response => {
            this.setState({abc: response.entity});
        });
        event.preventDefault();
    }

    render() {
        return (
            <form onSubmit={this.handleSubmit}>
                <div class="decisions">
                    <section id="forecast-select" class="row">
                        <div class="col-xs-4 unit-decision-cont invalid" id="demand">
                            <h3>Units to Produce in 2020<span data-toggle="popover" data-info="units-to-produce" data-original-title="" title=""></span></h3>
                            <input type="text" class="number production_decision" data-format="big" data-format-max="1000000" data-min="0" data-step="100000" data-calculate="distribution" data-blank-field="production_decision" placeholder="millions" data-multiplier="1000000"/>
                            <small class="text-nowrap">units</small> &nbsp;
                            <div class="btn-group btn-group-xs">
                                <label id="toggle-forecast" class="btn btn-default dropdown-toggle">Forecast Demand <span class="caret"></span></label>
                            </div>
                            <div class="fill-in" data-field-name="production_decision">Click here to fill in the previous year's value</div>
                        </div>
                        <div class="col-xs-4 forecast-obscure price-decision-cont invalid">
                            <h3>Channel Price in 2020</h3>
                            <input type="text" class="number price_decision" data-format="usd" data-min="0" data-max="99.99" data-step="0.1" data-calculate="distribution" placeholder="dollars" data-blank-field="price_decision" data-multiplier="1"/>
                            <small class="text-nowrap">per 100 loads</small>
                            <div class="fill-in" data-field-name="price_decision">Click here to fill in the previous year's value</div>
                        </div>
                    </section>
                    <section class="row">
                        <div class="col-xs-4 formulation">
                            <h3>Formulation in 2020<span data-toggle="popover" data-info="formulation" data-original-title="" title=""></span></h3>
                            <div class="btn-group">
                                <label class="btn btn-info btn-xs"><input type="radio" name="formulations" autocomplete="off" value="1" data-field="formulation_decision"/>Pods</label>
                                <label class="btn btn-info btn-xs active"><input type="radio" name="formulations" autocomplete="off" value="2" data-field="formulation_decision"/>Liquid</label>
                                <label class="btn btn-info btn-xs"><input type="radio" name="formulations" autocomplete="off" value="3" data-field="formulation_decision"/>Powder</label>
                            </div>
                        </div>
                        <div class="col-xs-8 features">
                            <h3>Product Features and Positioning in 2020<span data-toggle="popover" data-info="product-features" data-original-title="" title=""></span></h3>
                            <div class="btn-group">
                                <label class="btn btn-info btn-xs"><input type="radio" name="brandAttributes" autocomplete="off" value="1" data-field="equity_message_decision"/>Odor elimination</label>
                                <label class="btn btn-info btn-xs active"><input type="radio" name="brandAttributes" autocomplete="off" value="2" data-field="equity_message_decision"/>Cold water</label>
                                <label class="btn btn-info btn-xs"><input type="radio" name="brandAttributes" autocomplete="off" value="3" data-field="equity_message_decision"/>Scent</label>
                                <label class="btn btn-info btn-xs"><input type="radio" name="brandAttributes" autocomplete="off" value="4" data-field="equity_message_decision"/>Softness</label>
                            </div>
                        </div>
                    </section>
                    <h3>Trade Channel Spend in 2020<span data-toggle="popover" data-info="trade-channel-spend" data-original-title="" title=""></span></h3>
                    <section class="row trade-channel-spend" data-valid="trade_channel_spend_decision">
                        <div class="col-xs-8">
                            <div class="row">
                                <div class="col-xs-2"></div>
                                <div class="col-xs-2 number">Convenience</div>
                                <div class="col-xs-2 number">Club</div>
                                <div class="col-xs-2 number">Grocery</div>
                                <div class="col-xs-2 number">Mass</div>
                                <div class="col-xs-2 number">Total</div>
                            </div>
                        </div>
                        <div class="col-xs-4">Total Trade Channel Budget: <span data-field="total_trade_channel_spend" data-format="usd-big" data-format-max="1000000">$15.0M</span></div>
                        <div class="col-xs-8">
                            <div class="row">
                                <div class="col-xs-2"></div>
                                <div class="col-xs-2">
                                    <input type="text" class="number trade-channel trade-channel-0" data-base-field="trade_channel_spend_decision[0]" data-calculate="sums" data-format="percent" data-format-max="100" data-min="0" data-step="1" data-base-sum-field="total_trade_channel_spend"/>
                                </div>
                                <div class="col-xs-2">
                                    <input type="text" class="number trade-channel trade-channel-1" data-base-field="trade_channel_spend_decision[1]" data-calculate="sums" data-format="percent" data-format-max="100" data-min="0" data-step="1" data-base-sum-field="total_trade_channel_spend"/>
                                </div>
                                <div class="col-xs-2">
                                    <input type="text" class="number trade-channel trade-channel-2" data-base-field="trade_channel_spend_decision[2]" data-calculate="sums" data-format="percent" data-format-max="100" data-min="0" data-step="1" data-base-sum-field="total_trade_channel_spend"/>
                                </div>
                                <div class="col-xs-2">
                                    <input type="text" class="number trade-channel trade-channel-3" data-base-field="trade_channel_spend_decision[3]" data-calculate="sums" data-format="percent" data-format-max="100" data-min="0" data-step="1" data-base-sum-field="total_trade_channel_spend"/>
                                </div>
                                <div class="col-xs-2 number trade-channel-total invalid-highlight" data-format="percent" data-format-max="1000">100.0%</div>
                            </div>
                        </div>
                        <div class="col-xs-4 chart">
                            <div class="series s-1" data-width=".trade-channel-0" data-width-max=".trade-channel-total" ></div>
                            <div class="series s-2" data-width=".trade-channel-1" data-width-max=".trade-channel-total" ></div>
                            <div class="series s-3" data-width=".trade-channel-2" data-width-max=".trade-channel-total" ></div>
                            <div class="series s-4" data-width=".trade-channel-3" data-width-max=".trade-channel-total" ></div>
                        </div>
                        <div class="col-xs-offset-8 col-xs-4 invalid-message">(currently over budget)</div>
                    </section>
                    <h3>Media Spend in 2020<span data-toggle="popover" data-info="media-spend" data-original-title="" title=""></span></h3>
                    <section class="row media-spend" data-valid="media_spend_decision">
                        <div class="col-xs-8">
                            <div class="row">
                                <div class="col-xs-2"></div>
                                <div class="col-xs-2 number">Print</div>
                                <div class="col-xs-2 number">TV</div>
                                <div class="col-xs-2 number">Radio</div>
                                <div class="col-xs-2 number">Digital Ads</div>
                                <div class="col-xs-2 number">Total</div>
                            </div>
                        </div>
                        <div class="col-xs-4">Total Media Budget: <span data-field="total_media_spend" data-format="usd-big" data-format-max="1000000">$6.1M</span></div>
                        <div class="col-xs-8">
                            <div class="row">
                                <div class="col-xs-2"></div>
                                <div class="col-xs-2">
                                    <input type="text" class="number media media-0" data-base-field="media_spend_decision[0]" data-calculate="sums" data-format="percent" data-format-max="100" data-min="0" data-step="1" data-base-sum-field="total_media_spend"/>
                                </div>
                                <div class="col-xs-2">
                                    <input type="text" class="number media media-1" data-base-field="media_spend_decision[1]" data-calculate="sums" data-format="percent" data-format-max="100" data-min="0" data-step="1" data-base-sum-field="total_media_spend"/>
                                </div>
                                <div class="col-xs-2">
                                    <input type="text" class="number media media-2" data-base-field="media_spend_decision[2]" data-calculate="sums" data-format="percent" data-format-max="100" data-min="0" data-step="1" data-base-sum-field="total_media_spend"/>
                                </div>
                                <div class="col-xs-2">
                                    <input type="text" class="number media media-3" data-base-field="media_spend_decision[3]" data-calculate="sums" data-format="percent" data-format-max="100" data-min="0" data-step="1" data-base-sum-field="total_media_spend"/>
                                </div>
                                <div class="col-xs-2 number media-total invalid-highlight" data-format="percent" data-format-max="1000">100.0%</div>
                            </div>
                        </div>
                        <div class="col-xs-4 chart">
                            <div class="series s-1" data-width=".media-0" data-width-max=".media-total" ></div>
                            <div class="series s-2" data-width=".media-1" data-width-max=".media-total" ></div>
                            <div class="series s-3" data-width=".media-2" data-width-max=".media-total" ></div>
                            <div class="series s-4" data-width=".media-3" data-width-max=".media-total" ></div>
                        </div>
                        <div class="col-xs-offset-8 col-xs-4 invalid-message">(currently over budget)</div>
                    </section>
                    <h3>Target Market Segment for Decisions<span data-toggle="popover" data-info="target-market-segment" data-original-title="" title=""></span></h3>
                    <section class="row" data-valid="target_decision">
                        <div class="col-xs-8" id="filter">
                            <h5>Filters</h5>
                            <ul class="filter">
                                <li>
                                    <div>Income</div>
                                    <ul class="sub-filters">
                                        <li class="" data-id="all">
                                            <label>
                                                <input type="checkbox" autocomplete="off"/> All Incomes
                                            </label>
                                        </li>
                                        <li class="" data-id="none">
                                            <label>
                                                <input type="checkbox" autocomplete="off"/> No Income Focus
                                            </label>
                                        </li>
                                        <li class="" data-id="<20K">
                                            <label>
                                                <input type="checkbox" autocomplete="off"/> Under $20,000
                                            </label>
                                        </li>
                                        <li class="" data-id="20Kto40K">
                                            <label>
                                                <input type="checkbox" autocomplete="off"/> $20,000 - $39,999
                                            </label>
                                        </li>
                                        <li class="active" data-id="40Kto60K">
                                            <label>
                                                <input type="checkbox" autocomplete="off" checked=""/> $40,000 - $59,999
                                            </label>
                                        </li>
                                        <li class="active" data-id="60K+">
                                            <label>
                                                <input type="checkbox" autocomplete="off" checked=""/> $60,000 and Over
                                            </label>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <div>Ethnicity</div>
                                    <ul class="sub-filters">
                                        <li class="" data-id="all">
                                            <label>
                                                <input type="checkbox" autocomplete="off"/> All Ethnicities
                                            </label>
                                        </li>
                                        <li class="active" data-id="none">
                                            <label>
                                                <input type="checkbox" autocomplete="off" checked=""/> No Ethnicity Focus
                                            </label>
                                        </li>
                                        <li class="" data-id="asian">
                                            <label>
                                                <input type="checkbox" autocomplete="off"/> Asian
                                            </label>
                                        </li>
                                        <li class="" data-id="black">
                                            <label>
                                                <input type="checkbox" autocomplete="off"/> Black
                                            </label>
                                        </li>
                                        <li class="" data-id="hispanic">
                                            <label>
                                                <input type="checkbox" autocomplete="off"/> Hispanic
                                            </label>
                                        </li>
                                        <li class="" data-id="white">
                                            <label>
                                                <input type="checkbox" autocomplete="off"/> White
                                            </label>
                                        </li>
                                        <li class="" data-id="other">
                                            <label>
                                                <input type="checkbox" autocomplete="off"/> Other
                                            </label>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <div>Household Size</div>
                                    <ul class="sub-filters">
                                        <li class="" data-id="all">
                                            <label>
                                                <input type="checkbox" autocomplete="off"/> All Household Sizes
                                            </label>
                                        </li>
                                        <li class="" data-id="none">
                                            <label>
                                                <input type="checkbox" autocomplete="off"/> No Household Focus
                                            </label>
                                        </li>
                                        <li class="" data-id="1">
                                            <label>
                                                <input type="checkbox" autocomplete="off"/> 1
                                            </label>
                                        </li>
                                        <li class="" data-id="2">
                                            <label>
                                                <input type="checkbox" autocomplete="off"/> 2
                                            </label>
                                        </li>
                                        <li class="active" data-id="3">
                                            <label>
                                                <input type="checkbox" autocomplete="off" checked=""/> 3
                                            </label>
                                        </li>
                                        <li class="active" data-id="4">
                                            <label>
                                                <input type="checkbox" autocomplete="off" checked=""/> 4
                                            </label>
                                        </li>
                                        <li class="active" data-id="5+">
                                            <label>
                                                <input type="checkbox" autocomplete="off" checked=""/> 5+
                                            </label>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <div>Region</div>
                                    <ul class="sub-filters">
                                        <li class="active" data-id="all">
                                            <label>
                                                <input type="checkbox" autocomplete="off" checked=""/> All Regions
                                            </label>
                                        </li>
                                        <li class="" data-id="none">
                                            <label>
                                                <input type="checkbox" autocomplete="off"/> No Regional Focus
                                            </label>
                                        </li>
                                        <li class="active" data-id="northeast">
                                            <label>
                                                <input type="checkbox" autocomplete="off" checked=""/> Northeast
                                            </label>
                                        </li>
                                        <li class="active" data-id="southeast">
                                            <label>
                                                <input type="checkbox" autocomplete="off" checked=""/> Southeast
                                            </label>
                                        </li>
                                        <li class="active" data-id="central">
                                            <label>
                                                <input type="checkbox" autocomplete="off" checked=""/> Central
                                            </label>
                                        </li>
                                        <li class="active" data-id="west">
                                            <label>
                                                <input type="checkbox" autocomplete="off" checked=""/> West
                                            </label>
                                        </li>
                                    </ul>
                                </li>
                                <li>
                                    <div>Age</div>
                                    <ul class="sub-filters">
                                        <li class="" data-id="all">
                                            <label>
                                                <input type="checkbox" autocomplete="off"/> All Ages
                                            </label>
                                        </li>
                                        <li class="" data-id="none">
                                            <label>
                                                <input type="checkbox" autocomplete="off"/> No Age Focus
                                            </label>
                                        </li>
                                        <li class="" data-id="<35">
                                            <label>
                                                <input type="checkbox" autocomplete="off/"/> Under 35
                                            </label>
                                        </li>
                                        <li class="active" data-id="35to44">
                                            <label>
                                                <input type="checkbox" autocomplete="off" checked=""/> 35 - 44
                                            </label>
                                        </li>
                                        <li class="active" data-id="45to54">
                                            <label>
                                                <input type="checkbox" autocomplete="off" checked=""/> 45 - 54
                                            </label>
                                        </li>
                                        <li class="active" data-id="55+">
                                            <label>
                                                <input type="checkbox" autocomplete="off" checked=""/> 55 and Over
                                            </label>
                                        </li>
                                    </ul>
                                </li>
                            </ul>
                        </div>
                        <div class="col-xs-4" id="plan">
                            <h6>Strategic Plan Executive Summary</h6>
                            <textarea data-field="summary_decision"></textarea>
                        </div>
                        <div class="col-xs-8 text-right invalid-message">(no target market segment selected)</div>
                    </section>
                </div>
                <input type="submit" value="Submit" />
            </form>
        );
    }
}

ReactDOM.render(
    <MakeDecision />,
    document.getElementById('makeDecision')
)