
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
import {CLIENTS, DATABASE_URL, DEPOSITS, WITHDRAWS} from "../shared/enviroment";
import {useAppContext} from "../shared/AppWrapper";
import Autocomplete from '@material-ui/lab/Autocomplete';
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";
import CurrencyTextField from "@unicef/material-ui-currency-textfield";
import {useLabels} from "../shared/labels";
import {calculatesWithWallet, rejectTransactionGlobal, sucessfulTransactionGlobal} from "../shared/globalFunctions";
import Alert from "../components/Alert";


const {useState} = require("react");


const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
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
    let labels = useLabels().labels;

    const [once, setOnce] = React.useState(true);
    let [clients, setClients] = useState([]);
    let [clientReceiver, setClientReceiver] = useState();
    let [currency, setCurrency] = useState('USD');
    let [amount, setAmount] = useState(0);
    let [showAlert, setAlert] = React.useState('');
    const [disabled, setDisabled] = useState(false);
    const [open, setOpen] = React.useState(false);

    useEffect(() => {

        //List all the users
        if(once && context.client){
            listClients();
            setOnce(false);
        }

        //If there is information in the router query it is applied to the form
        if(router.query && Object.entries(router.query).length !== 0){
            for(const client of clients){
                if(Number(router.query.receiver_id ) === client.id){
                    setClientReceiver(client);
                }
            }
            setAmount(router.query.amount);
            setCurrency(router.query.currency);
            setDisabled(true);
        }


        //If the user is not logged in it is redirected to the login page
        if(!context.isLogged && !localStorage.getItem('isLogged')){
            router.push(router.locale+'/')
        }
    });


    function listClients(){//Lists all the clients of the system
        axios.post(DATABASE_URL + CLIENTS, {id: context.client.id})
            .then(response => {
                setClients(response.data);
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

    //Deposit the money for the person receiving it

    function handleDeposit(){
        let request = {id: clientReceiver.id, currency, amount, status: 'DONE', obs: ('SENT BY ' + context.client.name)};
        axios.put(DATABASE_URL + DEPOSITS, request).then( res => {
            sucessfulTransaction();
            handleClose();
            context.updateContext(context);
        })
    }

    //Withdraw the money for the person sending it
    function handleWithdraw(event){
        event.preventDefault();
        calculatesWithWallet(currency, amount, context.wallet, rejectTransaction, handleOpen);
    }

    const handleOpen = (event) => {
        console.log('chegando aqui');

        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    //Handles the confirmation of the user
    function doTransaction() {
        let request = {id: context.client.id, currency, amount, status: 'DONE', obs: ('SENT TO ' + clientReceiver.name)};
        axios.put(DATABASE_URL + WITHDRAWS, request).then(res => {
            sucessfulTransaction();
            context.updateContext(context);
            handleDeposit()
        });
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div>
                <Modal
                    aria-labelledby="transition-modal-title"
                    aria-describedby="transition-modal-description"
                    className={classes.modal}
                    open={open}
                    onClose={handleClose}
                    closeAfterTransition
                    BackdropComponent={Backdrop}
                    BackdropProps={{
                        timeout: 500,
                    }}
                >
                    <Fade in={open}>
                        <div className={classes.paper}>
                            <h4 id="transition-modal-title">{labels.clientReceiverLabel}:{clientReceiver?.name}</h4>
                            <h5 id="transition-modal-title">{labels.clientReceiverLabel} Email: {clientReceiver?.email}</h5>
                            <Button onClick={doTransaction}>{labels.sendLabel}</Button>
                            <Button onClick={handleClose}>{labels.cancelLabel}</Button>
                        </div>
                    </Fade>
                </Modal>
            </div>
            <div className={classes.paper}>
                {/*Message Alert*/}
                <Alert props={showAlert}/>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    {labels.sendMoneyLabel}
                </Typography>
                <form className={classes.form} onSubmit={handleWithdraw}>
                    {clientReceiver ?
                        <TextField
                            type="text"
                            variant="outlined"
                            margin="normal"
                            value={clientReceiver.name}
                            name="client"
                            fullWidth
                            disabled={disabled}
                            label={labels.clientReceiverLabel}
                        />
                        :
                        //Automcomplete field with all the users listed

                        <Autocomplete
                            id="combo-box-demo"
                            options={clients}
                            classes={{
                                option: classes.option
                            }}
                            getOptionLabel={(option) => option.name}
                            onChange={(event, newValue) => {
                                setClientReceiver(newValue);
                            }}
                            renderInput={(params) => <TextField
                                required {...params} label={labels.clientReceiverLabel} variant="outlined" />}
                        />
                    }

                    <InputLabel id="demo-simple-select-label">{labels.currencyLabel}</InputLabel>
                    <Select
                        value={currency}
                        variant="outlined"
                        fullWidth
                        required
                        disabled={disabled}

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
                        value={amount}
                        style={{marginTop: '15px'}}
                        disabled={disabled}
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
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        {labels.sendLabel}
                    </Button>
                </form>
            </div>
        </Container>
    );
}
