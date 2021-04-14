import clsx from "clsx";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemIcon from "@material-ui/core/ListItemIcon";
import AccountCircleIcon from "@material-ui/icons/AccountCircle";
import AccountBalanceIcon from "@material-ui/icons/AccountBalance";
import HistoryIcon from "@material-ui/icons/History";
import MonetizationOnIcon from "@material-ui/icons/MonetizationOn";
import AttachMoneyIcon from "@material-ui/icons/AttachMoney";
import DashboardIcon from "@material-ui/icons/Dashboard";
import ListItemText from "@material-ui/core/ListItemText";
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

    let dashboardLabel = router.locale === 'en-US' ? 'Dashboard' : 'Painel';
    let profileLabel= router.locale === 'en-US' ? 'Profile' : 'Perfil';
    let bankInfoLabel= router.locale === 'en-US' ? 'Bank Info' : 'Informações bancárias';
    let depositLabel= router.locale === 'en-US' ? 'Deposit' : 'Depositar';
    let withdrawLabel= router.locale === 'en-US' ? 'Withdraw' : 'Sacar';
    let historyLabel= router.locale === 'en-US' ? 'History' : 'Histórico';

    const toggleDrawer = (anchor, open) => (event) => {//Toggles Side Drawer
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState({ ...state, [anchor]: open });
    };

    return (

        <>
            <div
                className={clsx(classes.list, {
                    [classes.fullList]: 'right' === 'top' || 'right' === 'bottom',
                })}
                role="presentation"
                onClick={toggleDrawer('right', false)}
                onKeyDown={toggleDrawer('right', false)}
            >
                <List>
                    {[profileLabel, bankInfoLabel, historyLabel, withdrawLabel, depositLabel, dashboardLabel].map((text, index) => (
                        <ListItem button key={text} onClick={()=>
                            router.push(router.locale +'/' + (index === 0 ? 'profile'
                                : index === 1 ? 'bank-info'
                                    : index === 2 ? 'history'
                                        : index === 3 ? 'withdraw'
                                            : index === 4 ? 'deposit'
                                                : 'dashboard'))}>
                            <ListItemIcon>
                                {index === 0 ? <AccountCircleIcon />
                                    : index === 1 ? <AccountBalanceIcon />
                                        : index === 2 ? <HistoryIcon/>
                                            : index === 3 ? <MonetizationOnIcon/>
                                                : index === 4 ? <AttachMoneyIcon/>
                                                    : <DashboardIcon/>
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
