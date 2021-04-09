import React from "react";

import {AmountInput} from "./amountInput";

import { render, screen} from "@testing-library/react";

describe('The amountInput shows ', () => {
    it('renders the input', () => {
        render(<AmountInput></AmountInput>);
        expect(screen.getByAltText('Amount of currency you want to trade')).toBeInTheDocument();
    });
});
