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
    let currencies = context.currencies;

    let [buyingCurrency, setBuyingCurrency] = React.useState(currencies[0][0]);
    let [sellingCurrency, setSellingCurrency] = React.useState(currencies[1][0]);
    let [buyingAmount, setBuyingAmount] = React.useState(0.00);
    let [sellingAmount, setSellingAmount] = React.useState(0.00);

    let [showAlert, setAlert] = React.useState('');

    //I18n translations
    let router = useRouter();

    let dashboardLabel = router.locale === 'en-US' ? 'Dashboard' : 'Painel';
    let buyButtonLabel = router.locale === 'en-US' ? 'Buy' : 'Comprar';
    let sellButtonLabel = router.locale === 'en-US' ? 'Sell' : 'Vender';
    let operationLabel = router.locale === 'en-US' ? ['Buying', 'Selling'] : ['Comprando', 'Vendendo'];
    let tradeButtonLabel = router.locale === 'en-US' ? 'TRADE!' : 'NEGOCIAR!';
    let equalsToLabel = router.locale === 'en-US' ? 'equals to' : 'é igual a';
    let successTransactionLabel = router.locale === 'en-US' ? '✓ Transaction Successful! Wallet and History updated'
        : '✓ Transação Bem-sucedida! Carteira e histórico atualizadas';
    let failTransactionLabel = router.locale === 'en-US' ? '✘ Error! Couldn\'t afford the operation' : '✘ Erro! Saldo insuficiente ';
    let placeholderLabel = router.locale === 'en-US' ? 'Please insert amount here' : 'Por favor informar o montante aqui';

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
    });


    function updatesWallet(givenTransaction){ // Updates the wallet values for each currency

        givenTransaction.from_amount = Number(givenTransaction.from_amount.toFixed(2));
        givenTransaction.to_amount = Number(givenTransaction.to_amount.toFixed(2));

        if(givenTransaction.from_currency === 'BRL'){
            context.wallet.realamount += givenTransaction.from_amount;
        }
        else if(givenTransaction.from_currency === 'USD'){
            context.wallet.dollaramount += givenTransaction.from_amount;
        }
        else if(givenTransaction.from_currency === 'GBP'){
            context.wallet.poundamount += givenTransaction.from_amount;
        }
        else if(givenTransaction.from_currency === 'EUR'){
            context.wallet.euroamount += givenTransaction.from_amount;
        }

        if(givenTransaction.to_currency === 'BRL'){
            context.wallet.realamount -= givenTransaction.to_amount;
        }
        else if(givenTransaction.to_currency === 'USD'){
            context.wallet.dollaramount -= givenTransaction.to_amount;
        }
        else if(givenTransaction.to_currency === 'GBP'){
            context.wallet.poundamount -= givenTransaction.to_amount;
        }
        else if(givenTransaction.to_currency === 'EUR'){
            context.wallet.euroamount -= givenTransaction.to_amount;
        }

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

        let transaction = {
            from_currency: buyingCurrency,
            to_currency: sellingCurrency,
            from_amount: buyingAmount,
            to_amount: sellingAmount,
            client_id: context.client.id,
            date: new Date()
        };

        if(sellingCurrency === 'USD' && sellingAmount > context.wallet.dollaramount){// Rejects the transaction if the user cant afford
            rejectTransaction()
        } else if(sellingCurrency === 'BRL' && sellingAmount > context.wallet.realamount){
            rejectTransaction()
        }else if(sellingCurrency === 'EUR' && sellingAmount > context.wallet.euroamount){
            rejectTransaction()
        }else if(sellingCurrency === 'GBP' && sellingAmount > context.wallet.poundamount){
            rejectTransaction()
        } else{
            sucessfulTransaction();
            axios.put(DATABASE_URL + PASTTRADES, transaction).then( res => {
                context.updateContext(context);
            });
            updatesWallet(transaction)
        }

    }


    function handleCurrencyInput(operation, value){ //Calculates the amount of each currency the user has after the input
        if(operation === 0){//If the operation is buying
            setBuyingAmount(value);
            if(buyingCurrency === 'USD'){
                if(sellingCurrency === 'EUR'){
                    setSellingAmount(value * rate.usdTOeur)
                }
                else if(sellingCurrency === 'BRL'){
                    setSellingAmount(value * rate.usdTObrl)
                }
                else if(sellingCurrency === 'GBP'){
                    setSellingAmount(value * rate.usdTOgbp)
                }
            } else {
                if(buyingCurrency === 'EUR'){
                    setSellingAmount(value * (1/rate.usdTOeur))
                }
                else if(buyingCurrency === 'BRL'){
                    setSellingAmount(value * (1/rate.usdTObrl))
                }
                else if(buyingCurrency === 'GBP'){
                    setSellingAmount(value * (1/rate.usdTOgbp))
                }
            }
        } else{ //If it is a selling amount input
            setSellingAmount(value);
            if(buyingCurrency === 'USD'){

                if(sellingCurrency === 'EUR'){
                    setBuyingAmount(value * (1/rate.usdTOeur))
                }
                else if(sellingCurrency === 'BRL'){
                    setBuyingAmount(value * (1/rate.usdTObrl))
                }
                else if(sellingCurrency === 'GBP'){
                    setBuyingAmount(value * (1/rate.usdTOgbp))
                }
            } else {
                if(buyingCurrency === 'EUR'){
                    setBuyingAmount(value * (rate.usdTOeur))
                }
                else if(buyingCurrency === 'BRL'){
                    setBuyingAmount(value * (rate.usdTObrl))
                }
                else if(buyingCurrency === 'GBP'){
                    setBuyingAmount(value * (rate.usdTOgbp))
                }
            }
        }
    }

    function rejectTransaction(){
        setAlert('fail');
        setTimeout(function(){ setAlert(''); }, 3000);
    }
    function sucessfulTransaction(){
        setAlert('success');
        setTimeout(function(){ setAlert(''); }, 3000);
    }

    //The input for the values bellow the currencies card
    const buySellCard = () => (
        <div>
            {/*    Alerts for the operation */}
            <div className="m-2 d-flex justify-content-center align-items-center ">
                {
                    showAlert === 'success'?
                        <div className="alert alert-success" role="alert">
                            {successTransactionLabel}
                        </div>
                        : showAlert === 'fail' ?
                        <div className="alert alert-danger" role="alert">
                            {failTransactionLabel}
                        </div>
                        : ''
                }
            </div>
            {[currencies[0], currencies[1]].map((currency, index) => (
                <>
                    <div className="m-2 d-flex justify-content-center align-items-center " key={index}>
                        <div >
                            <h3>{operationLabel[index]}</h3>
                        </div>

                        <div className="m-2">
                            <CurrencyTextField
                                value={index === 0? buyingAmount: sellingAmount}
                                variant="filled"
                                currencySymbol={currency[1]}
                                id={index === 0? 'buyingAmountInput': 'sellingAmountInput'}
                                name="input-name"
                                placeholder={placeholderLabel}
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
                                            <MenuItem value={currencyToSelect[0]} style={{backgroundColor: '#6d2177'}} key={index}>
                                                {currencyToSelect[2].toUpperCase()}
                                            </MenuItem>
                                            :''
                                    )}

                                </Select>
                                ://If it is a selling amount input
                                <Select
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
                                            <MenuItem value={currencyToSelect[0]} style={{backgroundColor: '#6d2177'}}>
                                                {currencyToSelect[2].toUpperCase()}
                                            </MenuItem>
                                            :''
                                    )}
                                </Select>
                        }

                    </div>
                </>
            ))}




            {/*  The bottom text where the calculations happen to give the value of the transaction to the client   */}
            <div className="m-2 d-flex justify-content-center align-items-center ">

                <h5>{buyingAmount.toFixed(2)} {buyingCurrency} {equalsToLabel}</h5>
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
                    {tradeButtonLabel}
                </Button>
            </div>

        </div>
    );

    if(context.isLogged){
        return (
            <div className="mb-5">
                {/*Title*/}

                <div className="m-2 row">
                    <h1>{dashboardLabel}</h1>
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
                                    {buyButtonLabel}
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
                                    {sellButtonLabel}
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
