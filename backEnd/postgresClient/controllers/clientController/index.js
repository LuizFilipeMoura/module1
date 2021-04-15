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
    if(req.body && req.body.name && req.body.email && req.body.password && req.body.birthdate){//If the emails is taken the user cannot use the same email address
        const emailQuery = 'SELECT * FROM clients where email = $1';
        const client =  (await connect);

        let email = await client.query(emailQuery, [req.body.email]); //Executes the query
        if(email.rowCount>0){
            res.send('Email taken');
        }else{
            const sql = 'INSERT INTO clients (name, email, password, birthdate) VALUES ($1,$2,$3, $4);';

            const values = [ req.body.name, req.body.email, req.body.password, req.body.birthdate ]; //Query Values

            await client.query(sql, values); //Executes the query
            console.log('success');
            res.send('success');
        }

    } else {
        console.log('error! Request Body is not complete');
        res.send('error! Request Body is not complete');
    }

}

//Updates the values of the client
async function put(req, res, next){
    console.log(req.body);
        const sql = 'UPDATE clients set name = $1, email = $2, birthdate =$3, bank_number =$4, account_number = $5 where id = $6';

        const values = [ req.body.name, req.body.email, req.body.birthdate, req.body.bank_number, req.body.account_number, req.body.id ]; //Query Values
        const client =  (await connect);

        await client.query(sql, values); //Executes the query
        console.log('success');
        res.send('success');
}
async function get(req, res, next){
    const sql = 'SELECT id,name, email from clients';
    const client =  (await connect);
    let result = await client.query(sql); //Executes the query
    console.log();
    console.log('success');
    res.send(result.rows);
}

module.exports = { signIn, signUp, put, get };
