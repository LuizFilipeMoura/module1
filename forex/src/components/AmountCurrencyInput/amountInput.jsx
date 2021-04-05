import React, {Component} from "react";
import CurrencyInput from 'react-currency-input-field';


export class AmountInput extends Component{
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                {/*External Library for currency input for React*/}
                <CurrencyInput
                    prefix={this.props.prefix}
                    id="input-example"
                    name="input-name"
                    placeholder="Please enter a number"
                    defaultValue={1000}
                    decimalsLimit={2}
                    onValueChange={(value, name) => {
                        console.log(value, name)
                    }}
                />
            </div>

        );
    }

}
