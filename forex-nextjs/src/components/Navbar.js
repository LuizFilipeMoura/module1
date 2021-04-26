import Button from "@material-ui/core/Button";
import Drawer from "@material-ui/core/Drawer";
import DrawerList from "./Drawer";
import React, {useEffect} from "react";
import {useAppContext} from "../shared/AppWrapper";
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

    let context = useAppContext();
    const classes = useStyles();
    const [state, setState] = React.useState({
        left: false,
    });
    const [once, setOnce] = React.useState(true);

    useEffect(() => { //Stores the user in the localstorage
        if(once){
            context.updateContext(context);
            setOnce(false);
        }
    });

    const toggleDrawer = (anchor, open) => (event) => {//Toggles Side Drawer
        if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
            return;
        }
        setState({ ...state, [anchor]: open });
    };

    //If the wallet exists, show it to the user
    if(wallet && Object.entries(wallet).length !== 0) //Shows the navbar just when there are values inside the wallet

    return(
            <div className="m-2 row ">
                {}
                <React.Fragment >
                    <Button onClick={toggleDrawer('right', true)}>{client?.name}</Button>
                    <Drawer anchor='right' open={state['right']} onClose={toggleDrawer('right', false)} classes={{paper: classes.paper}}>
                        <DrawerList/>
                    </Drawer>
                </React.Fragment>

            {/*    Show the amount of each currency*/}
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
    return(<div/>)

};
export default Navbar;

