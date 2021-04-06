import React, {Component} from "react";
import CurrencyInput from 'react-currency-input-field';


export class AmountInput extends Component{
    constructor(props) {
        super(props);
    }

    handleAmount(amount){ // Handle the amount to the parent component
        this.props.onAmountSelect(amount);
    }

    render() {
        return (
            <div>
                {/*External Library for currency input for React*/}
                <CurrencyInput
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
