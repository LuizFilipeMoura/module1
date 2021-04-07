import './App.css';
import React, {Component} from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
} from 'react-router-dom';

import Dashboard from "./components/Dashboard";
import History from "./components/History";
import Navbar from "./components/Navbar";



export class App extends Component {

    constructor(props) {
        super(props);

    }
    render() {
            return (
                <div>

                    <Router>
                        <Switch>
                            <Route path="/history" component={History}/>
                            <Route path="/" component={Dashboard}/>
                        </Switch>
                    </Router>
                </div>
            );
    }
}

