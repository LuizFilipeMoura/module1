import React  from 'react'
import { render, screen } from '@testing-library/react'
import History from "../pages/history";
import RouterMock from "./test-utils";
import axios from "axios";
import {DATABASE_URL, PASTTRADES} from "../shared/enviroment";


describe('The historyPage shows', () => {

    it('the table of past trades',  () => {
        render(<RouterMock><History/></RouterMock>);
        expect(screen.getAllByText('Delete')[0].textContent).toBeDefined()
    });

});

describe('The historyPage ', () => {
    it('receives data from database', () => {
        return axios.post(DATABASE_URL + PASTTRADES, {id: 1}).then(res => {
            expect(res)
        });
    });
});


export default RouterMock
