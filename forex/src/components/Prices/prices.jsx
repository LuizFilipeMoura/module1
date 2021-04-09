import React, {Component} from "react";

export class Prices extends Component{
    constructor(props) {//Default Values
        super(props);
        this.prefix = this.props.prefix? this.props.prefix:'$';
        this.otherPrefix = this.props.otherPrefix? this.props.otherPrefix:'£';
        this.currency = this.props.currency;
        this.sellingPrice = 1.0;
        this.buyingPrice = 1.0;
        this.rate = this.props.rate? this.props.rate: 1;
    }

    _changeOperationCurrency(operation){ //Sends the Operation and/or Currency for the parent component
        this.props.changeOperationCurrency(this.currency, operation, this.props.prefix);
    }

    render() {

        //Renders the card for the prices of the currencies

        return (
            <div className="card m-2 box-shadow">
            <div className="card-header">
                <h4 className="my-0 font-weight-normal">{this.currency}</h4>
            </div>

            <div className="card-body">

                {/*Buy Button*/}

                <h1 className="card-title pricing-card-title">

                    {/*Show to the user how much it costs to buy that currency*/}

                    {this.otherPrefix}1↦
                    {this.prefix}{(this.buyingPrice*this.rate).toFixed(3)}
                </h1>
                    <button className="btn btn-light" type="button"
                           onClick={() =>this._changeOperationCurrency('Buy')}>Buy</button>

                {/*Sell Button*/}
                <hr />

            <h1 className="card-title pricing-card-title">
                    {/*Show to the user the selling price of that currency*/}

                    {this.prefix}1↦
                    {this.otherPrefix}
                    {(this.sellingPrice/this.rate).toFixed(3)}
            </h1>
                    <button className="btn btn-light" type="button"
                           onClick={() => this._changeOperationCurrency('Sell')}>Sell</button>
            </div>
        </div>)
    }

}
