const React = require('react');
const ReactDOM = require('react-dom');
const client = require('./client');
const Table = require('react-bootstrap/lib/Table');
const GraphNavigation = require('./modules/graphNavigation');

class DecisionHistory extends React.Component{
    constructor(props){
        super(props);
        this.state = {
            year: document.getElementById('user').innerText.trim().split("_")[1]-2019,
            user: document.getElementById('user').innerText.trim().split("_")[0],
            graphInputs: [],
            "styles": {
                "pods": "Pods",
                "liquid": "Liquid",
                "powder": "Powder"
            },
            "productPlacements": {
                "odorElimination": "Odor Elimination",
                "coldWater": "Cold Water",
                "scent": "Scent",
                "softness": "Softness"
            }
        };
    }

    componentDidMount() {
        client({method: 'GET', path: '/api/graphInputs/'+ this.state.user}).done(response => {
            this.setState({graphInputs: JSON.parse(response.entity.userInput)});
        });


    }

    render() {
        if(this.state.graphInputs.length>0) {
            let styles = [];
            let productPlacements = [];
            let userInputs = this.state.graphInputs;
            for (let year = 0; year <= this.state.year; year++) {
                {Object.keys(userInputs[year]["dataPoint"]["style"]).map((style) =>{
                    if (userInputs[year]["dataPoint"]["style"][style] > 0) {
                        styles.push(this.state.styles[style]);
                    }}
                )}
                {Object.keys(userInputs[year]["dataPoint"]["productPlacement"]).map((style) =>{
                    if (userInputs[year]["dataPoint"]["productPlacement"][style] > 0) {
                        productPlacements.push(this.state.productPlacements[style]);
                    }}
                )}
            }
            return (
                <div className="container">
                    <GraphNavigation title="Analytics Simulation| Decision History" year={this.state.year+2019} capYear={2022} activeKey={5}/>
                    <div className="row">
                        <div className="col-xs-7">
                            <Table>
                                <thead>
                                    <tr className="l1 number">
                                        <td></td>
                                        <td>2019</td>
                                        <td>2020</td>
                                        <td>2021</td>
                                        <td>2022</td>
                                    </tr>
                                </thead>
                                <tbody>
                                <tr className="l2 number">
                                    <td>Units to Produce (units)</td>
                                    {userInputs.map((userInput) =>
                                        <td>
                                            {(userInput["productionUnit"]/1000000).toFixed(2)+ "M"}
                                        </td>
                                    )}
                                </tr>
                                <tr className="l2 number">
                                    <td>Channel Price (per 100 loads)</td>
                                    {userInputs.map((userInput) =>
                                        <td>
                                            {"$" + userInput["unitPrice"].toFixed(2)}
                                        </td>
                                    )}
                                </tr>
                                <tr className="l2 number">
                                    <td>Formulation</td>
                                    {styles.map((style) =>
                                        <td>
                                            {style}
                                        </td>
                                    )}
                                </tr>
                                <tr className="l2 number">
                                    <td>Product Features and Positioning</td>
                                    {productPlacements.map((style) =>
                                        <td>
                                            {style}
                                        </td>
                                    )}
                                </tr>
                                <tr className="l2 number">
                                    <td>Trade Channel Spend</td>
                                </tr>
                                <tr className="l3 number">
                                    <td>Convenience</td>
                                    {userInputs.map((userInput) =>
                                        <td>
                                            {"$" + (userInput["dataPoint"]["distribution"]["convenience"]
                                            * 0.1 * (userInput["productionUnit"]/1000000) * userInput["unitPrice"]).toFixed(2) + "M"}
                                        </td>
                                    )}
                                </tr>
                                <tr className="l3 number">
                                    <td>Club</td>
                                    {userInputs.map((userInput) =>
                                        <td>
                                            {"$" + (userInput["dataPoint"]["distribution"]["club"]
                                            * 0.1 * (userInput["productionUnit"]/1000000) * userInput["unitPrice"]).toFixed(2) + "M"}
                                        </td>
                                    )}
                                </tr>
                                <tr className="l3 number">
                                    <td>Grocery</td>
                                    {userInputs.map((userInput) =>
                                        <td>
                                            {"$" + (userInput["dataPoint"]["distribution"]["grocery"]
                                            * 0.1 * (userInput["productionUnit"]/1000000) * userInput["unitPrice"]).toFixed(2) + "M"}
                                        </td>
                                    )}
                                </tr>
                                <tr className="l3 number">
                                    <td>Mass</td>
                                    {userInputs.map((userInput) =>
                                        <td>
                                            {"$" + (userInput["dataPoint"]["distribution"]["mass"]
                                            * 0.1 * (userInput["productionUnit"]/1000000) * userInput["unitPrice"]).toFixed(2) + "M"}
                                        </td>
                                    )}
                                </tr>
                                <tr className="l2 number total">
                                    <td>Total Trade Channel Spend</td>
                                    {userInputs.map((userInput) =>
                                        <td>
                                            {"$" + (0.1 * (userInput["productionUnit"]/1000000) * userInput["unitPrice"]).toFixed(2) + "M"}
                                        </td>
                                    )}
                                </tr>
                                <tr className="l2 number">
                                    <td>Media Spend</td>
                                </tr>
                                <tr className="l3 number">
                                    <td>Print</td>
                                    {userInputs.map((userInput) =>
                                        <td>
                                            {"$" + (userInput["dataPoint"]["media"]["print"]
                                            * 0.1 * (userInput["productionUnit"]/1000000) * userInput["unitPrice"]).toFixed(2) + "M"}
                                        </td>
                                    )}
                                </tr>
                                <tr className="l3 number">
                                    <td>TV</td>
                                    {userInputs.map((userInput) =>
                                        <td>
                                            {"$" + (userInput["dataPoint"]["media"]["tv"]
                                            * 0.1 * (userInput["productionUnit"]/1000000) * userInput["unitPrice"]).toFixed(2) + "M"}
                                        </td>
                                    )}
                                </tr>
                                <tr className="l3 number">
                                    <td>Radio</td>
                                    {userInputs.map((userInput) =>
                                        <td>
                                            {"$" + (userInput["dataPoint"]["media"]["radio"]
                                            * 0.1 * (userInput["productionUnit"]/1000000) * userInput["unitPrice"]).toFixed(2) + "M"}
                                        </td>
                                    )}
                                </tr>
                                <tr className="l3 number">
                                    <td>Digital Ads</td>
                                    {userInputs.map((userInput) =>
                                        <td>
                                            {"$" + (userInput["dataPoint"]["media"]["digitalAds"]
                                            * 0.1 * (userInput["productionUnit"]/1000000) * userInput["unitPrice"]).toFixed(2) + "M"}
                                        </td>
                                    )}
                                </tr>
                                <tr className="l2 number total">
                                    <td>Total Media Spend</td>
                                    {userInputs.map((userInput) =>
                                        <td>
                                            {"$" + (0.1 * (userInput["productionUnit"]/1000000) * userInput["unitPrice"]).toFixed(2) + "M"}
                                        </td>
                                    )}
                                </tr>
                                </tbody>
                            </Table>
                        </div>
                    </div>
                </div>
            )
        } else {
            return ( <p>A</p> )
        }
    }
}

ReactDOM.render(
    <DecisionHistory />,
    document.getElementById('decisionHistory')
)