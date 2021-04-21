import React from "react";
import Dashboard from "../pages/dashboard";
import { screen} from "@testing-library/react";
import {w3cwebsocket as W3CWebSocket} from "websocket/lib/websocket";
import RouterMock, {customRender} from "./test-utils";
import {WEBSOCKET_URL} from "../shared/enviroment";


describe('Dashboard appears ', () => {
    it('sell buttons appear', () => {
        const providerProps = {
            value: {isLogged: true, }
        };
        customRender(
            <RouterMock>
                <Dashboard />
            </RouterMock>
            , { providerProps });
        expect(screen.getByText('Painel').textContent).toBeDefined()
    });

});

describe('The dashboard ', () => {
    it(' connects to the websocket', (done) => {
        const client = new W3CWebSocket(WEBSOCKET_URL);
        client.onopen = () => {
            done();
        };
    });
    it(' receives data from websocket', () => {
        const client = new W3CWebSocket(WEBSOCKET_URL);
        client.onmessage = (message) => {
            expect(Number(message.data)).toBeValid()
        };
    });

});
