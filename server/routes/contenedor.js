// Importamos Express
const express = require('express');

// Importamos Acceso BD
const db = require('../db/connect_db');

//Importamos Middlewares
const { validaToken } = require('../middlewares/autenticacion');

// Usamos Express
const app = express();

// ======== ENDPOINTS =========
// ============================

app.get('/contenedor', async (req, res) => {
    // HTTP Header
    let header = req.headers;

    // HTTP Body
    let body = req.body;

    // HTTP Query Params
    let params = req.query;

    // query
    let query = `select * from frame.contenedor_info(${params.id_conten}, null)`;
    
    try {
        // Conectar y Ejecutar Query
        const queryResult = await db.query(query);
        const dataResult = queryResult.rows[0];
        
        // No Existe Data?
        if (!dataResult) {
            // Respuesta (Bad Request - 400)
            return res.status(400).json({
                error: { message: 'No Existe el contenedor' }
            });
        };

        // Respuesta (OK - 200)
        res.status(200).json(dataResult);
    } catch (e) {
        // Respuesta (Internal Sever Error - 500)
        return res.status(500).json({
            valid: false,
            query: query,
            error: e,
            stack_err: e.stack
        });
    }
});

app.get('/contenedor/search', async (req, res) => {
    // HTTP Header
    let header = req.headers;

    // HTTP Body
    let body = req.body;

    // HTTP Query Params
    let params = req.query;

    // query
    let query = `select * from frame.contenedor_search(${params.tipo_busqueda} , '${params.dato_busqueda}', null)`;
    
    try {
        // Conectar y Ejecutar Query
        const queryResult = await db.query(query);
        const dataResult = queryResult.rows;
        
        // No Existe Data?
        if (!dataResult) {
            // Respuesta (Bad Request - 400)
            return res.status(400).json({
                error: { message: 'No Existe el contenedor' }
            });
        };

        // Respuesta (OK - 200)
        res.status(200).json(dataResult);
    } catch (e) {
        // Respuesta (Internal Sever Error - 500)
        return res.status(500).json({
            valid: false,
            query: query,
            error: e,
            stack_err: e.stack
        });
    }
});

// ============================
// ============================

module.exports = app;