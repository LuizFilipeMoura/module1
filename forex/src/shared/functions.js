export function transactionHappen(operationData) {


    let walletReceived = JSON.parse(JSON.stringify(operationData.wallet));
    if(operationData.currency === 'GBP'){//Calculate and store the operationData rate
        operationData.rate = (1/operationData.rate)
    }

    if(operationData.operation === 'Sell' && operationData.currency === 'USD') { //Handles all the money trading, for each one of the four operations
        operationData.wallet.dollarAmount -= operationData.amount;
        operationData.wallet.poundAmount += operationData.amount * operationData.rate;
    } else if (operationData.operation === 'Sell' && operationData.currency === 'GBP') {
        operationData.wallet.dollarAmount += operationData.amount  * operationData.rate;
        operationData.wallet.poundAmount -= operationData.amount;
    } else if (operationData.operation === 'Buy' && operationData.currency === 'GBP') {
        operationData.wallet.dollarAmount -= operationData.amount * operationData.rate;
        operationData.wallet.poundAmount += operationData.amount;
    } else if (operationData.operation === 'Buy' && operationData.currency === 'USD') {
        operationData.wallet.dollarAmount += operationData.amount;
        operationData.wallet.poundAmount -= operationData.amount * operationData.rate;
    }
    if(operationData.wallet.dollarAmount < 0 || operationData.wallet.poundAmount < 0) {//If the transaction cannot happen it just sends the same data back
        return walletReceived;
    }
                // If the operationData is ok, stores the operationData in the database and refreshs the amount in the navbar
    return operationData.wallet;

}
