import React from "react";

import {History} from "./history";
import { render, screen} from "@testing-library/react";

describe('The historyPage shows ', () => {

    it('the button to go back trading',  () => {
        render(<History></History>);
        expect(screen.getByText('Go Back to ', { exact: false })).toBeInTheDocument();
    });

    it('the table header', () => {
        render(<History></History>);
        expect(screen.getByText('Date', { exact: false })).toBeInTheDocument();
    });

    it('the table header', async () => {
        render(<History></History>);
        expect(await screen.getByText('Date', { exact: false })).toBeInTheDocument();
    });

});
