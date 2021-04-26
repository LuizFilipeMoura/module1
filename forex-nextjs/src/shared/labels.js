import {useRouter} from "next/router";
import React, {createContext, useContext, useState} from "react";

export const AppContext = createContext({
});

export function Labels({ children }) {
    const router = useRouter();

    //Declares all the labels used in the application
    const labels = {
        sendLabel:router.locale === 'en-US' ? 'Send!' : 'Enviar!',
        clientReceiverLabel:router.locale === 'en-US' ? 'Receiver\'s name' : 'Nome do Recebedor',
        operationTypeLabel :router.locale === 'en-US' ? 'Filter by Operation Type' : 'Filtrar por tipo de operação',
        tradeLabel :'TRADE',
        oldPasswordLabel :router.locale === 'en-US' ? 'Old Password' : 'Senha antiga',
        chargeLabel :router.locale === 'en-US' ? 'Charge' : 'Cobrar',
        sendLinkLabel :router.locale === 'en-US' ? 'Send this link to charge' : 'Envie esse link para cobrar',
        qrCodeLabel :router.locale === 'en-US' ? 'Or Send this QRCode' : 'Ou envie esse QRCode',
        dashboardLabel: router.locale === 'en-US' ? 'Dashboard' : 'Painel',
        buyButtonLabel: router.locale === 'en-US' ? 'Buy' : 'Comprar',
        sellButtonLabel: router.locale === 'en-US' ? 'Sell' : 'Vender',
        operationLabel: router.locale === 'en-US' ? ['Buying', 'Selling'] : ['Comprando', 'Vendendo'],
        tradeButtonLabel: router.locale === 'en-US' ? 'TRADE!' : 'NEGOCIAR!',
        equalsToLabel: router.locale === 'en-US' ? 'equals to' : 'é igual a',
        successTransactionLabel: router.locale === 'en-US' ? '✓ Transaction Successful!'
        : '✓ Transação Bem-sucedida!',
        failTransactionLabel: router.locale === 'en-US' ? '✘ Error! Couldn\'t afford the operation' : '✘ Erro! Saldo insuficiente ',
        placeholderLabel: router.locale === 'en-US' ? 'Please insert amount here' : 'Por favor informar o montante aqui',
        profileLabel: router.locale === 'en-US' ? 'Profile' : 'Perfil',
        bankInfoLabel: router.locale === 'en-US' ? 'Bank Info' : 'Informações bancárias',
        depositLabel: router.locale === 'en-US' ? 'Deposit' : 'Depositar',
        accountBalanceLabel: router.locale === 'en-US' ? 'Account Balance' : 'Balanço de Conta',
        withdrawLabel: router.locale === 'en-US' ? 'Withdraw' : 'Sacar',
        historyLabel: router.locale === 'en-US' ? 'History' : 'Histórico',
        logoutLabel: router.locale === 'en-US' ? 'Logout' : 'Sair',
        sendMoneyLabel: router.locale === 'en-US' ? 'Send Money' : 'Enviar Dinheiro',
        chargeMoneyLabel: router.locale === 'en-US' ? 'Charge' : 'Cobrar',
        currencyLabel:router.locale === 'en-US' ? 'Currency' : 'Moeda',
        amountLabel:router.locale === 'en-US' ? 'Amount' : 'Montante',
        saveLabel:router.locale === 'en-US' ? 'Save' : 'Salvar',
        withdrawInstructionsLabel:router.locale === 'en-US' ? 'The deposit will be done in this following account:'
            : 'O depósito será feito na seguinte conta:',
        dateLabel:router.locale === 'en-US' ? 'Date' : 'Data',
        bankInfoAlert:router.locale === 'en-US' ? 'Bank info are not correct' : 'Informações bancárias insuficientes',
        bankNumberLabel:router.locale === 'en-US' ? 'Bank Number' : 'Número do Banco',
        doneLabel:router.locale === 'en-US' ? 'DONE' : 'FEITO',
        pendingLabel:router.locale === 'en-US' ? 'PENDING' : 'PENDENTE',
        accountNumberLabel:router.locale === 'en-US' ? 'Account Number' : 'Número da conta',
        nameLabel:router.locale === 'en-US' ? 'Name: ' : 'Nome: ',
        forexAccountLabel:router.locale === 'en-US' ? 'Account:' : 'Conta:',
        depositInstructionsLabel:router.locale === 'en-US' ? 'The deposit must be done in these following account:'
            : 'O depósIto deverá ser feito na seguinte conta:',
        passwordLabel :router.locale === 'en-US' ? 'Password' : 'Senha',
        repeatPasswordLabel :router.locale === 'en-US' ? 'Repeat Password' : 'Repetir a Senha',
        signinLabel :router.locale === 'en-US' ? 'Already have an account? Sign Ip' : 'Já tem uma conta? Entrar agora!',
        signup :router.locale === 'en-US' ? 'Sign Up' : 'Cadastrar',
        passwordNotMatchLabel :router.locale === 'en-US' ? 'Password don`t match' : 'Senhas não são estão iguais',
        passwordLengthLabel :router.locale === 'en-US' ? 'Password need to be at least 6 characthers long' :
            'Senhas precisam ter pelo menos 6 caracteres',
        invalidEmailLabel :router.locale === 'en-US' ? 'Invalid Email' : 'Email inválido',
        emailTakenLabel :router.locale === 'en-US' ? 'Email taken' : 'Email indisponível',
        birthdateLabel :router.locale === 'en-US' ? 'Birthdate' : 'Data de nascimento',
        changePasswordLabel :router.locale === 'en-US' ? 'Change Password' : 'Mudar Senha' ,
        signupLabel:router.locale === 'en-US' ? 'Don\'t have an account? Sign Up' : 'Não tem uma conta? Criar agora!' ,
        signin:router.locale === 'en-US' ? 'Sign in' : 'Entrar' ,
        noEmailLabel:router.locale === 'en-US' ? 'No account for email' : 'Nenhuma conta com esse email' ,
        wrongPasswordLabel:router.locale === 'en-US' ? 'Wrong password' : 'Senha inválida' ,
        dataLabel : router.locale === 'en-US' ? 'Date' : 'Data',
        buyingLabel : router.locale === 'en-US' ? 'Buying' : 'Comprando',
        sellingLabel : router.locale === 'en-US' ? 'Selling' : 'Vendendo',
        deletingLabel : router.locale === 'en-US' ? 'You are sure you want to delete this transaction from your history?'
            : 'Voce tem certeza que quer deletar essa transação do seu histórico?',
        yesLabel : router.locale === 'en-US' ? 'Yes' : 'Sim',
        cancelLabel : router.locale === 'en-US' ? 'Cancel' : 'Cancelar',
    };

    //Provides the context data for all the application
    return (
        <AppContext.Provider value={{labels}}>
            {children}
        </AppContext.Provider>
    );
}

export function useLabels() {
    return useContext(AppContext);
}
