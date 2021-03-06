
import React, {useEffect} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import axios from "axios";
import Link from '@material-ui/core/Link';
import 'date-fns';

import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {useRouter} from "next/router";
import {CLIENTS, DATABASE_URL} from "../shared/enviroment";
import {useAppContext} from "../shared/AppWrapper";
import {useLabels} from "../shared/labels";
const md5 = require('md5');


const {useState} = require("react");


function Copyright() {
    return (
        <Typography variant="body2" color="textSecondary" align="center">
            {'Copyright © '}
            <Link color="inherit">
                ForexTrading
            </Link>{' '}
            {new Date().getFullYear()}
            {'.'}
        </Typography>
    );
}

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
    const [once, setOnce] = React.useState(true);
    let context = useAppContext();
    const classes = useStyles();
    let router = useRouter();
    let labels = useLabels().labels;

    let [email, setEmail] = useState('');
    let [name, setName] = useState('');
    let [password, setPassword] = useState('');
    let [repeatPassword, setRepeatPassword] = useState('');
    let [birthdate, setBirthdate] = useState('');

    useEffect(() => { //Erases the localStorage
        if(once){
            localStorage.clear();
            context.loggout();
            setOnce(false);
        }

    });

    function validateEmail(givenEmail) {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(givenEmail).toLowerCase());
    }

    function handleSignUp(event){
        //Validates the user data
        event.preventDefault();
        if(password !== repeatPassword) {
            alert(labels.passwordNotMatchLabel)
        }
        else if(password.length < 6){
            alert(labels.passwordLengthLabel)
        }
        else if(!validateEmail(email)) {
            alert(labels.invalidEmailLabel)
        } else {

            //Stores the user data if it is valid
            let user = {name: name, email: email, password: md5(password), birthdate: birthdate};
            axios.post(DATABASE_URL + CLIENTS+ '/signup', user).then( res => {
                if(res.data === 'Email taken'){
                    alert(labels.emailTakenLabel)
                } else {
                    router.push(router.locale+'/');
                }
            })
        }
    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    {labels.signup}
                </Typography>
                <form className={classes.form} onSubmit={handleSignUp}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        onChange={(event) => setName(event.target.value)}
                        id="name"
                        label={labels.nameLabel}
                        name="name"
                        autoComplete="name"
                        autoFocus
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        onChange={(event) => setEmail(event.target.value)}
                        id="email"
                        label="Email"
                        name="email"
                        autoComplete="email"
                        autoFocus
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        onChange={(event) => setPassword(event.target.value)}
                        label={labels.passwordLabel}
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        onChange={(event) => setRepeatPassword(event.target.value)}
                        label={labels.repeatPasswordLabel}
                        type="password"
                        id="repeatPassword"
                        autoComplete="current-password"
                    />
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        id="birthdate"
                        label={labels.birthdateLabel}
                        name="birthdate"
                        autoComplete="birthdate"
                        onChange={(event) => setBirthdate(event.target.value)}
                        type="date"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        {labels.signup}
                    </Button>
                    <Grid container>
                        <Grid item>
                            <Link href={router.locale+'/'} variant="body2">
                                {labels.signinLabel}
                            </Link>
                        </Grid>
                    </Grid>
                </form>
            </div>
            <Box mt={8}>
                <Copyright />
            </Box>
        </Container>
    );
}
