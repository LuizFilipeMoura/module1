const connect = require('../../dbConnect/db').connect();

//Gets all the past trades for that client

async function post(req, res, next) {
    console.log(req.body);
    if(req.body && req.body.id){
        const client = (await connect);
        const sql = 'SELECT * FROM deposits where client_id = $1';
        const values = [ req.body.id];//Query Values

        let clientQuery = await client.query(sql, values); //Executes the query
        res.send(clientQuery);
    } else{
        res.status(400);
        console.log('error! Request Body is not complete');
        res.send('error! Request Body is not complete');
    }
}

async function put(req, res, next){
    if(req.body &&
        req.body.amount &&
        req.body.currency &&
        req.body.id){
        const client =  (await connect);
        const sql = 'INSERT INTO deposits ( client_id, currency, amount) VALUES ($1,$2,$3);';
        console.log(req.body);
        const values = [
            req.body.id,
            req.body.currency,
            req.body.amount];//Query Values

        await client.query(sql, values); //Executes the query
        console.log('success');
        res.send('success');
    } else {
        res.status(400);
        console.log('error! Request Body is not complete');
        res.send('error! Request Body is not complete');
    }

}
module.exports = { post, put };
