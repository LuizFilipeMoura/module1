import React, {createContext, useContext, useState} from 'react';

const AppContext = createContext({});

export function AppWrapper({ children }) {
    let currencies = [['GBP', '£', 'pound'], ['USD', '$', 'dollar'], ['EUR', '€', 'euro'], ['BRL', 'R$', 'real']];
    let [client, setClient] = useState({});
    let [wallet, setWallet] = useState({});

    function updateContext(context){
        setClient(context.client);
        setWallet(context.wallet);
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
