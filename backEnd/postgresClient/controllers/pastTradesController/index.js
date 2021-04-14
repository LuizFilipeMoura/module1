const connect = require('../../dbConnect/db').connect();

//Gets all the past trades for that client
async function get(req, res, next) {
    if(req.body && req.body.clientId){
        const client = (await connect);
        const sql = 'SELECT * FROM pasttrades where client_id = $1';
        const values = [ req.body.clientId];//Query Values

        let clientQuery = await client.query(sql, values); //Executes the query
        res.send(clientQuery);
    } else{
        res.status(400);
        console.log('error! Request Body is not complete');
        res.send('error! Request Body is not complete');
    }
}

//Insert a new trade in the trading history
async function post(req, res, next){

    if(req.body &&
        req.body.to_currency &&
        req.body.from_amount &&
        req.body.to_amount &&
        req.body.from_currency &&
        req.body.client_id &&
        req.body.date ){
        const client =  (await connect);
        const sql = 'INSERT INTO pasttrades (to_currency, from_amount, to_amount,from_currency, client_id, date) VALUES ($1,$2,$3,$4,$5,$6);';
        console.log(req.body);
        const values = [
            req.body.to_currency,
            req.body.from_amount,
            req.body.to_amount,
            req.body.from_currency,
            req.body.client_id,
            req.body.date];//Query Values

        await client.query(sql, values); //Executes the query
        console.log('success');
        res.send('success');
    } else {
        res.status(400);
        console.log('error! Request Body is not complete');
        res.send('error! Request Body is not complete');
    }

}

module.exports = { get, post };
