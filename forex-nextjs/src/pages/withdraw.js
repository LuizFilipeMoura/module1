
import React, {useEffect} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import axios from "axios";
import 'date-fns';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {useRouter} from "next/router";
import {DATABASE_URL, DEPOSITS, PASTTRADES, WITHDRAWS} from "../shared/enviroment";
import {useAppContext} from "../shared/AppWrapper";
import Select from "@material-ui/core/Select";
import InputLabel from "@material-ui/core/InputLabel";
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
}));

export default function Withdraw() {
    let context = useAppContext();

    const classes = useStyles();

    let router = useRouter();

    let currencyLabel = router.locale === 'en-US' ? 'Currency' : 'Moeda';
    let amountLabel = router.locale === 'en-US' ? 'Amount' : 'Montante';
    let saveLabel = router.locale === 'en-US' ? 'Request Withdraw' : 'Requerir Saque';
    let forexAccountLabel = router.locale === 'en-US' ? 'Account:' : 'Conta:';
    let withdrawInstructionsLabel = router.locale === 'en-US' ? 'The withdraw will be done in these following account:'
        : 'O saque será feito na seguinte conta:';
    let withdrawLabel = router.locale === 'en-US' ? 'Withdraw' : 'Saque';
    let dateLabel = router.locale === 'en-US' ? 'Date' : 'Data';



    let [currency, setCurrency] = useState('');
    let [amount, setAmount] = useState(0);
    let [withdraws, setWithdraws] = useState();


    useEffect(() => { //Stores the user in the localstorage
        if(!withdraws){
            listWithdraws();
        }
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

    function rejectTransaction(){
        setAlert('fail');
        setTimeout(function(){ setAlert(''); }, 3000);
    }
    function sucessfulTransaction(){
        setAlert('success');
        setTimeout(function(){ setAlert(''); }, 3000);
    }

    function handleWithdraw(event){
        event.preventDefault();
        
        let request = {id: context.client.id, currency, amount};
        
        if(currency === 'USD' && amount > context.wallet.dollaramount){// Rejects the transaction if the user cant afford
            rejectTransaction()
        } else if(currency === 'BRL' && amount > context.wallet.realamount){
            rejectTransaction()
        }else if(currency === 'EUR' && amount > context.wallet.euroamount){
            rejectTransaction()
        }else if(currency === 'GBP' && amount > context.wallet.poundamount){
            rejectTransaction()
        } else{
            console.log(request);
            axios.put(DATABASE_URL + WITHDRAWS, request).then( res => {
                sucessfulTransaction();
                listWithdraws();
                context.updateContext(context);
            })
        }
    }

    let [showAlert, setAlert] = React.useState('');

    let successTransactionLabel = router.locale === 'en-US' ? '✓ All Done!' : '✓ Tudo certo!';
    let nameLabel = router.locale === 'en-US' ? 'Name: ' : 'Nome: ';
    let failTransactionLabel = router.locale === 'en-US' ? '✘ Error! Couldn\'t afford the operation' : '✘ Erro! Saldo insuficiente ';
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
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
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    {withdrawLabel}
                </Typography>


                <form className={classes.form} onSubmit={handleWithdraw}>
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
                    <span>
                        <p>{withdrawInstructionsLabel}</p>
                        <p>FOREX: 0001</p>
                        {
                            context.client?
                                <span>
                                    <p>{forexAccountLabel} {(context.client.forex_account <= 9 ?
                                        '000' + (context.client.forex_account)
                                        : (context.client.forex_account) <= 9 ? '0' + (context.client.forex_account)
                                            :context.client.forex_account)}</p>
                                    <p>{nameLabel}{context.client.name?.toUpperCase()}</p>
                                </span> : ''
                        }


                    </span>
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        {saveLabel}
                    </Button>
                </form>

            </div>
            <div className=" mt-5 mb-5 w-100" >
                {withdraws?.map(withdraw =>

                    <div className="d-flex justify-content-center align-items-center" >
                        {withdraw.status === 'DONE'?
                            <div className="alert alert-success w-100" role="alert">
                                <p>{withdrawLabel}</p> {withdraw.amount} {withdraw.currency}  {withdraw.status}
                            </div>
                            :
                            <div className="alert alert-danger w-100" role="alert">
                                <p>{withdrawLabel} {withdraw.status}</p> <strong>
                                <p>{amountLabel}: {withdraw.amount}</p>
                                <p>{currencyLabel}: {withdraw.currency}</p>
                            </strong>
                                <p>{dateLabel}: {(new Date(withdraw.date)).toLocaleDateString() + ' '+ (new Date(withdraw.date)).getHours() + ':' +
                                ((new Date(withdraw.date)).getUTCMinutes() <= 9? '0' + (new Date(withdraw.date)).getUTCMinutes(): (new Date(withdraw.date)).getUTCMinutes() ) }</p>
                            </div>
                        }

                    </div>


                )}

            </div>

        </Container>
    );
}
