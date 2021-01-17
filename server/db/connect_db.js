// Importamos Postgres
const { Pool } = require('pg');

// Importamos Conexiones de Base de Datos
const config = require('./config_db');

// Creamos un Pool de Conexion
const pool = new Pool(config.pg_herokuapp);

module.exports = {
    query: (text, params) => pool.query(text, params).catch(res =>{
        console.log("error ejecutar query", res.stack);

        return res;
    })
} 