import React from "react";

import {History} from "./history";
import { render, screen} from "@testing-library/react";

describe('The historyPage shows ', () => {

    it('the button to go back trading', () => {
        render(<History></History>);
        expect(screen.getByText('Go Back to Trade', { exact: false })).toBeInTheDocument();
    });

});
