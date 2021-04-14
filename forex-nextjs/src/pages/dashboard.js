import React, {useEffect, useState} from 'react';
import clsx from 'clsx';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Button from '@material-ui/core/Button';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import HistoryIcon from '@material-ui/icons/History';
import MonetizationOnIcon from '@material-ui/icons/MonetizationOn';
import AccountBalanceIcon from '@material-ui/icons/AccountBalance';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';

import {useRouter } from "next/router";
import CardActions from "@material-ui/core/CardActions";
import Typography from "@material-ui/core/Typography";
import CardContent from "@material-ui/core/CardContent";
import CardMedia from "@material-ui/core/CardMedia";
import CardActionArea from "@material-ui/core/CardActionArea";
import Card from "@material-ui/core/Card";
import CurrencyTextField from '@unicef/material-ui-currency-textfield'

import {WEBSOCKET} from "../../../forex/src/shared/enviroment";
import { w3cwebsocket as W3CWebSocket } from "websocket";
import axios from "axios";
import {DATABASE_URL, PASTTRADES, WALLETS} from "../shared/enviroment";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";

const wsClient = new W3CWebSocket(WEBSOCKET); //WebSocket Connection



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
    const classes = useStyles();
    const currencies = [['GBP', '£', 'pound'], ['USD', '$', 'dollar'], ['EUR', '€', 'euro'], ['BRL', 'R$', 'real']];
    const [state, setState] = React.useState({
        left: false,
    });
    let [rate, setRate] = useState({});
    const [client, setClient] = useState(null);
    let [wallet, setWallet] = useState( {initial: true});

    let [buyingCurrency, setBuyingCurrency] = React.useState(currencies[0][0]);
    let [sellingCurrency, setSellingCurrency] = React.useState(currencies[1][0]);
    let [buyingAmount, setBuyingAmount] = React.useState(0);
    let [sellingAmount, setSellingAmount] = React.useState(0);

    //I18n translations
    let router = useRouter();

    let dashboardLabel = router.locale === 'en-US' ? 'Dashboard' : 'Painel';
    let buyButtonLabel = router.locale === 'en-US' ? 'Buy' : 'Comprar';
    let sellButtonLabel = router.locale === 'en-US' ? 'Sell' : 'Vender';
    let operationLabel = router.locale === 'en-US' ? ['Buying', 'Selling'] : ['Comprando', 'Vendendo'];
    let tradeButtonLabel = router.locale === 'en-US' ? 'TRADE!' : 'NEGOCIAR!';
    let equalsToLabel= router.locale === 'en-US' ? 'equals to' : 'é igual a';
    let profileLabel= router.locale === 'en-US' ? 'Profile' : 'Perfil';
    let bankInfoLabel= router.locale === 'en-US' ? 'Bank Info' : 'Informações bancárias';
    let depositLabel= router.locale === 'en-US' ? 'Deposit' : 'Depositar';
    let withdrawLabel= router.locale === 'en-US' ? 'Withdraw' : 'Sacar';
    let historyLabel= router.locale === 'en-US' ? 'History' : 'Histórico';



    useEffect(() => { //Stores the user in the localstorage
        console.log(router.locale);
        if(!client){
            setClient(JSON.parse(localStorage.getItem('client')));
        }else{
            handlesWebsocket();
            if(wallet.initial){
                retrievesWallet();
            }
        }
    });

    function retrievesWallet() {//Gets the values of the wallet for that client
        axios.post(DATABASE_URL + WALLETS, client).then( res => {
            setWallet(res.data.rows[0]);
            wallet = res.data.rows[0];
        })
    }

    function updatesWallet(givenTransaction){
        // let transaction = JSON.parse(JSON.stringify(givenTransaction))
        // console.log(transaction);
        givenTransaction.from_amount = Number(givenTransaction.from_amount.toFixed(2));
        givenTransaction.to_amount = Number(givenTransaction.to_amount.toFixed(2));

        console.log(givenTransaction);
        console.log(wallet);

        if(givenTransaction.from_currency === 'BRL'){
            wallet.realamount += givenTransaction.from_amount;
        }
        else if(givenTransaction.from_currency === 'USD'){
            wallet.dollaramount += givenTransaction.from_amount;
        }
        else if(givenTransaction.from_currency === 'GBP'){
            wallet.poundamount += givenTransaction.from_amount;
        }
        else if(givenTransaction.from_currency === 'EUR'){
            wallet.poundamount += givenTransaction.from_amount;
        }

        if(givenTransaction.to_currency === 'BRL'){
            wallet.realamount -= givenTransaction.to_amount;
        }
        else if(givenTransaction.to_currency === 'USD'){
            wallet.dollaramount -= givenTransaction.to_amount;
        }
        else if(givenTransaction.to_currency === 'GBP'){
            wallet.poundamount -= givenTransaction.to_amount;
        }
        else if(givenTransaction.to_currency === 'EUR'){
            wallet.euroamount -= givenTransaction.to_amount;
        }

        console.log(givenTransaction);
        console.log(wallet);

        axios.put(DATABASE_URL + WALLETS, wallet).then( res => {
            console.log(res.data);
            retrievesWallet();
        })
    }

    function handlesWebsocket(){//Connects and Takes the message from the websocket
        wsClient.onopen = () => {
            console.log('WebSocket Client Connected');
        };
        wsClient.onmessage = (message) => {
            const dataFromServer = JSON.parse(message.data);
            setRate(dataFromServer);//Get the rate value from the websocket and refreshs the the current values
            rate = dataFromServer;
        };
    }

    function handleOperation() {//Stores the operation if it meets the requirements

        let transaction = {
            from_currency: buyingCurrency,
            to_currency: sellingCurrency,
            from_amount: buyingAmount,
            to_amount: sellingAmount,
            client_id: client.id,
            date: new Date()
        };

        if(sellingCurrency === 'USD' && sellingAmount > wallet.dollaramount){// Rejects the transaction if the user cant afford
            rejectTransaction()
        } else if(sellingCurrency === 'BRL' && sellingAmount > wallet.realamount){
            rejectTransaction()
        }else if(sellingCurrency === 'EUR' && sellingAmount > wallet.euroamount){
            rejectTransaction()
        }else if(sellingCurrency === 'GBP' && sellingAmount > wallet.poundamount){
            rejectTransaction()
        } else{
            console.log('PROSSEGUIU');
            axios.post(DATABASE_URL + PASTTRADES, transaction).then( res => {
                updatesWallet(transaction);
            });
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
        console.log('REJEITOU')
    }

    const toggleDrawer = (anchor, open) => (event) => {//Toggles Side Drawer
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState({ ...state, [anchor]: open });
    };

    const list = (anchor) => ( // The right side drawer
            <>
                <div
                    className={clsx(classes.list, {
                        [classes.fullList]: anchor === 'top' || anchor === 'bottom',
                    })}
                    role="presentation"
                    onClick={toggleDrawer(anchor, false)}
                    onKeyDown={toggleDrawer(anchor, false)}
                >
                    <List>
                        {[profileLabel, bankInfoLabel, historyLabel, withdrawLabel, depositLabel].map((text, index) => (
                            <ListItem button key={text} onClick={()=> console.log(text)}>
                                <ListItemIcon>
                                    {index === 0 ? <AccountCircleIcon />
                                    : index === 1 ? <AccountBalanceIcon />
                                    : index === 2 ? <HistoryIcon/>
                                    : index === 3 ? <MonetizationOnIcon/>
                                    : index === 4 ? <AttachMoneyIcon/>
                                    : ''

                                    }
                                </ListItemIcon>
                                <ListItemText primary={text}  />
                            </ListItem>
                        ))}
                    </List>
                    <Divider />
                </div>
            </>
    );



    //The input for the values bellow the currencies card
    const buySellCard = () => (
        <div>
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
                            id="input-example"
                            name="input-name"
                            placeholder="Please enter a number"
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

    if(client){
        return (
            <div>
                {/*Opens Drawer*/}
                {/*Amount of each currency the user has in their wallet*/}
                <div className="m-2 row ">
                    {['right'].map((anchor) => (
                        <React.Fragment key={anchor} >
                            <Button onClick={toggleDrawer(anchor, true)}>{client?.name}</Button>
                            <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)} classes={{paper: classes.paper}} >
                                {list(anchor)}
                            </Drawer>
                        </React.Fragment>
                    ))}
                    {currencies.map((currency) => (
                        <div className="m-2">
                            <p className="h5" key={currency[0]}>
                                {/*Gets the symbol*/}
                                <small>{currency[1]}</small>
                                {/*Gets the value on the wallet*/}
                                {wallet[currency[2]+'amount']}
                            </p>
                        </div>
                    ))}
                </div>


                <div className="m-2 row">
                    <h1>{dashboardLabel}</h1>
                </div>



                {/*Currencies dashboard*/}
                <div className="h-100 d-flex justify-content-center align-items-center container">
                    {currencies.map((currency) => (
                        <Card className={classes.root} className="col-3" key={currency[0]}
                              style={{backgroundColor: 'white', borderRadius: '20px'}} onClick={()=>console.log('AAAAAAAAAAAAA')}>
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
                                <Button size="small" color="secondary">
                                    {buyButtonLabel}
                                </Button>
                                <Button size="small" color="secondary">
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
