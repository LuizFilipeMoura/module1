
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
import {CLIENTS, DATABASE_URL} from "../shared/enviroment";
import {useAppContext} from "../shared/AppWrapper";


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

export default function BankInfo() {
    let context = useAppContext();

    const classes = useStyles();

    let router = useRouter();

    let bankNumberLabel = router.locale === 'en-US' ? 'Bank Number' : 'Número do Banco';
    let accountNumberLabel = router.locale === 'en-US' ? 'Account Number' : 'Número da conta';
    let saveLabel = router.locale === 'en-US' ? 'Save Info' : 'Salvar Info';
    let bankInfoLabel = router.locale === 'en-US' ? 'Bank Info' : 'Informações Bancárias';


    let [bankNumber, setBankNumber] = useState('');
    let [accountNumber, setAccountNumber] = useState('');

    function handleSaveInfo(event){
        event.preventDefault();
        let user = context.client;
        user.bank_number = Number(bankNumber);
        user.account_number = Number(accountNumber);
        console.log(user);
        axios.put(DATABASE_URL + CLIENTS, user).then( res => {
            sucessful();
        })
    }

    useEffect(() => { //Stores the user in the localstorage
        if (bankNumber === '' && accountNumber ===''){
            setBankNumber(context.client.bank_number);
            setAccountNumber(context.client.account_number);
        }
        if(!context.isLogged && !localStorage.getItem('isLogged')){
            router.push(router.locale+'/')
        }
    });

    function sucessful(){
        setAlert('success');
        setTimeout(function(){ setAlert(''); }, 3000);
    }

    let [showAlert, setAlert] = React.useState('');
    let successTransactionLabel = router.locale === 'en-US' ? '✓ All Done!' : '✓ Tudo certo!';
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
                    {bankInfoLabel}
                </Typography>
                <form className={classes.form} onSubmit={handleSaveInfo}>

                    <TextField
                        type="number"
                        variant="outlined"
                        margin="normal"
                        value={bankNumber}
                        min="0"
                        required
                        fullWidth
                        onChange={(event) => setBankNumber(event.target.value)}
                        label={bankNumberLabel}
                        name="bank-number"
                        autoFocus
                    />
                    <TextField
                        type="number"
                        variant="outlined"
                        margin="normal"
                        value={accountNumber}
                        min="0"
                        required
                        fullWidth
                        name="account-number"
                        onChange={(event) => setAccountNumber(event.target.value)}
                        label={accountNumberLabel}
                    />
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
        </Container>
    );
}
