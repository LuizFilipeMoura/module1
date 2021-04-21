import React, {createContext, useContext, useState} from 'react';
import axios from "axios";
import {DATABASE_URL, WALLETS} from "./enviroment";

export const AppContext = createContext({
});

export function AppWrapper({ children }) {
    //Declares all the data to be handled in all the aplication
    let currencies = [['GBP', '£', 'pound'], ['USD', '$', 'dollar'], ['EUR', '€', 'euro'], ['BRL', 'R$', 'real']];
    let [client, setClient] = useState();
    let [wallet, setWallet] = useState();
    let [isLogged, setIsLogged] = useState();


    function login(){
        setIsLogged(true);
    }

    //Erase the localstorage and the data of this context
    function loggout(){
        localStorage.removeItem('isLogged');
        localStorage.clear();
        setIsLogged(false);
        setClient(undefined);
        setWallet(undefined);
    }

    //Updates the view with the data of the context passed by parameter
    function updateContext(context){
        setIsLogged(localStorage.getItem('isLogged'));
        if(!context.client){
            setClient(JSON.parse(localStorage.getItem('client')))
        } else {
            setClient(context.client);
        }
        localStorage.getItem('client') ? axios.post(DATABASE_URL + WALLETS, JSON.parse(localStorage.getItem('client'))).then( res => {
            setWallet(res.data.rows[0]);
            localStorage.setItem('wallet', JSON.stringify(res.data.rows[0]));
        }) : ''

    }

    //Provides the context data for all the application
    return (
        <AppContext.Provider value={{client, currencies, wallet, isLogged, updateContext,  login, loggout}}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}
