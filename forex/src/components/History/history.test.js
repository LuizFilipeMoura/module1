import React from "react";

import {History} from "./history";
import { render, screen} from "@testing-library/react";
import axios from "axios";
import {DATABASE_API} from "../../shared/enviroment";


describe('The historyPage shows ', () => {

    it('the button to go back trading',  () => {
        render(<History></History>);
        expect(screen.getByText('Go Back to ', { exact: false })).toBeInTheDocument();
    });

    it('the table header', async () => {
        render(<History></History>);
        expect(await screen.getByText('Date', { exact: false })).toBeInTheDocument();
    });


});

describe('The historyPage ', () => {

    it('receives data from database', () => {
        return axios.get(DATABASE_API).then(res => {
            expect(res)
        });
    });

});
