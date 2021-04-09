import React from "react";

import {Dashboard} from "./dashboard";
import { render, screen} from "@testing-library/react";
import {WEBSOCKET} from "../../shared/enviroment";
import {w3cwebsocket as W3CWebSocket} from "websocket/lib/websocket";

describe('Dashboard is shown ', () => {
    it('sell buttons appear', () => {
        render(<Dashboard></Dashboard>);
        expect(screen.getAllByText('Sell'));
    });
    it('buy buttons appear', () => {
        render(<Dashboard></Dashboard>);
        expect(screen.getAllByText('Buy'));
    });
    it('history button appears', () => {
        render(<Dashboard></Dashboard>);
        expect(screen.getByText('Trading History', { exact: false })).toBeInTheDocument();
    });
});

describe('The dashboard ', () => {
    it(' connects to the websocket', (done) => {
        const client = new W3CWebSocket(WEBSOCKET);
        client.onopen = () => {
            done();
        };
    });
    it(' receives data from websocket', () => {
        const client = new W3CWebSocket(WEBSOCKET);
        client.onmessage = (message) => {
            expect(Number(message.data)).toBeValid()
        };
    });


});
