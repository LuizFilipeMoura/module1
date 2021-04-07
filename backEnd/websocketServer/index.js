//Imports the libs to be used

const WebSocket = require('ws');
const axios = require('axios');
const TRADE_API = "http://api.currencylayer.com/live?access_key=b1b6ccf70a7b18329dda7bd8f88b225f&currencies=USD,GBP&format=1";

//Open the server
const wss = new WebSocket.Server({ port: 8001 });
console.log("Server open in port 8001");

//Handles the connection to the websocket
wss.on('connection', function connection(ws) {


    // getQuoteRightNow()
    //     .then(response => {
    //         rate = response.data.quotes.USDGBP;
    //         console.log(rate);
    if(ws){
        ws.send(rate);    ws.on('message', function incoming(message) {
            console.log('received: %s', message);
        });
    }
    //     })
    //     .catch(err => {
    //         console.log("oppps", err);
    //     });
    ready(ws);
});

//Access the trading rate API
function getQuoteRightNow(){
    return axios.get(TRADE_API);
}
let rate = 0.7;

//Set the interval to maintain the value as realtime as possible
let ready = function(ws) {
    setInterval(function(){
        // getQuoteRightNow()
        //     .then(response => {
        //         rate = response.data.quotes.USDGBP;
        //         console.log(rate);
        if(ws){
            ws.send(rate);
        }
        // })
        // .catch(err => {
        //     console.log("oppps", err);
        // });

    }, 60000);
};
