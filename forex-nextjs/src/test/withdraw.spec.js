import React from "react";

import Withdraw from "../pages/withdraw";
import { screen} from "@testing-library/react";
import RouterMock, {customRender} from "./test-utils";
import axios from "axios";
import {DATABASE_URL,  WITHDRAWS} from "../shared/enviroment";


describe('Withdraw page ', () => {
    it('appears', () => {
        const providerProps = {
            value: {isLogged: true}
        };
        customRender(
            <RouterMock>
                <Withdraw />
            </RouterMock>
            , { providerProps });
        expect(screen.getByText('Saque').textContent).toBeDefined()
    });

    it('lists all the Withdraws', () => {
        return axios.post(DATABASE_URL + WITHDRAWS, {id: 1}).then(res => {
            expect(res)
        });
    });
});

