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

app.get('/rutas', async (req, res) => {
    // HTTP Header
    let header = req.headers;

    // HTTP Body
    let body = req.body;

    // query
    let query = `select * from routes.routes_list(null, null)`;
    
    try {
        // Conectar y Ejecutar Query
        const queryResult = await db.query(query);
        const dataResult = queryResult.rows[0];
        
        // No Existe Data?
        if (!dataResult) {
            // Respuesta (Bad Request - 400)
            return res.status(400).json({
                error: { message: 'No Existen rutas' }
            });
        };

        // Respuesta (OK - 200)
        res.status(200).json(dataResult.routes_list);
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