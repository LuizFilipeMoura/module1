import React, {Component} from "react";
import {DATABASE_API} from "../../shared/enviroment";
import axios from "axios";


export class History extends Component{
    constructor(props) {
        super(props);
        this._list(); //Calls the listing method
        this.state = {
            trades: []
        };
    }

    _list(){//Lists the trades on the dataBase
        axios.get(DATABASE_API)
            .then(response => {
                this.setState({trades: response.data});
            })
            .catch(err => {
                console.log("oppps", err);
            });
    }


    render() {
        return (
            <div className="vh-100 App">
                <div className="d-flex justify-content-md-center align-items-center vh-50 App">
                    <table className="table table-light">
                        <thead>
                        <tr>
                            <th scope="col">#</th>
                            <th scope="col">Date</th>
                            <th scope="col">Currency</th>
                            <th scope="col">Operation</th>
                            <th scope="col">Amount</th>
                        </tr>
                        </thead>
                        <tbody>

                        {/*Listing Method using the list that was retrieved from the database*/}

                        { this.state.trades.map( (trade,index) =>

                            <tr key={index}>
                                <th scope="row">{index}</th>
                                <td>{(new Date(trade.date)).toLocaleDateString() + ' '+ (new Date(trade.date)).getHours() + ':' + (new Date(trade.date)).getUTCMinutes()}</td>
                                <td>{trade.currency}</td>
                                <td>{trade.operation}</td>
                                <td>{trade.amount}</td>
                            </tr>
                        )}
                        </tbody>
                    </table>

                </div>

                {/*Go back Button*/}
                <div className="row d-flex justify-content-md-center align-items-center vh-50 form-group ">
                    <a href="/" type="button" className="btn btn-success" >Go Back to Trade</a>
                </div>


            </div>

        );
    }

}
