import React from "react";
import SignUp from "../pages/sign-up";
import { screen} from "@testing-library/react";
import RouterMock, {customRender} from "./test-utils";


describe('SignUp page ', () => {
    it('appears', () => {
        const providerProps = {
            value: {isLogged: false, loggout: jest.fn()}
        };
        customRender(
            <RouterMock>
                <SignUp />
            </RouterMock>
            , { providerProps });
        expect(screen.getAllByText('Cadastrar')[0].textContent).toBeDefined()
    });

});
