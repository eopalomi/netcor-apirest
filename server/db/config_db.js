// Heroku App Conexion DB
const pg_herokuapp = {
    host: 'ec2-34-204-121-199.compute-1.amazonaws.com',
    database: 'db7vjotkm3j8b0',
    port: '5432',
    user: 'kamasubvsaxbzv',
    password: 'daa48e7edb9156c86de978d8989260f3fd4d925debedce878f257a395e96cf3a',
    dialect: "postgres",
    ssl: {
        require: true,
        rejectUnauthorized: false
    }
};

module.exports = {
    pg_herokuapp
};