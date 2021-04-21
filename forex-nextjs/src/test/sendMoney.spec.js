import React from "react";
import SendMoney from "../pages/sendmoney";
import { screen} from "@testing-library/react";
import RouterMock, {customRender} from "./test-utils";
import axios from "axios";
import {CLIENTS, DATABASE_URL} from "../shared/enviroment";


describe('SendMoney page ', () => {

    it('appears', () => {
        const providerProps = {
            value: {isLogged: true}
        };
        customRender(
            <RouterMock>
                <SendMoney />
            </RouterMock>
            , { providerProps });
        expect(screen.getAllByText('Enviar dinheiro')[0].textContent).toBeDefined()
    });

    it('lists all the users', () => {
        return axios.get(DATABASE_URL + CLIENTS).then(res => {
            expect(res)
        });
    });

});

