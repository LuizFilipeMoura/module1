import React, { createContext, useContext } from 'react';

const AppContext = createContext({});

export function AppWrapper({ children }) {
    let currencies = [['GBP', '£', 'pound'], ['USD', '$', 'dollar'], ['EUR', '€', 'euro'], ['BRL', 'R$', 'real']];
    let client = (JSON.parse(localStorage.getItem('client')));
    let wallet = {dol: 1, pound: 4};

    return (
        <AppContext.Provider value={{client, currencies, wallet}}>
            {children}
        </AppContext.Provider>
    );
}

export function useAppContext() {
    return useContext(AppContext);
}
