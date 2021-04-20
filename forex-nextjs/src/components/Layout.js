import Navbar from "./Navbar";
import {useAppContext} from "../shared/AppWrapper";
import React from "react";

const Layout = ({children}) =>{
    let context = useAppContext();
    return(
        <div>
            {/*Sets the navbar for all the pages*/}
            <Navbar currencies={context.currencies} wallet={context.wallet} client={context.client}/>
                {children}
        </div>
    );
};

export default Layout;
