import './App.css';
import React, {Component} from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from 'react-router-dom';
import { w3cwebsocket as W3CWebSocket } from "websocket";


import {DATABASE_API, WEBSOCKET} from "./shared/enviroment";
import Dashboard from "./components/Dashboard";
import History from "./components/History";
import Navbar from "./components/Navbar";
import WalletContext from "./context/wallet";
import axios from "axios";

const client = new W3CWebSocket(WEBSOCKET); //WebSocket Connection

export class App extends Component {

    constructor(props) {
        super(props);
        this.state = {};

    }

    componentDidMount() { //Handles the connection to the websocket
        client.onopen = () => {
            console.log('WebSocket Client Connected');
        };
        client.onmessage = (message) => {
            const dataFromServer = message.data;
            this.setState({rate: dataFromServer}); //Get the rate value from the websocket and refreshs the the current values
        };
        axios.get(DATABASE_API + '/wallet')// Gets the information of values of that wallet
            .then(response => {
                this.context.dollarAmount = response.data[0].dollarAmount;
                this.context.poundAmount = response.data[0].poundAmount;
                this.setState({});
            })
            .catch(err => {
                console.log("oppps", err);
            });
    }

    //Updates the value of the wallet and refreshs the view
    handlesTrasaction(wallet){
        if(wallet.poundAmount>0 && wallet.dollarAmount>0){
            axios.put(DATABASE_API + '/wallet', wallet)// Updates the wallets values
                .then(response => {
                    this.setState({});
                })
                .catch(err => {
                    console.log("oppps", err);
                });
            this.setState({});
        }

    }

    render() {
            return (
                <div>
                    <Router>
                        <WalletContext.Provider value={this.state.wallet}/>
                        <Navbar/>
                        <Switch>
                            <Route path="/history" component={History} />

                            <Route path="/" component={() =>
                                    <Dashboard rate={this.state.rate} onTransaction={this.handlesTrasaction.bind(this)}/>
                            }/>


                        </Switch>
                    </Router>
                </div>
            );
    }
}
App.contextType = WalletContext;

