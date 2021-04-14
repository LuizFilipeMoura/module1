
import React from 'react';
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
import {CLIENTS, DATABASE_URL, DEPOSITS} from "../shared/enviroment";
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
    let depositLabel = router.locale === 'en-US' ? 'Deposit' : 'Depósito:';


    let [currency, setCurrency] = useState('');
    let [amount, setAmount] = useState(0);

    function handleDeposit(event){
        event.preventDefault();
        let request = {id: context.client.id, currency, amount};
        console.log(request);
        axios.put(DATABASE_URL + DEPOSITS, request).then( res => {
            sucessful();
        })
    }

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
                    {depositLabel}
                </Typography>
                <form className={classes.form} onSubmit={handleDeposit}>
                    <InputLabel id="demo-simple-select-label">Age</InputLabel>
                    <Select
                        value={currency}
                        variant="outlined"
                        fullWidth
                        onChange={(event)=>{
                            setCurrency(event.target.value);
                        }}>
                        {context.currencies.map((currencyToSelect, index) =>
                                <MenuItem value={currencyToSelect[0]} style={{backgroundColor: '#6d2177'}} key={index}>
                                    {currencyToSelect[2].toUpperCase()}
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
                        {saveLabel}
                    </Button>
                </form>
            </div>
        </Container>
    );
}
