
import React, {useEffect} from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import TextField from '@material-ui/core/TextField';
import Link from '@material-ui/core/Link';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import Typography from '@material-ui/core/Typography';
import { makeStyles } from '@material-ui/core/styles';
import Container from '@material-ui/core/Container';
import {useRouter} from "next/router";
const md5 = require('md5');
import axios from "axios";
import {CLIENTS, DATABASE_URL} from "../shared/enviroment";
import {useAppContext} from "../shared/AppWrapper";


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
    const classes = useStyles();
    let context = useAppContext();
    const router = useRouter();

    let passwordLabel = router.locale === 'en-US' ? 'Password' : 'Senha';
    let signupLabel = router.locale === 'en-US' ? 'Don\'t have an account? Sign Up' : 'Não tem uma conta? Criar agora!';
    let signin = router.locale === 'en-US' ? 'Sign in' : 'Entrar';
    let noEmailLabel = router.locale === 'en-US' ? 'No account for email' : 'Nenhuma conta com esse email';
    let wrongPasswordLabel = router.locale === 'en-US' ? 'Wrong password' : 'Senha inválida';


    let [email, setEmail] = useState('');
    let [password, setPassword] = useState('');

    useEffect(() => { //Erases the localStorage
        if(once){
            localStorage.clear();
            context.loggout();
            setOnce(false);
        }
        if(localStorage.getItem('wallet')){
            localStorage.clear();
        }
    });

    //Signs the user in and store their info in localstorage
    function handleSignIn(event){
        event.preventDefault();
        let credentials = { email: email, password: md5(password)};
        axios.post(DATABASE_URL + CLIENTS+ '/signin', credentials).then( res => {

            //Validates the credentials
            if(res.data === 'Email wrong'){
                alert(noEmailLabel)
            } else if(res.data === 'Password wrong'){
                alert(wrongPasswordLabel)
            } else {

                localStorage.setItem('client', JSON.stringify(res.data));
                localStorage.setItem('isLogged', 'true');
                context.client = res.data;
                context.login();
                context.updateContext(context);
                router.push(router.locale+'/dashboard');
            }
        })

    }

    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
            <div className={classes.paper}>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    {signin}
                </Typography>
                <form className={classes.form} onSubmit={handleSignIn}>
                    <TextField
                        variant="filled"
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
                        variant="filled"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        onChange={(event) => setPassword(event.target.value)}
                        label={passwordLabel}
                        type="password"
                        id="password"
                        autoComplete="current-password"
                    />
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        className={classes.submit}
                    >
                        {signin}
                    </Button>
                    <Grid container>
                        <Grid item>
                            <Link href={router.locale+'/sign-up'} variant="body2">
                                {signupLabel}
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
