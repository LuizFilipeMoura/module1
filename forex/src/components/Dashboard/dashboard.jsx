import React, {Component} from "react";

import axios from "axios";
import {DATABASE_API} from "../../shared/enviroment";
import {Prices} from "../Prices/prices";
import {BuySellCard} from "../BuySellCard/buysSellCard";


export class Dashboard extends Component{
    constructor(props) {
        super(props);
        this.operation = 'Buy'; //Default Values
        this.currency = 'USD';
        this.prefix = '$';
        this.rate = 1;
        this.amount = 0;

        this.state = {
            operation: this.operation,
            currency: this.currency,
            prefix: this.prefix
        };
    }


    // componentDidMount() {  //Creates and Handles the communication between WebSocket Client(this) and Server
    //     client.onopen = () => {
    //         console.log('WebSocket Client Connected');
    //     };
    //     client.onmessage = (message) => {
    //         const dataFromServer = JSON.parse(message.data);
    //         console.log('got reply! ', dataFromServer);
    //         if (dataFromServer.type === "message") {
    //             this.setState((state) =>
    //                 ({
    //                     messages: [...state.messages,
    //                         {
    //                             msg: dataFromServer.msg,
    //                             user: dataFromServer.user
    //                         }]
    //                 })
    //             );
    //         }
    //     };
    // }

    componentDidMount(){ //Get the conversion rate from the external API
        // axios.get(TRADE_API)
        //     .then(response => {
        this.setState({ rate: 0.8 });
        //         console.log(this.state.rate);
        //     })
        //     .catch(err => {
        //         console.log("oppps", err);
        //     });
    }

    async _makeTransaction() { //Submits the transaction to the MongoDB storage

        let transaction = {
            currency: this.state.currency,
            amount: this.amount,
            operation: this.state.operation,
            date: new Date(),
        };

        await axios.post(DATABASE_API, transaction);
        console.log(transaction);
    }

    handleTransaction(event){
        event.preventDefault();
        if(this.amount>0){
            this._makeTransaction()
        }

    }

    handleAmount(amount){ //Handle the amount that came from the child component
        this.amount = amount;
    }

    changeOperationCurrency(currency, operation, prefix){ //Changes the Operation and/or Currency in the Card
        this.state = {
            operation: operation,
            currency: currency,
            prefix: prefix
        };
        this.setState(this.state);
    }

    render() {
        if(this.state.rate)//If the external API has been requested, shows the application dashboard
        {
            return (
                <div className="vh-100 App">
                    <form onSubmit={this.handleTransaction.bind(this)}>
                        <div className="d-flex justify-content-md-center align-items-center vh-50 form-group row">


                            <Prices //USD Price Table
                                rate={1/this.state.rate}
                                changeOperationCurrency={this.changeOperationCurrency.bind(this)}
                                currency={'USD'}
                                prefix={'$'}
                                otherPrefix={'£'}/>

                            <BuySellCard //Buy or Selling Card, where the trade happens
                                operation={this.state.operation}
                                currency={this.state.currency}
                                prefix={this.state.prefix}
                                onAmountSelect={this.handleAmount.bind(this)}
                            />

                            <Prices //GBP Price Table
                                rate={this.state.rate}
                                changeOperationCurrency={this.changeOperationCurrency.bind(this)}
                                currency={'GBP'}
                                prefix={'£'}
                                otherPrefix={'$'}/>

                        </div>

                    </form>

                    <div className="row d-flex justify-content-md-center align-items-center vh-50 form-group ">
                        <a href="/history" type="button" className="btn btn-secondary" >Trading History</a>
                    </div>
                </div>


            );
        }

        return(<div></div>)//If not, shows nothing

    }

}
