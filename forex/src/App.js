import './App.css';
import React, {Component} from "react";

import { w3cwebsocket as W3CWebSocket } from "websocket";

import Prices from "./components/Prices";
import BuySellCard from "./components/BuySellCard";
import axios from 'axios';

// const client = new W3CWebSocket('ws://127.0.0.1:8000'); //WebSocket Connection

export class App extends Component {


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

    componentDidMount() {
            axios.get("http://api.currencylayer.com/live?access_key=b1b6ccf70a7b18329dda7bd8f88b225f&currencies=USD,GBP&format=1")
            .then(response => {
                this.setState({ rate: response.data.quotes.USDGBP });
                console.log(this.state);
            })
            .catch(err => {
                console.log("oppps", err);
            });
    }

    constructor(props) {
        super(props);
        this.operation = 'Buy'; //Default Values
        this.currency = 'USD';
        this.prefix = '$';
        this.rate = 4;

        this.state = {
            operation: this.operation,
            currency: this.currency,
            prefix: this.prefix
        };
    }

    _makeTransaction(event){
        event.preventDefault();
    }

    changeOperationCurrency(currency, operation, prefix){ //Changes the Operation and/or Currency in the Card
        this.state = {
            rate: 4,
            operation: operation,
            currency: currency,
            prefix: prefix
        };
        this.setState(this.state);
        console.log(this.state);
    }

    render() {
        return (
            <form onSubmit={this._makeTransaction.bind(this)}>
                <div className="d-flex justify-content-md-center align-items-center vh-100 App form-group">
                        <Prices //USD Price Table
                            rate={1/this.state.rate}
                            changeOperationCurrency={this.changeOperationCurrency.bind(this)}
                            currency={'USD'}
                            prefix={'$'}
                            otherPrefix={'£'}/>

                        <BuySellCard //Buy or Selling Card, where the trade happens
                            operation={this.state.operation}
                            currency={this.state.currency}
                            prefix={this.state.prefix}/>

                        <Prices //GBP Price Table
                            rate={this.state.rate}
                            changeOperationCurrency={this.changeOperationCurrency.bind(this)}
                            currency={'GBP'}
                            prefix={'£'}
                            otherPrefix={'$'}/>


                </div>
            </form>

        );
    }
}

