
import React, {useEffect} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {useRouter} from "next/router";
import {useAppContext} from "../shared/AppWrapper";
import InputLabel from "@material-ui/core/InputLabel";
import Select from "@material-ui/core/Select";
import MenuItem from "@material-ui/core/MenuItem";
import QRCode from "react-qr-code";
import CurrencyTextField from "@unicef/material-ui-currency-textfield";
import {NEXTJS_URL} from "../shared/enviroment";
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



export default function SendMoney() {
    let context = useAppContext();
    const classes = useStyles();
    let router = useRouter();
    let labels = useLabels().labels;

    let [currency, setCurrency] = useState('USD');
    let [amount, setAmount] = useState(0);
    let [link, setLink] = useState();


    useEffect(() => { //Stores the user in the localstorage
        if(!context.isLogged && !localStorage.getItem('isLogged')){
            router.push(router.locale+'/')
        }
    });

    function generateLink(event) {
        event.preventDefault();
        setLink(NEXTJS_URL + 'sendmoney?amount='+amount + '&currency=' + currency + '&receiver_id=' + context.client.id);
    }

    return (
        <Container component="main" maxWidth="xs">

            <CssBaseline />
            <div>
            </div>
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    {labels.chargeLabel}
                </Typography>
                <form className={classes.form} onSubmit={generateLink}>
                    <InputLabel id="demo-simple-select-label">{labels.currencyLabel}</InputLabel>
                    <Select
                        value={currency}
                        variant="outlined"
                        fullWidth
                        required
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
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        {labels.chargeLabel}!
                    </Button>
                </form>

                {/*Shows the link and the QRCode*/}

                {link ?
                <span>
                    <div className=" justify-content-center align-items-center mb-4">
                        <h4>{labels.sendLinkLabel}</h4>
                        <a >{link}</a>

                    </div>
                    <div className="d-flex justify-content-center align-items-center mb-4">
                        <h3>{labels.qrCodeLabel}</h3>
                    </div>
                    <div className="d-flex justify-content-center align-items-center mb-4">
                        <QRCode id="QRCode" value={link} />
                    </div>
                </span>
                    : ''}

            </div>
        </Container>
    );
}
