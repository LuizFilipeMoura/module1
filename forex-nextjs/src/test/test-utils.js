import { RouterContext } from 'next/dist/next-server/lib/router-context'
import PropTypes from 'prop-types'
import React, { useState } from 'react'
import Router from 'next/router'
import {render} from "@testing-library/react";
import {AppContext} from "../shared/AppWrapper";

//Mocks a router for the useRouter functions
function RouterMock({ children }) {
    const [pathname, setPathname] = useState('/');

    const mockRouter = {
        pathname,
        prefetch: () => {},
        push: async newPathname => {
            setPathname(newPathname)
        }
    };

    Router.router = mockRouter;

    return (
        <RouterContext.Provider value={mockRouter}>
            {children}
        </RouterContext.Provider>
    )
}

RouterMock.propTypes = {
    children: PropTypes.node.isRequired
};

//Generates custom renders using the AppContext
export const customRender = (ui, { providerProps, ...renderOptions }) => {
    providerProps.value.currencies = [['GBP', '£', 'pound'], ['USD', '$', 'dollar'], ['EUR', '€', 'euro'], ['BRL', 'R$', 'real']];
    return render(
        <AppContext.Provider {...providerProps }>{ui}</AppContext.Provider>,
        renderOptions
    )
};

export default RouterMock
