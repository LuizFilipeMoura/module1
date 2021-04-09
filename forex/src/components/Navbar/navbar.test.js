import React from "react";

import {Navbar} from "./navbar";
import { render, screen} from "@testing-library/react";

describe('The navbarComponent shows ', () => {

    it('amount of dollars the user has on his wallet', () => {
        render(<Navbar></Navbar>);
        expect(screen.getAllByText('$0'));

    });
    it('amount of pounds the user has on his wallet', () => {
        render(<Navbar></Navbar>);
        expect(screen.getAllByText('£0'));
    });
});
