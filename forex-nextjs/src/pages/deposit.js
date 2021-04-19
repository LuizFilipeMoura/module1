
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
import { DATABASE_URL, DEPOSITS} from "../shared/enviroment";
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

export default function Deposit() {
    let context = useAppContext();

    const classes = useStyles();

    let router = useRouter();

    let currencyLabel = router.locale === 'en-US' ? 'Currency' : 'Moeda';
    let amountLabel = router.locale === 'en-US' ? 'Amount' : 'Montante';
    let saveLabel = router.locale === 'en-US' ? 'Request Deposit' : 'Requerir Depósito';
    let forexAccountLabel = router.locale === 'en-US' ? 'Account:' : 'Conta:';
    let depositInstructionsLabel = router.locale === 'en-US' ? 'The deposit must be done in these following account:'
        : 'O depóstio deverá ser feito na seguinte conta:';
    let depositLabel = router.locale === 'en-US' ? 'Deposit' : 'Depósito';
    let dateLabel = router.locale === 'en-US' ? 'Date' : 'Data';



    let [currency, setCurrency] = useState('');
    let [amount, setAmount] = useState(0);
    let [deposits, setDeposits] = useState();


    useEffect(() => { //Stores the user in the localstorage
        if(!deposits){
            listDeposits();
        }
        if(!context.isLogged && !localStorage.getItem('isLogged')){
            router.push(router.locale+'/')
        }
    });

    function listDeposits(){//Lists the deposits on the dataBase for that client

        axios.post(DATABASE_URL + DEPOSITS, context.client)
            .then(response => {
                console.log(response.data.rows);
                setDeposits(response.data.rows.length === 0 ? [] : response.data.rows);
            })
            .catch(err => {
                console.log("oppps", err);
            });
    }

    function handleDeposit(event){
        event.preventDefault();
        let request = {id: context.client.id, currency, amount, status: 'PENDING'};
        axios.put(DATABASE_URL + DEPOSITS, request).then( res => {
            sucessful();
            listDeposits();
        })
    }

    function sucessful(){
        setAlert('success');
        setTimeout(function(){ setAlert(''); }, 3000);
    }

    let [showAlert, setAlert] = React.useState('');
    let successTransactionLabel = router.locale === 'en-US' ? '✓ All Done!' : '✓ Tudo certo!';
    let nameLabel = router.locale === 'en-US' ? 'Name: ' : 'Nome: ';
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <div className="d-flex justify-content-center align-items-center">
                    {
                        showAlert === 'success'?
                            <div className="alert alert-success" role="alert">
                                {successTransactionLabel}
                            </div>
                            : ''
                    }
                </div>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    {depositLabel}
                </Typography>


                <form className={classes.form} onSubmit={handleDeposit}>
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
                        <p>{depositInstructionsLabel}</p>
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
                {deposits?.map(deposit =>

                    <div className="d-flex justify-content-center align-items-center" >
                        {deposit.status === 'DONE'?
                            <div className="alert alert-success w-100" role="alert">
                                <p>{depositLabel} {deposit.status}</p> <strong>
                                <p>{amountLabel}: {deposit.amount}</p>
                                <p>{currencyLabel}: {deposit.currency}</p>
                            </strong>
                                <p>{dateLabel}: {(new Date(deposit.date)).toLocaleDateString() + ' '+ (new Date(deposit.date)).getHours() + ':' +
                                ((new Date(deposit.date)).getUTCMinutes() <= 9? '0' + (new Date(deposit.date)).getUTCMinutes(): (new Date(deposit.date)).getUTCMinutes() ) }</p>
                                {deposit.obs && deposit.obs !== '' ?
                                    <p>{currencyLabel}: {deposit.obs}</p>: ''}
                            </div>
                            :
                            <div className="alert alert-danger w-100" role="alert">
                                <p>{depositLabel} {deposit.status}</p> <strong>
                                <p>{amountLabel}: {deposit.amount}</p>
                                <p>{currencyLabel}: {deposit.currency}</p>
                            </strong>
                                <p>{dateLabel}: {(new Date(deposit.date)).toLocaleDateString() + ' '+ (new Date(deposit.date)).getHours() + ':' +
                                ((new Date(deposit.date)).getUTCMinutes() <= 9? '0' + (new Date(deposit.date)).getUTCMinutes(): (new Date(deposit.date)).getUTCMinutes() ) }</p>
                                {deposit.obs && deposit.obs !== '' ?
                                    <p>{currencyLabel}: {deposit.obs}</p>: ''}
                            </div>
                        }

                    </div>


                )}

            </div>

        </Container>
    );
}
