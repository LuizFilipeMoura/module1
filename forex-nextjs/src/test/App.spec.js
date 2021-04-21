import axios from "axios";
import {DATABASE_URL, WALLETS} from "../shared/enviroment";

describe('The app ', () => {
    it('receives wallet from database', () => {
        return axios.post(DATABASE_URL + WALLETS, {wallet_id: 1}).then(res => {
            expect(res.data)
        });
    });
});
