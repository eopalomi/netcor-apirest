// Heroku App Conexion DB
const pg_herokuapp = {
    host: 'ec2-3-209-44-49.compute-1.amazonaws.com',
    database: 'da45fgelf1rq0a',
    port: '5432',
    user: 'uhfxqfrwdobcef',
    password: '6c5e1e478a93f80fecd5ed034dd07dbe54bc3ee2e125c48a9c9dde2575973c1a',
    dialect: "postgres",
    ssl: {
        require: true,
        rejectUnauthorized: false
    }
};

const pg_sjserviapp = {
    host: '95.111.235.214',
    database: 'postgres',
    port: '32772',
    user: 'userpostgres',
    password: 'passpostgres',
    dialect: "postgres",
    ssl: false
};

// VPS
// const pg_herokuapp = {
//     host: 'postgres_db',
//     database: 'frame',
//     port: '5432',
//     user: 'postgres',
//     password: 'example',
//     dialect: "postgres",
//     ssl: false
// };

// const pg_sjserviapp = {
//     host: 'postgres_db',
//     database: 'sjservi',
//     port: '5432',
//     user: 'postgres',
//     password: 'example',
//     dialect: "postgres",
//     ssl: false
// };


// LOCALHOST
// const pg_herokuapp = {
//     host: 'localhost',
//     database: 'frame',
//     port: '52563',
//     user: 'postgres',
//     password: 'example',
//     dialect: "postgres",
//     ssl: false
// };

// const pg_sjserviapp = {
//     host: 'localhost',
//     database: 'sjservi',
//     port: '52563',
//     user: 'postgres',
//     password: 'example',
//     dialect: "postgres",
//     ssl: false
// };

module.exports = {
    pg_herokuapp,
    pg_sjserviapp
};