import React from "react";
import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import DrawerList from "./Drawer";
import {makeStyles} from "@material-ui/core/styles";

const useStyles = makeStyles({//Define the style of the page
    list: {
        width: 250,
    },
    paper: {
        background: "#a91c1c"
    }
});
const Navbar = ({currencies, wallet, client}) => {
    const classes = useStyles();

    const [state, setState] = React.useState({
        left: false,
    });

    const toggleDrawer = (anchor, open) => (event) => {//Toggles Side Drawer
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState({ ...state, [anchor]: open });
    };

    return(
        <div className="m-2 row ">
            {console.log(wallet)
            }
        {['right'].map((anchor) => (
            <React.Fragment key={anchor} >
                <Button onClick={toggleDrawer(anchor, true)} key={anchor}>{client?.name}</Button>
                <Drawer anchor={anchor} open={state[anchor]} onClose={toggleDrawer(anchor, false)} classes={{paper: classes.paper}} key={anchor}>
                    <DrawerList props={state[anchor]} key={anchor}/>
                </Drawer>
            </React.Fragment>
        ))}
        {currencies? currencies.map((currency) => (
            <div className="m-2" key={currency[0]}>
                <p className="h5" key={currency[0]}>
                    {/*Gets the symbol*/}
                    <small key={currency[0]}>{currency[1]}</small>
                    {/*Gets the value on the wallet*/}
                    {wallet[currency[2]+'amount']?.toFixed(2)}
                </p>
            </div>
        )): ''}
    </div>
    )

};
export default Navbar;
