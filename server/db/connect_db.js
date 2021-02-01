// Importamos Postgres
const { Pool } = require('pg');

// Importamos Conexiones de Base de Datos
const config = require('./config_db');

// Creamos un Pool de Conexion
const pool = new Pool(config.pg_herokuapp);
const pool_sjservi = new Pool(config.pg_sjserviapp);

module.exports = {
    query: (text, params) => pool.query(text, params).catch(res =>{
        //console.log("error ejecutar query", res);
        throw new Error(res);
    }),
    connect: (db, query, params) => {
        if (db === 'sjservi'){
            return pool_sjservi.query(query, params).catch( res =>{
                throw new Error(res);
            })      
        }
    }
}