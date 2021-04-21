import React from "react";
import Index from "../pages/index";
import { screen} from "@testing-library/react";
import RouterMock, {customRender} from "./test-utils";


describe('Index page ', () => {
    it('appears', () => {
        const providerProps = {
            value: {isLogged: false, loggout: jest.fn()}
        };
        customRender(
            <RouterMock>
                <Index />
            </RouterMock>
            , { providerProps });
        expect(screen.getAllByText('Entrar')[0].textContent).toBeDefined()
    });

});
