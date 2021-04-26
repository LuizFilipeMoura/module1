import React from "react";
import {useLabels} from "../shared/labels";

export default function Alert({props}) {
    let labels = useLabels().labels;

    return(<div className="m-2 d-flex justify-content-center align-items-center ">
        {
            props === 'success'?
                <div className="alert alert-success" role="alert">
                    {labels.successTransactionLabel}
                </div>
                : props === 'fail' ?
                <div className="alert alert-danger" role="alert">
                    {labels.failTransactionLabel}
                </div>
                : ''
        }
    </div>)

}
