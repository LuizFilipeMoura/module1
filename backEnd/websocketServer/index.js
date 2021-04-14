//Imports the libs to be used

const WebSocket = require('ws');
const axios = require('axios');
const TRADE_API = "https://openexchangerates.org/api/latest.json?app_id=fefd1e002fa444cba0ca8a211cde33a3";
const oxr = require('open-exchange-rates');
const  fx = require('money');

oxr.set({ app_id: 'fefd1e002fa444cba0ca8a211cde33a3' });

//Open the server
const wss = new WebSocket.Server({ port: 8001 });
console.log("Server open in port 8001");
let infoBundle = {}
    = { usdTOgbp: 0.728646, usdTOeur: 0.840607, usdTObrl: 5.733826 }
    ;

//Handles the connection to the websocket, calls the schedueler caller of the API
wss.on('connection', function connection(ws) {

    ws.send('Hello');
    console.log('sent hello');
    // getQuoteRightNow()
    //     .then(response => {
    //         rate = response.data.quotes.USDGBP;
    //         console.log(rate);
            if(ws){
                // getCurrencyRateList('EUR').then(r => ws.send(r))
                // teste;
                // getLastest();
                ws.send(JSON.stringify(infoBundle));
                console.log(infoBundle)
            }
        // })
        // .catch(err => {
        //     console.log("oppps", err);
        // });

    schedueler(ws);
});

//Access the trading rate API
const getLastest = ()=> oxr.latest(function(error) {
    console.log(oxr);
    infoBundle.usdTOgbp = oxr.rates['GBP'];
    infoBundle.usdTOeur = oxr.rates['EUR'];
    infoBundle.usdTObrl = oxr.rates['BRL'];

    console.log('atualizou')
});

//Set the interval to maintain the value as realtime as possible
let schedueler = function(ws) {
    setInterval(function(){
    //     getQuoteRightNow()
    //         .then(response => {
    //             rate = response.data.quotes.USDGBP;
    //             console.log(rate);
                if(ws){
                    ws.send(JSON.stringify(infoBundle));
                }
        // })
        // .catch(err => {
        //     console.log("oppps", err);
        // });

    }, 360000);
};
