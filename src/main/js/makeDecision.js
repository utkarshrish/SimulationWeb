const React = require('react');
const ReactDOM = require('react-dom');

class MakeDecision extends React.Component {

    constructor(props){
        super(props);
    }

    render() {
        return (
            <div>
                <form action="" id="makeDecisionForm">
                    <table>
                        <tr>
                            <td>
                                <label>Units to Produce in 2020
                                 <br/>
                                <input type="text" name="unitToProduce" placeholder="milloins"/>
                                <span> units</span>
                                </label>
                                <p>Click here to fill in the previous year's value</p>
                            </td>
                            <td>
                                <label>Channel Price in 2020
                                   <br/>
                                    <input type="text" name="channelPrice" placeholder="dollars"/>
                                    <span> per 100 loads </span>
                                </label>
                                <p>Click here to fill in the previous year's value</p>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>Formulation in 2020</p>
                                <label>
                                    <input type="radio" name="formation" value="pods"/>Pods
                                </label>
                                <label>
                                    <input type="radio" name="formation" value="liquid"/>Liquid
                                </label>
                                <label>
                                    <input type="radio" name="formation" value="powder"/>Powder
                                </label>
                            </td>
                            <td>
                                <p>Product Features and Positioning in 2020</p>
                                <label>
                                    <input type="radio" name="productFeaturePositioning" value="odorElimination"/>Odor Elimination
                                </label>
                                <label>
                                    <input type="radio" name="productFeaturePositioning" value="coldWater"/>Cold Water
                                </label>
                                <label>
                                    <input type="radio" name="productFeaturePositioning" value="scent"/>Scent
                                </label>
                                <label>
                                    <input type="radio" name="productFeaturePositioning" value="softness"/>Softness
                                </label>
                            </td>
                        </tr>
                    </table>
                    <table>
                        <tr>
                            <td>
                                <p>Trade Channel Spend in 2020</p>
                                <table>
                                    <tr>
                                        <td>
                                            <label>
                                                Convenience
                                            </label>
                                        </td>
                                        <td>
                                            <label>
                                                Club
                                            </label>
                                        </td>
                                        <td>
                                            <label>
                                                Grocery
                                            </label>
                                        </td>
                                        <td>
                                            <label>
                                                Mass
                                            </label>
                                        </td>
                                        <td>
                                            <label>
                                                Total
                                            </label>
                                        </td>
                                        <td>
                                            <label>
                                                Total Trade Channel Budget $15.0M
                                            </label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label>
                                                <input type="text" name="convenience" placeholder="0.0%"/>
                                            </label>
                                        </td>
                                        <td>
                                            <label>
                                                <input type="text" name="convenience" placeholder="0.0%"/>
                                            </label>
                                        </td>
                                        <td>
                                            <label>
                                                <input type="text" name="convenience" placeholder="0.0%"/>
                                            </label>
                                        </td>
                                        <td>
                                            <label>
                                                <input type="text" name="convenience" placeholder="0.0%"/>
                                            </label>
                                        </td>
                                        <td>
                                            <label>
                                                Total%
                                            </label>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>Media Spend in 2020</p>
                                <table>
                                    <tr>
                                        <td>
                                            <label>
                                                Print
                                            </label>
                                        </td>
                                        <td>
                                            <label>
                                                TV
                                            </label>
                                        </td>
                                        <td>
                                            <label>
                                                Radio
                                            </label>
                                        </td>
                                        <td>
                                            <label>
                                                Digital Ads
                                            </label>
                                        </td>
                                        <td>
                                            <label>
                                                Total
                                            </label>
                                        </td>
                                        <td>
                                            <label>
                                                Total Media Budget $6.10M
                                            </label>
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>
                                            <label>
                                                <input type="text" name="convenience" placeholder="0.0%"/>
                                            </label>
                                        </td>
                                        <td>
                                            <label>
                                                <input type="text" name="convenience" placeholder="0.0%"/>
                                            </label>
                                        </td>
                                        <td>
                                            <label>
                                                <input type="text" name="convenience" placeholder="0.0%"/>
                                            </label>
                                        </td>
                                        <td>
                                            <label>
                                                <input type="text" name="convenience" placeholder="0.0%"/>
                                            </label>
                                        </td>
                                        <td>
                                            <label>
                                                Total%
                                            </label>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                        <tr>
                            <td>
                                <p>Target Market Segments for Decision</p>
                                <table>
                                    <tr>
                                        <td>
                                            <p>Income</p>
                                            <ul>
                                                <li>
                                                    <label>
                                                        <input type="checkbox"/>All Incomes
                                                    </label>
                                                </li>
                                                <li>
                                                    <label>
                                                        <input type="checkbox"/>No Income Focus
                                                    </label>
                                                </li>
                                                <li>
                                                    <label>
                                                        <input type="checkbox"/>Under $20,000
                                                    </label>
                                                </li>
                                                <li>
                                                    <label>
                                                        <input type="checkbox"/>$20,000 - $39,999
                                                    </label>
                                                </li>
                                                <li>
                                                    <label>
                                                        <input type="checkbox"/>$40,000 - $59,999
                                                    </label>
                                                </li>
                                                <li>
                                                    <label>
                                                        <input type="checkbox"/>$60,000 and over
                                                    </label>
                                                </li>
                                            </ul>
                                        </td>
                                        <td>
                                            <p>Ethinicity</p>
                                            <ul>
                                                <li>
                                                    <label>
                                                        <input type="checkbox"/>All Ethinicities
                                                    </label>
                                                </li>
                                                <li>
                                                    <label>
                                                        <input type="checkbox"/>No Ethinicity
                                                    </label>
                                                </li>
                                                <li>
                                                    <label>
                                                        <input type="checkbox"/>Asian
                                                    </label>
                                                </li>
                                                <li>
                                                    <label>
                                                        <input type="checkbox"/>Black
                                                    </label>
                                                </li>
                                                <li>
                                                    <label>
                                                        <input type="checkbox"/>Hispanic
                                                    </label>
                                                </li>
                                                <li>
                                                    <label>
                                                        <input type="checkbox"/>White
                                                    </label>
                                                </li>
                                                <li>
                                                    <label>
                                                        <input type="checkbox"/>Other
                                                    </label>
                                                </li>
                                            </ul>
                                        </td>
                                        <td>
                                            <p>Household Size</p>
                                            <ul>
                                                <li>
                                                    <label>
                                                        <input type="checkbox"/>All Household Sizes
                                                    </label>
                                                </li>
                                                <li>
                                                    <label>
                                                        <input type="checkbox"/>No Household Focus
                                                    </label>
                                                </li>
                                                <li>
                                                    <label>
                                                        <input type="checkbox"/>1
                                                    </label>
                                                </li>
                                                <li>
                                                    <label>
                                                        <input type="checkbox"/>2
                                                    </label>
                                                </li>
                                                <li>
                                                    <label>
                                                        <input type="checkbox"/>3
                                                    </label>
                                                </li>
                                                <li>
                                                    <label>
                                                        <input type="checkbox"/>4
                                                    </label>
                                                </li>
                                                <li>
                                                    <label>
                                                        <input type="checkbox"/>5+
                                                    </label>
                                                </li>
                                            </ul>
                                        </td>
                                        <td>
                                            <p>Region</p>
                                            <ul>
                                                <li>
                                                    <label>
                                                        <input type="checkbox"/>All Regions
                                                    </label>
                                                </li>
                                                <li>
                                                    <label>
                                                        <input type="checkbox"/>No Regional Focus
                                                    </label>
                                                </li>
                                                <li>
                                                    <label>
                                                        <input type="checkbox"/>Northeast
                                                    </label>
                                                </li>
                                                <li>
                                                    <label>
                                                        <input type="checkbox"/>Southeast
                                                    </label>
                                                </li>
                                                <li>
                                                    <label>
                                                        <input type="checkbox"/>central
                                                    </label>
                                                </li>
                                                <li>
                                                    <label>
                                                        <input type="checkbox"/>west
                                                    </label>
                                                </li>
                                            </ul>
                                        </td>
                                        <td>
                                            <p>Age</p>
                                            <ul>
                                                <li>
                                                    <label>
                                                        <input type="checkbox"/>All Ages
                                                    </label>
                                                </li>
                                                <li>
                                                    <label>
                                                        <input type="checkbox"/>No Age Focus
                                                    </label>
                                                </li>
                                                <li>
                                                    <label>
                                                        <input type="checkbox"/>Under 35
                                                    </label>
                                                </li>
                                                <li>
                                                    <label>
                                                        <input type="checkbox"/>35 - 44
                                                    </label>
                                                </li>
                                                <li>
                                                    <label>
                                                        <input type="checkbox"/>45 - 54
                                                    </label>
                                                </li>
                                                <li>
                                                    <label>
                                                        <input type="checkbox"/>55 and over
                                                    </label>
                                                </li>
                                            </ul>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>

                </form>
                <label>
                    <button type="submit" form="makeDecisionForm">Submit Decision</button>
                </label>
            </div>
        );
    }
}

ReactDOM.render(
    <MakeDecision />,
    document.getElementById('makeDecision')
)