
async function connect() {
    if (global.connection)
        return global.connection.connect();


    //Configuring the pool connection
    const { Pool } = require('pg');
    const pool = new Pool({
        host: 'localhost',
        user: 'postgres',
        password: 'postgres',
        database: 'forex'
    });

    //Storing the connection
    global.connection = pool;
    return pool.connect();
}

module.exports.connect = connect;
