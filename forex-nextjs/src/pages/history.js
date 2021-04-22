import React, {useEffect, useState} from "react";
import {DATABASE_URL, PASTTRADES} from "../shared/enviroment";
import {useAppContext} from "../shared/AppWrapper";
import DeleteIcon from '@material-ui/icons/Delete';

import axios from "axios";
import {useRouter} from "next/router";
import Button from "@material-ui/core/Button";
import makeStyles from "@material-ui/core/styles/makeStyles";
import Modal from "@material-ui/core/Modal";
import Backdrop from "@material-ui/core/Backdrop";
import Fade from "@material-ui/core/Fade";

const useStyles = makeStyles((theme) => ({
    modal: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    paper: {
        backgroundColor: theme.palette.background.dark,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
}));

export default function History (){
    let context = useAppContext();
    const classes = useStyles();
    let [trades, setTrades] = useState();
    let [btnValue, setBtnValue] = useState();
    let router = useRouter();
    const [open, setOpen] = React.useState(false);

    let dataLabel = router.locale === 'en-US' ? 'Date' : 'Data';
    let buyingLabel = router.locale === 'en-US' ? 'Buying' : 'Comprando';
    let sellingLabel = router.locale === 'en-US' ? 'Selling' : 'Vendendo';
    let deletingLabel = router.locale === 'en-US' ? 'You are sure you want to delete this transaction from your history?'
        : 'Voce tem certeza que quer deletar essa transação do seu histórico?';
    let yesLabel = router.locale === 'en-US' ? 'Yes' : 'Sim';
    let cancelLabel = router.locale === 'en-US' ? 'Cancel' : 'Cancelar';
    let historyLabel= router.locale === 'en-US' ? 'History' : 'Histórico';



    useEffect(() => {
        if(!trades || trades.length ===0){
            listTrades();
        }
        if(!context.isLogged && !localStorage.getItem('isLogged')){
            router.push(router.locale+'/')
        }
    });

    function listTrades(){//Lists the trades on the dataBase for that client

        axios.post(DATABASE_URL + PASTTRADES, context.client)
            .then(response => {
                setTrades( response.data.rows.length === 0 ? [] : response.data.rows);
            })
            .catch(err => {
                console.log("oppps", err);
            });
    }

    function makesDelete(){
        //Deletes the history for that trade
        axios.delete(DATABASE_URL + PASTTRADES, {data: {id: btnValue}})
            .then(response => {
                handleClose();
                listTrades();
            })
            .catch(err => {
                console.log("oppps", err);
            });
    }

    const handleOpen = (event) => {
        setBtnValue(event.currentTarget.value);
        setOpen(true);
    };

    const handleClose = () => {
        setOpen(false);
    };

    return(
        <div className="d-flex justify-content-md-center align-items-center">
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
                            <h2 id="transition-modal-title">{deletingLabel}</h2>
                            <Button onClick={makesDelete}>{yesLabel}</Button>
                            <Button onClick={handleClose}>{cancelLabel}</Button>
                        </div>
                    </Fade>
                </Modal>
            </div>

            <div className="text-center align-center ">
                <h3>{historyLabel}</h3>

                <table className="table table-light">
                    <thead>
                    <tr>
                        <th scope="col">{dataLabel}</th>
                        <th scope="col">{buyingLabel}</th>
                        <th scope="col">{sellingLabel}</th>
                        <th scope="col">Delete</th>
                    </tr>
                    </thead>
                    <tbody>

                    {/*Listing Method using the list that was retrieved from the database*/}

                    { trades?.map( (trade,index) =>

                        <tr key={index}>
                            <th scope="row">{(new Date(trade.date)).toLocaleDateString() + ' '+ (new Date(trade.date)).getHours() + ':' +
                            ((new Date(trade.date)).getUTCMinutes() <= 9? '0' + (new Date(trade.date)).getUTCMinutes(): (new Date(trade.date)).getUTCMinutes() ) }
                            </th>
                            <td>
                                <span className="text-muted">{trade.from_currency}</span>
                                <span style={{fontSize: '18px'}}>{trade.from_amount.toFixed(2)}</span>

                            </td>
                            <td>
                                <span className="text-muted">{trade.to_currency}</span>
                                <span style={{fontSize: '18px'}}>{trade.to_amount.toFixed(2)}</span>

                            </td>
                            <td><Button variant="contained" onClick={handleOpen} value={trade.id}><DeleteIcon id={trade.id}/></Button></td>
                        </tr>
                    )}
                    </tbody>
                </table>

            </div>

        </div>
    )
}
