import React from "react";

import {Dashboard} from "./dashboard";
import { render, screen} from "@testing-library/react";

describe('Dashboard is shown', () => {
    it('sell buttons appear', () => {
        render(<Dashboard></Dashboard>);
        expect(screen.getAllByText('Sell'));
    });
    it('buy buttons appear', () => {
        render(<Dashboard></Dashboard>);
        expect(screen.getAllByText('Buy'));
    });
    it('history button appears', () => {
        render(<Dashboard></Dashboard>);
        expect(screen.getByText('Trading History', { exact: false })).toBeInTheDocument();
    });
});
