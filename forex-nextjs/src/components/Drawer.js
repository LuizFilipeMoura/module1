import clsx from "clsx";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import HistoryIcon from "@material-ui/icons/History";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import MoneyIcon from '@material-ui/icons/Money';
import SendIcon from '@material-ui/icons/Send';
import DashboardIcon from "@material-ui/icons/Dashboard";
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import ListItemText from "@material-ui/core/ListItemText";
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import Divider from "@material-ui/core/Divider";
import React from "react";
import {makeStyles} from "@material-ui/core/styles";
import {useRouter } from "next/router";

const useStyles = makeStyles({//Define the style of the page
    list: {
        width: 250,
    }
});

const DrawerList = ({props}) => {
    const classes = useStyles();

    const [state, setState] = React.useState({
        left: false,
    });

    let router = useRouter();

    //I18n labels
    let dashboardLabel = router.locale === 'en-US' ? 'Dashboard' : 'Painel';
    let profileLabel= router.locale === 'en-US' ? 'Profile' : 'Perfil';
    let bankInfoLabel= router.locale === 'en-US' ? 'Bank Info' : 'Informações bancárias';
    let depositLabel= router.locale === 'en-US' ? 'Deposit' : 'Depositar';
    let accountBalanceLabel = router.locale === 'en-US' ? 'Account Balance' : 'Balanço de Conta';

    let withdrawLabel= router.locale === 'en-US' ? 'Withdraw' : 'Sacar';
    let historyLabel= router.locale === 'en-US' ? 'History' : 'Histórico';
    let logoutLabel= router.locale === 'en-US' ? 'Logout' : 'Sair';
    let sendMoneyLabel= router.locale === 'en-US' ? 'Send Money' : 'Enviar Dinheiro';
    let chargeMoneyLabel= router.locale === 'en-US' ? 'Charge' : 'Cobrar';

    //The list of buttons inside the drawer
    return (

        <>
            <div
                className={clsx(classes.list, {
                    [classes.fullList]: 'right' === 'top' || 'right' === 'bottom',
                })}
                role="presentation"
            >
                <List>

                    {}
                    {/*Go through all the options available inside the drawer*/}

                    {[profileLabel, bankInfoLabel, historyLabel, withdrawLabel, depositLabel, dashboardLabel,sendMoneyLabel, chargeMoneyLabel, accountBalanceLabel, logoutLabel].map((text, index) => (
                        <ListItem button key={text} onClick={()=>

                            {router.push({ pathname: router.locale +'/' + (index === 0 ? 'profile'
                                : index === 1 ? 'bank-info'
                                    : index === 2 ? 'history'
                                        : index === 3 ? 'withdraw'
                                            : index === 4 ? 'deposit'
                                                : index === 5 ? 'dashboard'
                                                    : index === 6 ? `sendmoney`
                                                        : index === 7 ? 'chargeForMoney'
                                                                : index === 8 ? 'accountBalance'
                                                            : '')
                            });
                            } }>
                            <ListItemIcon>
                                {index === 0 ? <AccountCircleIcon />
                                    : index === 1 ? <AccountBalanceIcon />
                                        : index === 2 ? <HistoryIcon/>
                                            : index === 3 ? <MonetizationOnIcon/>
                                                : index === 4 ? <AttachMoneyIcon/>
                                                    : index === 5 ?<DashboardIcon/>
                                                        : index === 6 ?<SendIcon/>
                                                            : index === 7 ?<MoneyIcon/>
                                                                : index === 8 ?<AccountBalanceWalletIcon/>
                                                                : <ExitToAppIcon/>

                                }
                            </ListItemIcon>
                            <ListItemText primary={text}  />
                        </ListItem>
                    ))}
                </List>
                <Divider />
            </div>
        </>
    )
};
export default DrawerList;
