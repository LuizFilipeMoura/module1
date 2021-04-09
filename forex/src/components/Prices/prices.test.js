import React from "react";

import {Prices} from "./prices";
import { render, screen} from "@testing-library/react";

describe('The priceComponent shows ', () => {
    it('selling button', () => {
        render(<Prices></Prices>);
        expect(screen.getByText('Sell')).toBeInTheDocument();
    });

    it('buying button', () => {
        render(<Prices></Prices>);
        expect(screen.getByText('Buy')).toBeInTheDocument();
    });

    it('USD price', () => {
        render(<Prices></Prices>);
        expect(screen.getAllByText('$1', { exact: false }));
    });
    it('GBP price', () => {
        render(<Prices></Prices>);
        expect(screen.getAllByText('£1', { exact: false }));
    })
});
