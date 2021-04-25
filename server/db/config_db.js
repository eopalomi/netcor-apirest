// Heroku App Conexion DB
// const pg_herokuapp = {
//     host: 'ec2-34-204-121-199.compute-1.amazonaws.com',
//     database: 'db7vjotkm3j8b0',
//     port: '5432',
//     user: 'kamasubvsaxbzv',
//     password: 'daa48e7edb9156c86de978d8989260f3fd4d925debedce878f257a395e96cf3a',
//     dialect: "postgres",
//     ssl: {
//         require: true,
//         rejectUnauthorized: false
//     }
// };

// const pg_sjserviapp = {
//     host: '95.111.235.214',
//     database: 'postgres',
//     port: '32772',
//     user: 'userpostgres',
//     password: 'passpostgres',
//     dialect: "postgres",
//     ssl: false
// };

// const pg_herokuapp = {
//     host: 'localhost',
//     database: 'heroku_restaurado',
//     port: '5433',
//     user: 'postgres',
//     password: 'acceso123',
//     dialect: "postgres",
//     ssl: false
// };

// const pg_sjserviapp = {
//     host: 'localhost',
//     database: 'sjservi_restaurado',
//     port: '5433',
//     user: 'postgres',
//     password: 'acceso123',
//     dialect: "postgres",
//     ssl: false
// };

const pg_herokuapp = {
    host: '172.17.0.2',
    database: 'frame_app',
    port: '5432',
    user: 'postgres',
    password: 'acceso123',
    dialect: "postgres",
    ssl: false
};

const pg_sjserviapp = {
    host: '172.17.0.2',
    database: 'sjservi',
    port: '5432',
    user: 'postgres',
    password: 'acceso123',
    dialect: "postgres",
    ssl: false
};

module.exports = {
    pg_herokuapp,
    pg_sjserviapp
};