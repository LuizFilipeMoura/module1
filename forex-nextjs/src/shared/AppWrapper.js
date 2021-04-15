import React, {createContext, useContext, useState} from 'react';
import axios from "axios";
import {DATABASE_URL, WALLETS} from "./enviroment";

const AppContext = createContext({});

export function AppWrapper({ children }) {
    let currencies = [['GBP', '£', 'pound'], ['USD', '$', 'dollar'], ['EUR', '€', 'euro'], ['BRL', 'R$', 'real']];
    let [client, setClient] = useState();
    let [wallet, setWallet] = useState();

    function updateContext(context){
        if(!context.client){
            setClient(JSON.parse(localStorage.getItem('client')))
        } else {
            setClient(context.client);
        }
        if(!context.wallet){
            setWallet(JSON.parse(localStorage.getItem('wallet')))
            localStorage.getItem('client') ? axios.post(DATABASE_URL + WALLETS, JSON.parse(localStorage.getItem('client'))).then( res => {
                setWallet(res.data.rows[0]);
                localStorage.setItem('wallet', JSON.stringify(res.data.rows[0]));
            }) : ''
        } else {
            axios.post(DATABASE_URL + WALLETS, JSON.parse(localStorage.getItem('client'))).then( res => {
                setWallet(res.data.rows[0]);
                localStorage.setItem('wallet', JSON.stringify(res.data.rows[0]));
            })
        }
        console.log(context);



    }

    return (
        <AppContext.Provider value={{client, currencies, wallet, updateContext}}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}
