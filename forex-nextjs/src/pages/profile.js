
import React, {useEffect} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import axios from "axios";
import 'date-fns';

import Grid from '@material-ui/core/Grid';
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

export default function SignIn() {
    let context = useAppContext();
    const classes = useStyles();
    let router = useRouter();

    let nameLabel = router.locale === 'en-US' ? 'Name' : 'Nome';
    let profileLabel = router.locale === 'en-US' ? 'Profile' : 'Perfil';
    let saveLabel = router.locale === 'en-US' ? 'Save' : 'Salvar';
    let successTransactionLabel = router.locale === 'en-US' ? '✓ Profile saved' : '✓ Perfil salvo!';
    let emailTakenLabel = router.locale === 'en-US' ? 'Email taken' : 'Email indisponível';
    let invalidEmailLabel = router.locale === 'en-US' ? 'Invalid Email' : 'Email inválido';

    let [showAlert, setAlert] = React.useState('');
    let [email, setEmail] = useState('');
    let [name, setName] = useState('');
    let [birthdate, setBirthdate] = useState('');

    useEffect(() => {
        //If the user has valid data, show it here

        if (email === '' && name ==='' && context.client){
            setEmail(context.client.email);
            setName(context.client.name);
            setBirthdate(context.client.birthdate);
        }
        if(!context.isLogged && !localStorage.getItem('isLogged')){
            router.push(router.locale+'/')
        }
    });

    function validateEmail(givenEmail) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(givenEmail).toLowerCase());
    }

    function handleProfileChanging(event){

        //Validates the user data
        event.preventDefault();

        let user = {name: name, email: email, password: 'invalid', birthdate: birthdate};

        //If the email is taken
        axios.post(DATABASE_URL + CLIENTS+ '/signup', user).then( res => {
            if(res.data === 'Email taken'){
                alert(emailTakenLabel)
            } else {
                if(!validateEmail(email)) {
                    alert(invalidEmailLabel)
                } else {

                    //Stores the user data if it is valid
                    let user = {id: context.client.id,
                        name,
                        email,
                        birthdate,
                        bank_number: context.client.bank_number,
                        account_number: context.client.account_number};
                    context.client = user;
                    context.updateContext(context);
                    localStorage.setItem('client', JSON.stringify(user));
                    axios.put(DATABASE_URL + CLIENTS, user).then( res => {
                        sucessful();
                    })
                }
            }
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
                                {successTransactionLabel}
                            </div>
                            : ''
                    }
                </div>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    {profileLabel}
                </Typography>
                <form className={classes.form} onSubmit={handleProfileChanging}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        value={name}
                        onChange={(event) => setName(event.target.value)}
                        id="name"
                        label={nameLabel}
                        name="name"
                        autoComplete="name"
                        autoFocus
                        required
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                        id="email"
                        label="Email"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        required
                    />

                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="birthdate"
                        value={birthdate}
                        label={birthdate}
                        name="birthdate"
                        autoComplete="birthdate"
                        onChange={(event) => setBirthdate(event.target.value)}
                        type="date"
                        required
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
