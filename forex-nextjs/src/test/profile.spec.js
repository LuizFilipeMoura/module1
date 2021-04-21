import React from "react";
import Profile from "../pages/profile";
import { screen} from "@testing-library/react";
import RouterMock, {customRender} from "./test-utils";


describe('Profile page ', () => {
    it('appears', () => {
        const providerProps = {
            value: {isLogged: true}
        };
        customRender(
            <RouterMock>
                <Profile />
            </RouterMock>
            , { providerProps });
        expect(screen.getByText('Perfil').textContent).toBeDefined()
    });

});
