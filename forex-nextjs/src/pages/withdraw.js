
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
import {DATABASE_URL, WITHDRAWS} from "../shared/enviroment";
import {useAppContext} from "../shared/AppWrapper";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
import MenuItem from "@material-ui/core/MenuItem";
import CurrencyTextField from "@unicef/material-ui-currency-textfield";
import {
    calculatesWithWallet,
    localeStringGlobal,
    rejectTransactionGlobal,
    sucessfulTransactionGlobal
} from "../shared/globalFunctions";
import {useLabels} from "../shared/labels";
import Alert from "../components/Alert";


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

export default function Withdraw() {
    let context = useAppContext();
    const classes = useStyles();
    let router = useRouter();
    let labels = useLabels().labels;

    let [showAlert, setAlert] = React.useState('');
    let [currency, setCurrency] = useState(context.currencies[0][0]);
    let [amount, setAmount] = useState(0);
    let [withdraws, setWithdraws] = useState();

    useEffect(() => {
        if(context.client && (!context.client.bank_number || !context.client.account_number)){
            alert(labels.bankInfoAlert);
            router.push(router.locale+'/bankInfo')
        }
        //List All the withdraws fot that client
        if(!withdraws){
            listWithdraws();
        }
        if(!context.isLogged && !localStorage.getItem('isLogged')){
            router.push(router.locale+'/')
        }
        //If the user doesn`t have valid bank info it redirects to the bank info page

    });

    function listWithdraws(){//Lists the withdraws on the dataBase for that client

        axios.post(DATABASE_URL + WITHDRAWS, context.client)
            .then(response => {
                setWithdraws(response.data.rows.length === 0 ? [] : response.data.rows);
            })
            .catch(err => {
                console.log("oppps", err);
            });
    }

    //Show messages
    function rejectTransaction(){
        rejectTransactionGlobal(setAlert);
    }
    function sucessfulTransaction(){
        sucessfulTransactionGlobal(setAlert);
    }

    function handleWithdraw(event){
        event.preventDefault();
        calculatesWithWallet(currency, amount, context.wallet, rejectTransaction, success);
    }

    function success(){
        let request = {id: context.client.id, currency, amount,  status: 'DONE'};
        //If the user can afford the withdraw, stores it in the database, The DB automatically subtracts the amount from the wallet
        axios.put(DATABASE_URL + WITHDRAWS, request).then( res => {
            sucessfulTransaction();
            listWithdraws();
            context.updateContext(context);
        })
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                {/*    Alerts for the operation */}
                <Alert props={showAlert}/>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    {labels.withdrawLabel}
                </Typography>


                <form className={classes.form} onSubmit={handleWithdraw}>
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
                        required
                        decimalsLimit={2}
                        decimalCharacter="."
                        digitGroupSeparator=""
                        onChange={(textValue, name) => {
                            let value = Number(textValue.target.value);
                            setAmount(value)
                        }}
                    />
                    <div className="mt-5">
                        <p>{labels.withdrawInstructionsLabel}</p>
                        {
                            context.client?
                                <span>
                                    <p>{labels.bankNumberLabel}: {(context.client.bank_number)}</p>

                                    <p>{labels.accountNumberLabel}: {(context.client.account_number)}</p>
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

            {/*    /!*List all the withdraws*!/*/}

                {withdraws?.map(withdraw =>
                      <div className="d-flex justify-content-center align-items-center" >
                          <div className={withdraw.status === 'DONE' ? 'alert alert-success w-100' : 'alert alert-danger w-100' } >
                            <p>{labels.withdrawLabel} {labels.doneLabel}</p> <strong>
                            <p>{labels.amountLabel}: {withdraw.amount}</p>
                            <p>{labels.currencyLabel}: {withdraw.currency}</p>

                            </strong>
                                <p>{localeStringGlobal(withdraw)}</p>
                                {/*Translates the obs */}

                                {withdraw.obs && withdraw.obs !== '' ?
                                    <p>{router.locale === 'en-US' ?  withdraw.obs : withdraw.obs?.toString()
                                        .replace('SENT', 'ENVIADO')
                                        .replace('BY', 'POR')
                                        .replace('TO', 'PARA')}</p>: ''}

                        </div>
                      </div>
                )}

            </div>
        </Container>
    )
};
