
import React, {useEffect} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import axios from "axios";
import 'date-fns';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {useRouter} from "next/router";
import { DATABASE_URL, DEPOSITS} from "../shared/enviroment";
import {useAppContext} from "../shared/AppWrapper";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import CurrencyTextField from "@unicef/material-ui-currency-textfield";
import {localeStringGlobal} from "../shared/globalFunctions";
import {useLabels} from "../shared/labels";


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
}));

export default function Deposit() {
    let context = useAppContext();
    const classes = useStyles();
    let router = useRouter();
    let labels = useLabels().labels;

    let [showAlert, setAlert] = React.useState('');
    let [currency, setCurrency] = useState('');
    let [amount, setAmount] = useState(0);
    let [deposits, setDeposits] = useState();


    useEffect(() => {
        //List the deposits
        if(!deposits){
            listDeposits();
        }
        if(!context.isLogged && !localStorage.getItem('isLogged')){
            router.push(router.locale+'/')
        }
    });

    function listDeposits(){//Lists the deposits on the dataBase for that client

        console.log(context.client);
        axios.post(DATABASE_URL + DEPOSITS, context.client)
            .then(response => {
                setDeposits(response.data.rows.length === 0 ? [] : response.data.rows);
            })
            .catch(err => {
                console.log("oppps", err);
            });
    }

    //Stores the deposit
    function handleDeposit(event){
        event.preventDefault();
        let request = {id: context.client.id, currency, amount, status: 'PENDING'};
        //Stores it in the database, The DB automatically adds the amount from the wallet when it is DONE
        axios.put(DATABASE_URL + DEPOSITS, request).then( res => {
            sucessful();
            listDeposits();
        })
    }

    function sucessful(){
        setAlert('success');
        setTimeout(function(){ setAlert(''); }, 3000);
    }


    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <div className="d-flex justify-content-center align-items-center">
                    {
                        showAlert === 'success'?
                            <div className="alert alert-success" role="alert">
                                {labels.successTransactionLabel}
                            </div>
                            : ''
                    }
                </div>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    {labels.depositLabel}
                </Typography>


                <form className={classes.form} onSubmit={handleDeposit}>
                    <InputLabel id="demo-simple-select-label">{labels.currencyLabel}</InputLabel>
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
                    <CurrencyTextField
                        style={{marginTop: '15px'}}

                        variant="outlined"
                        name="input-name"
                        label={labels.amountLabel}
                        defaultValue={0.00}
                        fullWidth
                        decimalsLimit={2}
                        decimalCharacter="."
                        digitGroupSeparator=""
                        onChange={(textValue, name) => {
                            let value = Number(textValue.target.value);
                            setAmount(value)
                        }}
                    />
                    <div className="mt-5">
                        {/*Clients info for deposits*/}
                        <p>{labels.depositInstructionsLabel}</p>
                        <p>FOREX: 0001</p>
                        {
                            context.client?
                                <span>
                                    <p>{labels.forexAccountLabel} {(context.client.forex_account <= 9 ?
                                        '000' + (context.client.forex_account)
                                        : (context.client.forex_account) <= 9 ? '0' + (context.client.forex_account)
                                            :context.client.forex_account)}</p>
                                    <p>{labels.nameLabel}{context.client.name?.toUpperCase()}</p>
                                </span> : ''
                        }


                    </div>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        {labels.saveLabel}
                    </Button>
                </form>

            </div>
            <div className=" mt-5 mb-5 w-100" >

                {/*List all the deposits for that client*/}

                {deposits?.map(deposit =>
                    <div className="d-flex justify-content-center align-items-center" >
                        <div className={deposit.status === 'DONE' ? 'alert alert-success w-100' : 'alert alert-danger w-100' } >
                            <p>{labels.depositLabel} {deposit.status === 'DONE' ? labels.doneLabel : labels.pendingLabel }</p> <strong>
                            <p>{labels.amountLabel}: {deposit.amount}</p>
                            <p>{labels.currencyLabel}: {deposit.currency}</p>

                        </strong>
                            <p>{localeStringGlobal(deposit)}</p>
                            {/*Translates the obs */}

                            {deposit.obs && deposit.obs !== '' ?
                                <p>{router.locale === 'en-US' ?  deposit.obs : deposit.obs?.toString()
                                    .replace('SENT', 'ENVIADO')
                                    .replace('BY', 'POR')
                                    .replace('TO', 'PARA')}</p>: ''}

                        </div>
                    </div>
                )}

            </div>

        </Container>
    );
}
