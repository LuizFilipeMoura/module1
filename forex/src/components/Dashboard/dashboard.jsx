import React, {useState, useContext} from "react";

import axios from "axios";
import {DATABASE_API} from "../../shared/enviroment";
import Prices from "../Prices";
import BuySellCard from "../BuySellCard";
import Modal from 'react-modal';

import WalletContext from "../../context/wallet";
import {transactionHappen} from "../../shared/functions";


export function Dashboard({rate, onTransaction}){

    let [operation, setOperation] = useState('Buy'); //Default Values
    let [currency, setCurrency] = useState('USD');
    let [prefix, setPrefix] = useState('$');
    let [amount, setAmount] = useState(0);
    let wallet = useContext(WalletContext);
    let [modalMessage, setModalMessage] = useState('');

    Modal.setAppElement(document.getElementById('root'));

    async function storeTransaction(transaction) { //Submits the transaction to the MongoDB storage
        await axios.post(DATABASE_API, transaction);
    }

    function handleTransaction(event){//Handles the transaction (buying or selling)
        event.preventDefault();

        if(amount !== 0){//Transaction just starts if the value is different from 0
            let mockWallet = JSON.parse(JSON.stringify(wallet));//To pass the data inside the wallet without changing the actual values
            amount = amount.toString().replace(/,/g, '.');//Converts the comma to a dot in the amount, avoiding errors

            let operationData = {currency: currency, amount: Number(amount), operation: operation, wallet: mockWallet, rate: Number(rate) };

            let newWallet = transactionHappen(operationData);

            if(newWallet.poundAmount !== wallet.poundAmount && newWallet.dollarAmount !== wallet.dollarAmount ) {//Sets the new values of the wallet
                wallet.poundAmount = newWallet.poundAmount;
                wallet.dollarAmount = newWallet.dollarAmount;
                storeTransaction(operationData).then(()=>{
                    onTransaction(newWallet);//Changes the values of the wallet inside the DataBase
                });
            }else{//If the operation is not successfull
                setModalMessage('Operation was NOT sucessfull! You cannot afford that operation');
                openModal();
            }
        }


    }

    const [modalIsOpen,setIsOpen] = React.useState(false);
    function openModal() {
        setIsOpen(true);
    }

    function closeModal(){
        setIsOpen(false);
    }
    const customStyles = {
        content : {
            top                   : '50%',
            left                  : '50%',
            right                 : 'auto',
            bottom                : 'auto',
            marginRight           : '-50%',
            transform             : 'translate(-50%, -50%)'
        }
    };


    function changeOperationCurrency(currency, operation, prefix) { //Changes the Operation and/or Currency in the Card
        setCurrency(currency);
        setOperation(operation);
        setPrefix(prefix);
    }

    return (
        <span>

            <div className="vh-100 App">
                {/*Context API*/}
                <WalletContext.Provider value={wallet} >
                    <form onSubmit={handleTransaction.bind(this)}>
                        <div className="d-flex justify-content-md-center align-items-center vh-50 form-group row">

                            <Prices //USD Price Table
                                rate={1/rate}
                                changeOperationCurrency={changeOperationCurrency.bind(this)}
                                currency={'USD'}
                                prefix={'$'}
                                otherPrefix={'£'}/>


                            <BuySellCard //Buy or Selling Card, where the trade happens
                                operation={operation}
                                currency={currency}
                                prefix={prefix}
                                onAmountSelect={setAmount.bind(this)}
                            />

                            <Prices //GBP Price Table
                                rate={rate}
                                changeOperationCurrency={changeOperationCurrency.bind(this)}
                                currency={'GBP'}
                                prefix={'£'}
                                otherPrefix={'$'}/>
                        </div>

                    </form>
                </WalletContext.Provider>

                {/*History Button*/}
                <div className="row d-flex justify-content-md-center align-items-center vh-50 form-group ">
                    <a href="/history" type="button" className="btn btn-secondary" >Trading History</a>
                </div>

                {/*Modal for to send info to the users*/}
                <div>

                <Modal
                    isOpen={modalIsOpen}
                    onRequestClose={closeModal}
                    style={customStyles}
                >
                  <h2>{modalMessage}</h2>
                     <div className="text-center">
                        <button type="button" className="btn btn-success" onClick={closeModal}>Close</button>
                    </div>
                </Modal>
              </div>

            </div>
    </span>
    );




}
