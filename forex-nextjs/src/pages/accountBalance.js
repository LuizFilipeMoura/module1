import React, {useEffect, useState} from "react";
import {DATABASE_URL, DEPOSITS, PASTTRADES, WITHDRAWS} from "../shared/enviroment";
import {useAppContext} from "../shared/AppWrapper";
import axios from "axios";
import {useRouter} from "next/router";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import Input from "@material-ui/core/Input";
import MenuItem from "@material-ui/core/MenuItem";
import Checkbox from "@material-ui/core/Checkbox";
import ListItemText from "@material-ui/core/ListItemText";
import {useLabels} from "../shared/labels";
import {localeStringGlobal} from "../shared/globalFunctions";


export default function AccountBalance (){
    let context = useAppContext();
    let router = useRouter();
    let labels = useLabels().labels;

    let [operations, setOperations] = useState([]);
    let [trades, setTrades] = useState();
    let [filters, setFilters] = useState([]);
    let [deposits, setDeposits] = useState();
    let [withdraws, setWithdraws] = useState();
    let [filteredOperations, setFilteredOperations] = useState([]);
    let operationArray = [];
    const [once, setOnce] = React.useState(true);

    useEffect(() => {

        //List trades, withdraws and deposits
        if(context.client && once && !trades && !deposits && !withdraws){
            listTrades();
            listWithdraws();
            listDeposits();
            setOnce(false);
        }

        //Populates the operations
        if(operations.length === 0 && trades && withdraws && deposits &&
            (trades?.length !== 0 || deposits?.length !== 0 || withdraws?.length !== 0)){
            populateOperations();
        }

        if(!context.isLogged && !localStorage.getItem('isLogged')){
            router.push(router.locale+'/')
        }
    });

    function populateOperations() {
        for(let trade of trades){
            trade.operationType = 'TRADE';
            trade.currency = trade.from_currency + '→' + trade.to_currency;
            trade.amount = Number(trade.from_amount).toFixed(2) + '→' + Number(trade.to_amount).toFixed(2);
            trade.obs = trade.obs ? trade.obs: '';
            operationArray.push( trade);
        }
        for(let deposit of deposits){
            deposit.operationType = labels.depositLabel;
            deposit.obs = deposit.obs ? deposit.obs: '';
            operationArray.push( deposit);
        }
        for(let withdraw of withdraws){
            withdraw.operationType = labels.withdrawLabel;
            withdraw.obs = withdraw.obs ? withdraw.obs: '';
            operationArray.push(withdraw);
        }
        operationArray = operationArray.sort((a, b) => {
            const aDate = new Date(a.date);
            const bDate = new Date(b.date);
            return aDate - bDate;
        });
        setOperations(operationArray);
        setFilteredOperations(operationArray);
    }


    function listWithdraws(){//Lists the withdraws on the dataBase for that client

        axios.post(DATABASE_URL + WITHDRAWS, context.client)
            .then(response => {
                setWithdraws(response.data.rows.length === 0 ? [] : response.data.rows);
            })
            .catch(err => {
                console.log("oppps", err);
            });
    }

    function listDeposits(){//Lists the deposits on the dataBase for that client

        axios.post(DATABASE_URL + DEPOSITS, context.client)
            .then(response => {
                setDeposits(response.data.rows.length === 0 ? [] : response.data.rows);
            })
            .catch(err => {
                console.log("oppps", err);
            });
    }
    function listTrades(){//Lists the trades on the dataBase for that client

        axios.post(DATABASE_URL + PASTTRADES, context.client)
            .then(response => {
                setTrades( response.data.rows.length === 0 ? [] : response.data.rows );
            })
            .catch(err => {
                console.log("oppps", err);
            });
    }

    const handleChange = (event) => {
        //Filters the array of operations using the filters given

        let filteredArr = [];
        if(event.target.value.length !== 0){
            for(const operation of operations){
                for(const filter of event.target.value) {
                    if (filter === operation.operationType) {
                        filteredArr.push(operation);
                    }
                }
            }
            setFilteredOperations(filteredArr);
        } else{
            setFilteredOperations(operations)
        }

        setFilters(event.target.value);
    };

    const operationTypes = [
        labels.withdrawLabel,
        labels.depositLabel,
        labels.tradeLabel,
    ];

    return(
        <div>
            <div className="m-3">
                {/*Filter input*/}
               {labels.operationTypeLabel}
                <Select
                    id="demo-mutiple-checkbox"
                    multiple
                    value={filters}
                    style={{width: '10%', marginLeft: '2%'}}
                    onChange={handleChange}
                    input={<Input />}
                    renderValue={(selected) => selected.join(', ')}
                >
                    {operationTypes.map((operationType) => (
                        <MenuItem key={operationType} value={operationType} style={{backgroundColor: 'black'}}>
                            <Checkbox checked={filters.indexOf(operationType) > -1} />
                            <ListItemText primary={operationType} />
                        </MenuItem>
                    ))}
                </Select>
            </div>
            <div className="d-flex justify-content-md-center align-items-center">

                <div className="text-center align-center  w-75">
                    <h3>{labels.accountBalanceLabel}</h3>
                    <table className="table table-light">
                        <thead>
                        <tr>
                            <th scope="col">{labels.dataLabel}</th>
                            <th scope="col">{labels.operationLabel}</th>
                            <th scope="col">{labels.currencyLabel}</th>
                            <th scope="col">{labels.amountLabel}</th>
                            <th scope="col">Obs</th>
                        </tr>
                        </thead>
                        <tbody>

                        {/*Listing Method using the list that was retrieved from the database*/}

                        { filteredOperations?.map( (operation,index) =>

                            <tr key={index}>
                                <th scope="row">{ localeStringGlobal(operation) }
                                </th>
                                <td>
                                    {operation.operationType}
                                </td>
                                <td>
                                    {operation.currency}
                                </td>
                                <td>
                                    {operation.amount}
                                </td>
                                <td>

                                    {router.locale === 'en-US' ?  operation.obs : operation.obs?.toString()
                                        .replace('SENT', 'ENVIADO')
                                        .replace('BY', 'POR')
                                        .replace('TO', 'PARA')}

                                </td>
                            </tr>
                        )}
                        </tbody>
                    </table>

                </div>

            </div>
        </div>
    )
}
