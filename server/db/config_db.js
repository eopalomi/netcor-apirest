// Heroku App Conexion DB
const pg_herokuapp = {
    //host: '165.227.68.255',
    host: 'dbframe_pg14',
    database: 'frame',
    port: '5432',
    //port: '5438',
    user: 'root',
    password: 'root',
    dialect: "postgres",
    ssl: false
    // ssl: {
    //     require: true,
    //     rejectUnauthorized: false
    // }
};

const pg_sjserviapp = {
    //host: '165.227.68.255',
    host: 'dbframe_pg14',
    database: 'frame',
    port: '5432',
    //port: '5438',
    user: 'root',
    password: 'root',
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