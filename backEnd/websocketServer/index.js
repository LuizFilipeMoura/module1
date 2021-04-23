//Imports the libs to be used

const WebSocket = require('ws');
const oxr = require('open-exchange-rates');

oxr.set({ app_id: 'fefd1e002fa444cba0ca8a211cde33a3' });

//Open the server
const wss = new WebSocket.Server({ port: 8001 });
console.log("Server open in port 8001");
let infoBundle = {} = { usdTOgbp: 0.728646, usdTOeur: 0.840607, usdTObrl: 5.733826 };

//Handles the connection to the websocket, calls the schedueler caller of the API
wss.on('connection', function connection(ws) {

    console.log('Conected');

    if(ws){
        // getLastest();
        ws.send(JSON.stringify(infoBundle));
    }

    schedueler(ws);
});

//Access the trading rate API
const getLastest = ()=> oxr.latest(function(error) {
    infoBundle.usdTOgbp = oxr.rates['GBP'];
    infoBundle.usdTOeur = oxr.rates['EUR'];
    infoBundle.usdTObrl = oxr.rates['BRL'];
});

//Set the interval to maintain the value as realtime as possible
let schedueler = function(ws) {
    setInterval(function(){

        if(ws){
            // getLastest();
            ws.send(JSON.stringify(infoBundle));
        }

    }, 360000);
};
