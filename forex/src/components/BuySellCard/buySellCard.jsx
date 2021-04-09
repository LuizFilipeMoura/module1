import React, {Component} from "react";
import AmountInput from "../AmountCurrencyInput";


export class BuySellCard extends Component{

    handleAmount(amount){
        this.props.onAmountSelect(amount);
    }

    render() {
        return (
            <div className="card w-25" >
                    <div className="card-body">
                        <h5 className="card-title">{this.props.currency}</h5>
                        <div className="row">
                            <h4>
                                {/*Currency Symbol*/}
                                {this.props.prefix}
                            </h4>
                            {/*The currency amount Input*/}
                            <AmountInput  onAmountSelect={this.handleAmount.bind(this)}/>
                        </div>
                        <button className="btn btn-success">{this.props.operation+'!'}</button>
                    </div>
            </div>

        );
    }


}
