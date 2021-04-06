import './App.css';
import React, {Component} from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from 'react-router-dom';
import { w3cwebsocket as W3CWebSocket } from "websocket";

import axios from 'axios';
import Dashboard from "./components/Dashboard";
import History from "./components/History";


// const client = new W3CWebSocket('ws://127.0.0.1:8000'); //WebSocket Connection

export class App extends Component {

    constructor(props) {
        super(props);
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

    render() {
            return (
                <Router>
                    <Switch>
                        <Route path="/history" component={History}/>
                        <Route path="/" component={Dashboard}/>
                    </Switch>
                </Router>
            );
    }
}

