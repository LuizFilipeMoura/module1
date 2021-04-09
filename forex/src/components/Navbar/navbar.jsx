import React, { useContext} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet,faDollarSign,faPoundSign } from '@fortawesome/free-solid-svg-icons'
import WalletContext from "../../context/wallet";

const walletIco = <FontAwesomeIcon icon={faWallet} />;
const dollarIco = <FontAwesomeIcon icon={faDollarSign} />;
const poundIco = <FontAwesomeIcon icon={faPoundSign} />;

export function Navbar(){
    const wallet = useContext(WalletContext);

    return (
        // NavBar
        <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
                <ul className="navbar-nav d-flex flex-row">
                    <li className="nav-item me-3 me-lg-0">
                        <a className="nav-link">
                            {walletIco}
                        </a>
                    </li>
                    {/*The icons and the value in the user's wallet*/}
                    <li className="nav-item me-3 me-lg-0">
                        <a className="nav-link">
                            {dollarIco}
                            {/*Consumes the Context API for the amount of dollars in the users wallet*/}
                            <span>{wallet.dollarAmount ? Number(wallet.dollarAmount).toFixed(2) : '$0'}</span>
                        </a>
                    </li>
                    <li className="nav-item me-3 me-lg-0">
                        <a className="nav-link">
                            {poundIco}
                            {/*Consumes the Context API for the amount of pounds in the users wallet*/}
                            <span>{wallet.poundAmount ? Number(wallet.poundAmount).toFixed(2) : '£0'}</span>
                        </a>
                    </li>
                </ul>
            </div>
        </nav>
        );
}
Navbar.contextType = Navbar;
