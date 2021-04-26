
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

export default function BankInfo() {
    let context = useAppContext();
    const classes = useStyles();
    let router = useRouter();
    let labels = useLabels().labels;

    let [bankNumber, setBankNumber] = useState('');
    let [accountNumber, setAccountNumber] = useState('');
    let [showAlert, setAlert] = React.useState('');

    function handleSaveInfo(event){
        event.preventDefault();
        let user = context.client;
        user.bank_number = Number(bankNumber);
        user.account_number = Number(accountNumber);
        axios.put(DATABASE_URL + CLIENTS, user).then( res => {
            sucessful();
        })
    }

    useEffect(() => {
        //If there is bank info already, show it
        if (bankNumber === '' && accountNumber ===''){
            setBankNumber(context.client.bank_number);
            setAccountNumber(context.client.account_number);
        }

        //If the user is not logged in it is redirected to the login page
        if(!context.isLogged && !localStorage.getItem('isLogged')){
            router.push(router.locale+'/')
        }
    });

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
                    {labels.bankInfoLabel}
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
                        label={labels.bankNumberLabel}
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
                        label={labels.accountNumberLabel}
                    />
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
        </Container>
    );
}
