import axios from "axios";
import {DATABASE_API, WEBSOCKET} from "./shared/enviroment";
import {w3cwebsocket as W3CWebSocket} from "websocket/lib/websocket";

describe('The dashboard ', () => {
    it('receives data from database', () => {
        return axios.get(DATABASE_API + '/wallet').then(res => {
            expect(res.data)
        });
    });

});
