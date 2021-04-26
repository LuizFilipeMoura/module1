//Show messages
export function rejectTransactionGlobal(setAlert){
    setAlert('fail');
    setTimeout(function(){ setAlert(''); }, 3000);
}
export function sucessfulTransactionGlobal(setAlert){
    setAlert('success');
    setTimeout(function(){ setAlert(''); }, 3000);
}

export function calculatesWithWallet(currency, amount, wallet, fnReject, fnSuccess){

    if(currency === 'USD' && amount > wallet.dollaramount){// Rejects the transaction if the user cant afford
        fnReject()
    } else if(currency === 'BRL' && amount > wallet.realamount){
        fnReject()
    }else if(currency === 'EUR' && amount > wallet.euroamount){
        fnReject()
    }else if(currency === 'GBP' && amount > wallet.poundamount){
        fnReject()
    } else if (!Number(amount)){
        fnReject();
    } else{
        fnSuccess()
    }
}

export function updatesWalletGlobal(givenTransaction, wallet){ // Updates the wallet values for each currency

    givenTransaction.from_amount = Number(givenTransaction.from_amount.toFixed(2));
    givenTransaction.to_amount = Number(givenTransaction.to_amount.toFixed(2));

    if(givenTransaction.from_currency === 'BRL'){
        wallet.realamount += givenTransaction.from_amount;
    }
    else if(givenTransaction.from_currency === 'USD'){
        wallet.dollaramount += givenTransaction.from_amount;
    }
    else if(givenTransaction.from_currency === 'GBP'){
        wallet.poundamount += givenTransaction.from_amount;
    }
    else if(givenTransaction.from_currency === 'EUR'){
        wallet.euroamount += givenTransaction.from_amount;
    }

    if(givenTransaction.to_currency === 'BRL'){
        wallet.realamount -= givenTransaction.to_amount;
    }
    else if(givenTransaction.to_currency === 'USD'){
        wallet.dollaramount -= givenTransaction.to_amount;
    }
    else if(givenTransaction.to_currency === 'GBP'){
        wallet.poundamount -= givenTransaction.to_amount;
    }
    else if(givenTransaction.to_currency === 'EUR'){
        wallet.euroamount -= givenTransaction.to_amount;
    }
    return wallet;
}

export function localeStringGlobal(operation){
    return (new Date(operation.date)).toLocaleDateString()
        + ' '+ (new Date(operation.date)).getHours() + ':' +
    ((new Date(operation.date)).getUTCMinutes() <= 9? '0'
        + (new Date(operation.date)).getUTCMinutes(): (new Date(operation.date)).getUTCMinutes() )
}

export function handleCurrencyInputGlobal(operation, value, setBuyingAmount, buyingCurrency, sellingCurrency, setSellingAmount, rate){ //Calculates the amount of each currency the user has after the input

    if(operation === 0){//If the operation is buying
        setBuyingAmount(value);
        if(buyingCurrency === 'USD'){
            if(sellingCurrency === 'EUR'){
                setSellingAmount(value * rate.usdTOeur)
            }
            else if(sellingCurrency === 'BRL'){
                setSellingAmount(value * rate.usdTObrl)
            }
            else if(sellingCurrency === 'GBP'){
                setSellingAmount(value * rate.usdTOgbp)
            }
        } else {
            if(buyingCurrency === 'EUR'){
                setSellingAmount(value * (1/rate.usdTOeur))
            }
            else if(buyingCurrency === 'BRL'){
                setSellingAmount(value * (1/rate.usdTObrl))
            }
            else if(buyingCurrency === 'GBP'){
                setSellingAmount(value * (1/rate.usdTOgbp))
            }
        }
    } else{ //If it is a selling amount input
        setSellingAmount(value);
        if(buyingCurrency === 'USD'){

            if(sellingCurrency === 'EUR'){
                setBuyingAmount(value * (1/rate.usdTOeur))
            }
            else if(sellingCurrency === 'BRL'){
                setBuyingAmount(value * (1/rate.usdTObrl))
            }
            else if(sellingCurrency === 'GBP'){
                setBuyingAmount(value * (1/rate.usdTOgbp))
            }
        } else {
            if(buyingCurrency === 'EUR'){
                setBuyingAmount(value * (rate.usdTOeur))
            }
            else if(buyingCurrency === 'BRL'){
                setBuyingAmount(value * (rate.usdTObrl))
            }
            else if(buyingCurrency === 'GBP'){
                setBuyingAmount(value * (rate.usdTOgbp))
            }
        }
    }
}
