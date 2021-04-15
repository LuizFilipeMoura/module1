
import React, {useEffect} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import axios from "axios";
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {useRouter} from "next/router";
import {CLIENTS, DATABASE_URL, DEPOSITS, PASTTRADES, WITHDRAWS} from "../shared/enviroment";
import {useAppContext} from "../shared/AppWrapper";
import Autocomplete from '@material-ui/lab/Autocomplete';
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";


const {useState} = require("react");


const useStyles = makeStyles((theme) => ({
    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(1),
    },
    submit: {
        margin: theme.spacing(3, 0, 2),
    },
    option: {
        color: 'black',
        // Hover with light-grey
        '&[data-focus="true"]': {
            backgroundColor: '#F8F8F8',
            borderColor: 'transparent',
        },
        // Selected has dark-grey
        '&[aria-selected="true"]': {
            borderColor: 'transparent',
        },
    },
}));

export default function SendMoney() {
    let context = useAppContext();

    const classes = useStyles();

    let router = useRouter();

    let sendMoneyLabel = router.locale === 'en-US' ? 'Save Money' : 'Enviar dinheiro';

    let sendLabel = router.locale === 'en-US' ? 'Send!' : 'Enviar';
    let currencyLabel = router.locale === 'en-US' ? 'Currency' : 'Moeda';
    let amountLabel = router.locale === 'en-US' ? 'Amount' : 'Montante';
    let clientReceiverLabel = router.locale === 'en-US' ? 'Receiver\'s name' : 'Nome do Recebedor';


    let [clients, setClients] = useState('');
    let [clientReceiver, setClientReceiver] = useState();
    let [currency, setCurrency] = useState('');
    let [amount, setAmount] = useState(0);

    useEffect(() => { //Stores the user in the localstorage
        if (clients === ''){
            listClients();
        }
        if(!context.isLogged && !localStorage.getItem('isLogged')){
            router.push(router.locale+'/')
        }
    });


    function listClients(){//Lists the trades on the dataBase for that client

        axios.get(DATABASE_URL + CLIENTS)
            .then(response => {
                setClients(response.data);
                console.log(response);
            })
            .catch(err => {
                console.log("oppps", err);
            });
    }

    function rejectTransaction(){
        setAlert('fail');
        setTimeout(function(){ setAlert(''); }, 3000);
    }
    function sucessfulTransaction(){
        setAlert('success');
        setTimeout(function(){ setAlert(''); }, 3000);
    }

    function handleDeposit(){
        let request = {id: clientReceiver.id, currency, amount, status: 'DONE'};
        axios.put(DATABASE_URL + DEPOSITS, request).then( res => {
            sucessfulTransaction();
            context.updateContext(context);
        })
    }

    function handleWithdraw(event){
        event.preventDefault();

        let request = {id: context.client.id, currency, amount, status: 'DONE'};

        if(currency === 'USD' && amount > context.wallet.dollaramount){// Rejects the transaction if the user cant afford
            rejectTransaction()
        } else if(currency === 'BRL' && amount > context.wallet.realamount){
            rejectTransaction()
        }else if(currency === 'EUR' && amount > context.wallet.euroamount){
            rejectTransaction()
        }else if(currency === 'GBP' && amount > context.wallet.poundamount){
            rejectTransaction()
        } else{
            axios.put(DATABASE_URL + WITHDRAWS, request).then( res => {
                sucessfulTransaction();
                context.updateContext(context);
                handleDeposit()
            })
        }
    }

    let [showAlert, setAlert] = React.useState('');
    let successTransactionLabel = router.locale === 'en-US' ? '✓ All Done!' : '✓ Tudo certo!';
    let failTransactionLabel = router.locale === 'en-US' ? '✘ Error! Couldn\'t afford the operation' : '✘ Erro! Saldo insuficiente ';

    return (
        <Container component="main" maxWidth="xs">

            <CssBaseline />
            <div className={classes.paper}>
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
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    {sendMoneyLabel}
                </Typography>
                <form className={classes.form} onSubmit={handleWithdraw}>
                    <Autocomplete
                        id="combo-box-demo"
                        options={clients}
                        classes={{
                            option: classes.option
                        }}
                        getOptionLabel={(option) => option.name}
                        onChange={(event, newValue) => {
                            setClientReceiver(newValue);
                            console.log(newValue)
                        }}
                        renderInput={(params) => <TextField {...params} label={clientReceiverLabel} variant="outlined" />}
                    />
                    <InputLabel id="demo-simple-select-label">{currencyLabel}</InputLabel>
                    <Select
                        value={currency}
                        variant="outlined"
                        fullWidth
                        onChange={(event)=>{
                            setCurrency(event.target.value);
                        }}>
                        {context.currencies.map((currencyToSelect, index) =>
                            <MenuItem value={currencyToSelect[0]} style={{backgroundColor: '#6d2177'}} key={index}>
                                {currencyToSelect[0].toUpperCase()}
                            </MenuItem>
                        )}
                    </Select>
                    <TextField
                        type="number"
                        variant="outlined"
                        margin="normal"
                        min="0"
                        required
                        fullWidth
                        name="amount"
                        onChange={(event) => setAmount(event.target.value)}
                        label={amountLabel}
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        {sendLabel}
                    </Button>
                </form>
            </div>
        </Container>
    );
}
