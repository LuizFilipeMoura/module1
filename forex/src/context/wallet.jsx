import React from 'react';

let defaultWallet = {
    dollarAmount: 0,
    poundAmount: 0
};

const WalletContext = React.createContext(defaultWallet);

export default WalletContext;
