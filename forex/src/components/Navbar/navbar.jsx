import React, {Component} from "react";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet,faDollarSign,faPoundSign } from '@fortawesome/free-solid-svg-icons'

const walletIco = <FontAwesomeIcon icon={faWallet} />;
const dollarIco = <FontAwesomeIcon icon={faDollarSign} />;
const poundIco = <FontAwesomeIcon icon={faPoundSign} />;


export class Navbar extends Component{

    render() {
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
                                {dollarIco}{this.props.dollarAmount? Number(this.props.dollarAmount).toFixed(2) : '$0'}
                            </a>
                        </li>
                        <li className="nav-item me-3 me-lg-0">
                            <a className="nav-link">
                                {poundIco}{this.props.poundAmount? Number(this.props.poundAmount).toFixed(2): '£0'}
                            </a>
                        </li>
                    </ul>
                </div>
            </nav>
            );
    }
}
