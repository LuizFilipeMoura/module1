import React from "react";
import BankInfo from "../pages/bank-info";
import { screen} from "@testing-library/react";
import RouterMock, {customRender} from "./test-utils";


describe('BankInfo page ', () => {
    it('appears', () => {
        const providerProps = {
            value: {isLogged: true, client: { bank_number: 1, account_number: 1 }}
        };
        customRender(
            <RouterMock>
                <BankInfo />
            </RouterMock>
            , { providerProps });
        expect(screen.getByText('Informações Bancárias').textContent).toBeDefined()
    });

});
