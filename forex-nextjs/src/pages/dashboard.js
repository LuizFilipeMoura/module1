import React, {useEffect, useState} from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import {useRouter } from "next/router";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CardActionArea from "@material-ui/core/CardActionArea";
import Card from "@material-ui/core/Card";
import CurrencyTextField from '@unicef/material-ui-currency-textfield'
import { w3cwebsocket as W3CWebSocket } from "websocket";
import axios from "axios";
import {DATABASE_URL, PASTTRADES, WALLETS, WEBSOCKET_URL} from "../shared/enviroment";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import { useAppContext} from "../shared/AppWrapper";
import {
    calculatesWithWallet,
    handleCurrencyInputGlobal,
    rejectTransactionGlobal,
    sucessfulTransactionGlobal,
    updatesWalletGlobal
} from "../shared/globalFunctions";
import {useLabels} from "../shared/labels";
import Alert from "../components/Alert";



const useStyles = makeStyles({//Define the style of the page
    list: {
        width: 250,
    },
    fullList: {
        width: 'auto',
    },
    paper: {
        background: "#932e2e"
    },
    root: {
        maxWidth: 345,
    },
    media: {
        height: 140,
    },

});

export default function Dashboard() {
    const [once, setOnce] = React.useState(true);

    const classes = useStyles();
    let [rate, setRate] = useState({});
    let context = useAppContext();
    let labels = useLabels().labels;
    let currencies = context.currencies;
    let router = useRouter();

    let [buyingCurrency, setBuyingCurrency] = React.useState(currencies[0][0]);
    let [sellingCurrency, setSellingCurrency] = React.useState(currencies[1][0]);
    let [buyingSymbol, setBuyingSymbol] = React.useState();
    let [sellingSymbol, setSellingSymbol] = React.useState();
    let [buyingAmount, setBuyingAmount] = React.useState(0.00);
    let [sellingAmount, setSellingAmount] = React.useState(0.00);
    let [showAlert, setAlert] = React.useState('');

    const wsClient = new W3CWebSocket(WEBSOCKET_URL); //WebSocket Connection

    useEffect(() => {
        if(once){
            handlesWebsocket();
            setOnce(false);
        }
        //If the user is not loggedin, send to the login page
        if(!context.isLogged && !localStorage.getItem('isLogged')){
            router.push(router.locale+'/')
        }

        //Adjust the symbol
        for(const currency of context.currencies){
            if(currency[0] === buyingCurrency){
                setBuyingSymbol(currency[1])
            }
            if(currency[0] === sellingCurrency){
                setSellingSymbol(currency[1])
            }
        }
    });


    function updatesWallet(givenTransaction){ // Updates the wallet values for each currency

        context.wallet = updatesWalletGlobal(givenTransaction, context.wallet);

        axios.put(DATABASE_URL + WALLETS, context.wallet).then( res => {
            context.updateContext(context);
        })
    }

    function handlesWebsocket(){//Connects and Takes the message from the websocket
        wsClient.onopen = () => {
            console.log('WebSocket Client Connected');
        };
        wsClient.onmessage = (message) => {
            const dataFromServer = JSON.parse(message.data);
            setRate(dataFromServer);//Get the rate value from the websocket and refreshs the the current values
        };
    }

    function handleOperation() {//Stores the operation if it meets the requirements

        calculatesWithWallet(sellingCurrency, sellingAmount, context.wallet, rejectTransaction, success);

    }

    function success() {

        let transaction = {
            from_currency: buyingCurrency,
            to_currency: sellingCurrency,
            from_amount: buyingAmount,
            to_amount: sellingAmount,
            client_id: context.client.id,
            date: new Date()
        };

        sucessfulTransaction();
        axios.put(DATABASE_URL + PASTTRADES, transaction).then( res => {
            context.updateContext(context);
        });
        updatesWallet(transaction)
    }

    function handleCurrencyInput(operation, value){ //Calculates the amount of each currency the user has after the input
        handleCurrencyInputGlobal(operation, value, setBuyingAmount, buyingCurrency, sellingCurrency, setSellingAmount, rate);
    }

    //Show messages
    function rejectTransaction(){
        rejectTransactionGlobal(setAlert);
    }
    function sucessfulTransaction(){
        sucessfulTransactionGlobal(setAlert);
    }

    //The input for the values bellow the currencies card
    const buySellCard = () => (
        <div>
            {/*    Alerts for the operation */}
            <Alert props={showAlert}/>

            {[currencies[0], currencies[1]].map((currency, index) => (
                <div key={index + 'divContainer'}>
                    <div className="m-2 d-flex justify-content-center align-items-center " key={index + 'divHeader'}>
                        <div key={index + 'div'}>
                            <h3 key={index + 'h3'}>{labels.operationLabel}</h3>
                        </div>

                        <div className="m-2" key={index + 'div3'}>
                            <CurrencyTextField
                                key={index + 'currencyInput'}
                                value={index === 0? buyingAmount: sellingAmount}
                                variant="filled"
                                currencySymbol={index === 0? buyingSymbol: sellingSymbol}
                                id={index === 0? 'buyingAmountInput': 'sellingAmountInput'}
                                name="input-name"
                                placeholder={labels.placeholderLabel}
                                defaultValue={0.00}
                                decimalsLimit={2}
                                decimalCharacter="."
                                digitGroupSeparator=""
                                onChange={(textValue, name) => {
                                    let value = Number(textValue.target.value);
                                    handleCurrencyInput(index, value);
                                }}
                            />

                        </div>
                        {
                            index===0 ? //If it is a buying amount input

                                <Select
                                    key={index + 'select'}
                                    value={buyingCurrency}
                                    variant="filled"
                                    onChange={(event)=>{
                                        if(event.target.value !== 'USD' && sellingCurrency !=='USD'){
                                            setSellingCurrency('USD');
                                        }
                                        setBuyingCurrency(event.target.value);
                                        setBuyingAmount(0);
                                        setSellingAmount(0);

                                    }}>
                                    {currencies.map((currencyToSelect, index) =>
                                        !(currencyToSelect[0] === sellingCurrency) ?
                                            <MenuItem value={currencyToSelect[0]} style={{backgroundColor: '#6d2177'}} key={index+'MenuItem'}>
                                                {currencyToSelect[2].toUpperCase()}
                                            </MenuItem>
                                            :''
                                    )}

                                </Select>
                                ://If it is a selling amount input
                                <Select
                                    key={index + 'select2'}
                                    value={sellingCurrency}
                                    variant="filled"
                                    onChange={(event)=>{
                                        if(event.target.value !== 'USD' && buyingCurrency !=='USD'){
                                            setBuyingCurrency('USD');
                                        }
                                        setSellingCurrency(event.target.value);
                                        setBuyingAmount(0);
                                        setSellingAmount(0);

                                    }}>
                                    {currencies.map((currencyToSelect, index) =>
                                        !(currencyToSelect[0] === buyingCurrency) ?
                                            <MenuItem value={currencyToSelect[0]} style={{backgroundColor: '#6d2177'}} key={index + 'MenuItem2'}>
                                                {currencyToSelect[2].toUpperCase()}
                                            </MenuItem>
                                            :''
                                    )}
                                </Select>
                        }

                    </div>
                </div>
            ))}

              {/*The bottom text where the calculations happen to give the value of the transaction to the client*/}
            <div className="m-2 d-flex justify-content-center align-items-center ">

                <h5>{buyingAmount.toFixed(2)} {buyingCurrency} {labels.equalsToLabel}</h5>
            </div>

            <div className="m-2 d-flex justify-content-center align-items-center ">
                <h2>{sellingAmount.toFixed(2)} {sellingCurrency} </h2>
            </div>
            <div className="m-2 d-flex justify-content-center align-items-center ">
                <Button
                    variant='contained'
                    color='primary'
                    onClick={() => {
                        handleOperation();
                    }}
                >
                    {labels.tradeButtonLabel}
                </Button>
            </div>

        </div>
    );

    if(context.isLogged){
        return (
            <div className="mb-5">
                {/*Title*/}

                <div className="m-2 row">
                    <h1>{labels.dashboardLabel}</h1>
                </div>

                {/*Currencies dashboard*/}
                <div className="h-100 d-flex justify-content-center align-items-center container">
                    {currencies.map((currency) => (
                        <Card className={classes.root} className="col-3" key={currency[0]}
                              style={{backgroundColor: 'white', borderRadius: '20px'}} >
                            <CardActionArea  >
                                <CardMedia
                                    className={classes.media}
                                    image={'/'+currency[0].toLowerCase()+'.jpg'}
                                    style={{ borderRadius: '20px'}}
                                    title="Contemplative Reptile"
                                />
                                <CardContent >
                                    <Typography gutterBottom variant="h5" component="h2" color="secondary">
                                        {currency[0]}<small>{currency[1]}</small>
                                    </Typography>
                                </CardContent>
                            </CardActionArea>
                            <CardActions>
                                <Button size="small" color="secondary" onClick={()=> {
                                    setBuyingAmount(0);
                                    setSellingAmount(0);

                                    if(sellingCurrency !== currency[0]){
                                        setBuyingCurrency(currency[0])
                                    }
                                    else {
                                        setSellingCurrency(buyingCurrency);
                                        setBuyingCurrency(currency[0]);
                                    }
                                    if(currency[0] !== 'USD' && sellingCurrency !== 'USD'){
                                        setSellingCurrency('USD');
                                    }
                                }}>
                                    {labels.buyButtonLabel}
                                </Button>
                                <Button size="small" color="secondary" onClick={()=> {
                                    setBuyingAmount(0);
                                    setSellingAmount(0);
                                    if(buyingCurrency !== currency[0]){
                                        setSellingCurrency(currency[0])
                                    }
                                    else if ( currency[0] !== 'USD'){
                                        setBuyingCurrency(buyingCurrency);
                                        setSellingCurrency(currency[0]);
                                    } else {
                                        setBuyingCurrency(sellingCurrency);
                                        setSellingCurrency('USD');
                                    }
                                    if(currency[0] !== 'USD' && buyingCurrency !== 'USD'){
                                        setBuyingCurrency('USD');
                                    }
                                }}>
                                    {labels.sellButtonLabel}
                                </Button>
                            </CardActions>
                        </Card>
                    ))}

                </div>
                {buySellCard(currencies[0], currencies[1])}
            </div>

        );
    }
    else{
        return(<div></div>)
    }

}
