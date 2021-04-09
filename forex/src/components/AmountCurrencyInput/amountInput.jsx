import React, {Component} from "react";
import CurrencyInput from 'react-currency-input-field';


export class AmountInput extends Component{

    handleAmount(amount){ // Handle the amount to the parent component
        this.props.onAmountSelect(amount);
    }

    render() {
        return (
            <div className="w-90">
                {/*External Library for currency input for React*/}
                <CurrencyInput
                    alt="Amount of currency you want to trade"
                    className="w-100"
                    prefix={this.props.prefix}
                    id="input-example"
                    name="input-name"
                    placeholder="Please enter a number"
                    defaultValue={0}
                    decimalsLimit={2}
                    onValueChange={(value, name) => {
                        this.handleAmount(value);
                    }}
                />
            </div>

        );
    }

}
