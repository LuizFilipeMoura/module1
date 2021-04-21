import React from "react";
import Deposit from "../pages/deposit";
import { screen} from "@testing-library/react";
import RouterMock, {customRender} from "./test-utils";
import axios from "axios";
import {DATABASE_URL, DEPOSITS} from "../shared/enviroment";


describe('Deposit page ', () => {
    it('appears', () => {
        const providerProps = {
            value: {isLogged: true}
        };
        customRender(
            <RouterMock>
                <Deposit />
            </RouterMock>
            , { providerProps });
        expect(screen.getByText('Depósito').textContent).toBeDefined()
    });

    it('lists all the deposits', () => {
        return axios.post(DATABASE_URL + DEPOSITS, {id: 1}).then(res => {
            expect(res)
        });
    });
});

