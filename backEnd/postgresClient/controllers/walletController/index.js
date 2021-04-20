const connect = require('../../dbConnect/db').connect();

//Gets the wallet of that client
async function post(req, res, next) {
    console.log(req.body);
    if(req.body && req.body.wallet_id){
        const client = (await connect);
        const sql = 'SELECT * FROM wallets where id = $1';
        const values = [ req.body.wallet_id ]; //Query Values
        let clientQuery = await client.query(sql, values); //Executes the query
        res.send(clientQuery);
    } else{
        res.status(400);
        console.log('error! Request Body is not complete');
        res.send('error! Request Body is not complete');
    }
}

//Updates the wallet for that given walletId
async function put(req, res, next){

    console.log(req.body);
    if(req.body  && req.body.client_id){
        const client =  (await connect);
        const sql = 'UPDATE wallets set dollarAmount = $1, poundamount = $2, euroamount = $3, realamount=$4 where client_id = $5';
        const values = [ req.body.dollaramount? req.body.dollaramount : 0,
            req.body.poundamount? req.body.poundamount : 0,
            req.body.euroamount? req.body.euroamount : 0,
            req.body.realamount? req.body.realamount : 0, req.body.client_id]; // Query values

        await client.query(sql, values); //Executes the query
        console.log('success');
        res.send('success');

    } else {
        res.status(400);
        console.log('error! Request Body is not complete');
        res.send('error! Request Body is not complete');
    }
}

module.exports = { post, put,};
