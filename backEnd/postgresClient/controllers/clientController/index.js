const connect = require('../../dbConnect/db').connect();

//Gets the client that have those values as email and password
async function signIn(req, res, next) {
    if(req.body && req.body.email && req.body.password){
        const client = (await connect);
        const sql = 'SELECT * FROM clients where email = $1 AND password = $2';
        const emailSql = 'SELECT * FROM clients where email = $1';
        const values = [ req.body.email, req.body.password];//Query Values
        let fullQuery = await client.query(sql, values); //Executes the query
        let emailQuery = await client.query(emailSql, [ req.body.email]); //Executes the query

        if(emailQuery.rows <=0){
            res.send('Email wrong');
        } else if (fullQuery.rows<=0){
            res.send('Password wrong');
        } else {
            res.send(fullQuery.rows[0]);
        }

    } else{
        console.log('error! Request Body is not complete');
        res.send('error! Request Body is not complete');
    }
}

//Insert a new client
async function signUp(req, res, next){
    if(req.body && req.body.name && req.body.email && req.body.password){//If the emails is taken the user cannot use the same email address
        const emailQuery = 'SELECT * FROM clients where email = $1';
        const client =  (await connect);

        let email = await client.query(emailQuery, [req.body.email]); //Executes the query
        if(email.rowCount>0){
            res.send('Email taken');
        }else{
            const sql = 'INSERT INTO clients (name, email, password) VALUES ($1,$2,$3);';

            const values = [ req.body.name, req.body.email, req.body.password ]; //Query Values

            await client.query(sql, values); //Executes the query
            console.log('success');
            res.send('success');
        }

    } else {
        console.log('error! Request Body is not complete');
        res.send('error! Request Body is not complete');
    }

}

module.exports = { signIn, signUp };
