import React, {Component} from "react";

import axios from "axios";
import {DATABASE_API, WEBSOCKET} from "../../shared/enviroment";
import Prices from "../Prices";
import BuySellCard from "../BuySellCard";

import {Modal} from "./modal";

import { w3cwebsocket as W3CWebSocket } from "websocket";
import Navbar from "../Navbar";

const client = new W3CWebSocket(WEBSOCKET); //WebSocket Connection


export class Dashboard extends Component{

    constructor(props) {
        super(props);
        this.operation = 'Buy'; //Default Values
        this.currency = 'USD';
        this.prefix = '$';
        this.rate = 1;
        this.amount = 0;
        this.dollarAmount = 100;
        this.poundAmount = 100;

        this.state = {//Sets the first state for the aplication
            operation: this.operation,
            currency: this.currency,
            prefix: this.prefix,
            dollarAmount: this.dollarAmount,
            poundAmount: this.poundAmount,
        };
    }

    componentDidMount() { //Handles the connection to the websocket

        client.onopen = () => {
            console.log('WebSocket Client Connected');
        };
        client.onmessage = (message) => {
            const dataFromServer = message.data;
            this.setState({rate: 0});
            this.setState({rate: dataFromServer}); //Get the rate value from the websocket and refreshs the the current values
        };
    }

    async _makeTransaction(transaction) { //Submits the transaction to the MongoDB storage
        await axios.post(DATABASE_API, transaction);
        console.log(transaction);
    }

    handleTransaction(event){//Handles the transaction (buying or selling)
        event.preventDefault();

        let transaction = {//Stores the Current Transaction
            currency: this.state.currency,
            amount: Number(this.amount),
            operation: this.state.operation,
            date: new Date(),
        };

        let operationRate = this.state.rate;

        if(transaction.currency === 'GBP'){//Calculate and store the transaction rate
            operationRate = (1/this.state.rate)
        }
        let state = this.state;

        if(transaction.operation === 'Sell' && transaction.currency === 'USD') { //Handles all the money trading, for each one of the four operations
            state.dollarAmount -= transaction.amount;
            state.poundAmount += transaction.amount * operationRate;
        } else if (transaction.operation === 'Sell' && transaction.currency === 'GBP') {
            state.dollarAmount += transaction.amount  * operationRate;
            state.poundAmount -= transaction.amount;
        } else if (transaction.operation === 'Buy' && transaction.currency === 'GBP') {
            state.dollarAmount -= transaction.amount * operationRate;
            state.poundAmount += transaction.amount;
        } else if (transaction.operation === 'Buy' && transaction.currency === 'USD') {
            state.dollarAmount += transaction.amount;
            state.poundAmount -= transaction.amount * operationRate;
        }
        if(this.amount<=0 || state.dollarAmount<=0 || state.poundAmount<=0 ){//If the transaction cannot happen
            this.refuseTransation();
            return;
        } else { // If the transaction is ok, stores the transaction in the database and refreshs the amount in the navbar
            this.setState(state);
            //     this._makeTransaction(transaction)
        }

    }

    refuseTransation() {

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
        if(this.state.rate !== 0)//Maintain the value always true to the websocket
        {
            return (
            <span>
                <Navbar
                    dollarAmount ={this.state.dollarAmount}
                    poundAmount ={this.state.poundAmount}
                />

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

                    {/*Modal for to send info to the users*/}
                    <Modal>
                    </Modal>

                </div>
        </span>
            );
        }

        return(<div></div>)//Shows nothing, just for to the refreshing function

    }


}
