import React, {useEffect, useState} from "react";
import {DATABASE_URL, PASTTRADES} from "../shared/enviroment";
import {useAppContext} from "../shared/AppWrapper";

import axios from "axios";
import {useRouter} from "next/router";

export default function History (){
    let context = useAppContext();
    let [trades, setTrades] = useState();

    let router = useRouter();

    let dataLabel = router.locale === 'en-US' ? 'Date' : 'Data';
    let buyingLabel = router.locale === 'en-US' ? 'Buying' : 'Comprando';
    let sellingLabel = router.locale === 'en-US' ? 'Selling' : 'Vendendo';


    useEffect(() => { //Stores the user in the localstorage
        if(!trades || trades.length ===0){
            listTrades();
        }
    });

    function listTrades(){//Lists the trades on the dataBase for that client

        axios.post(DATABASE_URL + PASTTRADES, context.client)
            .then(response => {
                setTrades(response.data.rows);
            })
            .catch(err => {
                console.log("oppps", err);
            });
    }
    return(
        <div className="d-flex justify-content-md-center align-items-center">
            <div >
                <table className="table table-light">
                    <thead>
                    <tr>
                        <th scope="col">#</th>
                        <th scope="col">{dataLabel}</th>
                        <th scope="col">{buyingLabel}</th>
                        <th scope="col">{sellingLabel}</th>
                        <th scope="col">Delete</th>
                    </tr>
                    </thead>
                    <tbody>

                    {/*Listing Method using the list that was retrieved from the database*/}

                    { trades?.map( (trade,index) =>

                        <tr key={index}>
                            <th scope="row">{index}</th>
                            <td>{(new Date(trade.date)).toLocaleDateString() + ' '+ (new Date(trade.date)).getHours() + ':' +
                            ((new Date(trade.date)).getUTCMinutes() <= 9? '0' + (new Date(trade.date)).getUTCMinutes(): (new Date(trade.date)).getUTCMinutes() ) }
                            </td>
                            <td>
                                <span className="text-muted">{trade.from_currency}</span>
                                <span style={{fontSize: '18px'}}>{trade.from_amount.toFixed(2)}</span>

                            </td>
                            <td>
                                <span className="text-muted">{trade.to_currency}</span>
                                <span style={{fontSize: '18px'}}>{trade.to_amount.toFixed(2)}</span>

                            </td>
                            <td>{trade.amount}</td>
                            <td>{trade.operation}</td>
                        </tr>
                    )}
                    </tbody>
                </table>

            </div>

        </div>
    )
}
