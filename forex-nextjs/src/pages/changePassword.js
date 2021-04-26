
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
import {CLIENTS, DATABASE_URL} from "../shared/enviroment";
import {useAppContext} from "../shared/AppWrapper";
import {useLabels} from "../shared/labels";
const md5 = require('md5');


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

export default function ChangePassword() {
    let context = useAppContext();
    const classes = useStyles();
    let router = useRouter();
    let labels = useLabels().labels;

    let [showAlert, setAlert] = React.useState('');
    let [oldPassword, setOldPassword] = useState('');
    let [password, setPassword] = useState('');
    let [repeatPassword, setRepeatPassword] = useState('');

    useEffect(() => {
        if(!context.isLogged && !localStorage.getItem('isLogged')){
            router.push(router.locale+'/')
        }
    });

    function handlePasswordChanging(event){

        //Validates the user data
        event.preventDefault();

        if(password !== repeatPassword) {
            alert(labels.passwordNotMatchLabel)
        }
        else if(password.length < 6) {
            alert(labels.passwordLengthLabel)
        } else {
            let credentials = {email: context.client.email, password: md5(oldPassword)};
            axios.post(DATABASE_URL + CLIENTS+ '/signin', credentials).then( res => {

                //Validates the credentials
                if(res.data === 'Password wrong'){
                    alert(labels.wrongPasswordLabel)
                } else {
                    //Changes the password
                    let user = {id: context.client.id, password: md5(password)};
                    console.log(user);
                    axios.put(DATABASE_URL + CLIENTS+ '/changepassword', user).then( res => {
                        console.log(res);
                        sucessful();
                    })
                }
            })
        }



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
                                {labels.successTransactionLabel}
                            </div>
                            : ''
                    }
                </div>
                <Avatar className={classes.avatar}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    {labels.changePasswordLabel}
                </Typography>
                <form className={classes.form} onSubmit={handlePasswordChanging}>
                    <TextField
                        variant="outlined"
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        onChange={(event) => setOldPassword(event.target.value)}
                        label={labels.oldPasswordLabel}
                        type="password"
                        id="password"
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
                        id="newPassword"
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
