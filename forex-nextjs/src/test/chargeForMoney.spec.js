import React from "react";
import ChargeForMoney from "../pages/chargeForMoney";
import { screen} from "@testing-library/react";
import RouterMock, {customRender} from "./test-utils";



describe('ChargeForMoney page ', () => {
    it('appears', () => {
        const providerProps = {
            value: {isLogged: true}
        };
        customRender(
            <RouterMock>
                <ChargeForMoney />
            </RouterMock>
            , { providerProps });
        expect(screen.getByText('Cobrar').textContent).toBeDefined()
    });

});

