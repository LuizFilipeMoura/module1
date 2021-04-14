import React from "react";
import Navbar from "../components/Navbar";
import { useAppContext} from "../shared/AppWrapper";

export default function History (){
    let context = useAppContext();
    return(
        <div>
            <h1>HISTORY WORKS</h1>
        </div>
    )
}
