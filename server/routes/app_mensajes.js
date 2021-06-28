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

app.get('/app/messages', async (req, res) => {
    // HTTP Header
    let header = req.headers;

    // HTTP Body
    let body = req.body;

    // HTTP Query Params
    let params = req.query;

    // query
    //let query = `select * from frame.contenedor_search(${params.tipo_busqueda} , '${params.dato_busqueda}', null)`;
    let query = `select * from public.user_messages('${params.usu_cod}', null);`;
    
    try {
        // Conectar y Ejecutar Query
        const queryResult = await db.query(query);
        const dataResult = queryResult.rows[0].user_messages;
        
        // No Existe Data?
        if (!dataResult) {
            // Respuesta Vacia (Bad Request - 200)
            return res.status(200).json({
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