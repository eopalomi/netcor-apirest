// Importamos Express
const express = require('express');

// Usar Peticiones HTTP
const fetch = require('node-fetch');

// Importamos Acceso BD
const db = require('../db/connect_db');

//Importamos Middlewares
const { validaToken } = require('../middlewares/autenticacion');

// Usamos Express
const app = express();

// ======== ENDPOINTS =========
// ============================

app.get('/pagina', async (req, res) => {
    // HTTP Header
    let header = req.headers;

    // HTTP Body
    let body = req.body;

    // HTTP Query Params
    let params = req.query;

    // Parametros para el procesarPropag
    const PARAMS = params.params_page === undefined ? {} : JSON.parse(params.params_page);
    const PAGEID = params.id_pagina;
    const USUARI = {cod_usu:params.usu_cod};
    let   RES_JS = {};
    
    // [querys] Informacion de la Pagina
    let query_valpag = `select * from frame.pagina_info(${params.id_pagina}, null)`;

    // [querys] Informacion del JS con el valpag de la Pagina
    let query_valpagjs = `select * from frame.pagina_js(${params.id_pagina}, null);`;
    
    try {
        // console.log("entro aqui 001", query_valpag);
        // Conectar y Ejecutar Query - Buscar Pagina
        const execPageInf = await db.query(query_valpag);
        
        const resultPageInfo = execPageInf.rows[0];

        // No Existe la Pagina?
        if (!resultPageInfo) {
            // Respuesta (Bad Request - 400)
            return res.status(400).json({
                valid: false,
                error_stack: 'No existe la pagina', 
                page_id: params.id_pagina
            });
        };
            
        // Conectar y Ejecutar Query - Buscar JS de la Pagina
        const execPageJS = await db.query(query_valpagjs);
        const resultPageJS = execPageJS.rows[0];
        
        // No Existe JS de la Pagina?
        if (!resultPageJS) {
            // [querys] Informacion del JS con el valpag de la Pagina
            let query_regist_page = `select * from frame.pagina_regist(${params.id_pagina});`;
            
            // Conectar y Ejecutar Query - Buscar Registros de la Pagina
            const execRegistJS = await db.query(query_regist_page);
            const resultRegistJS = execRegistJS.rows[0].pagina_regist;

            //Agregar los Registros de la pagina al Json de Data de la Pagina
            resultPageInfo.data_page = resultRegistJS;

            // Respuesta (OK - 200)
            res.status(200).json(resultPageInfo);
        } else {
            // Funcion de Carga
            let asyncLoadFuntion = `async function procesarValpag() { ${resultPageJS.js_page} }`

            // Ejecutar JS Pagina y crear la funcion
            eval(asyncLoadFuntion);
            
            // Ejecutar la funcion obtenida desde la base de datos y responder con los datos
            procesarValpag()
            .then(data_page => {
                //Agregar los Registros de la pagina al Json de Data de la Pagina
                resultPageInfo.data_page = data_page;
                
                // Agregar Mensajes de Alerta
                if (RES_JS.msg_alert) resultPageInfo.msg_alert = RES_JS.msg_alert;

                // Respuesta (OK - 200)
                res.status(200).json(resultPageInfo);
            }).catch( e =>{
                res.status(500).json({
                    valid: false,
                    error_stack: e.stack,
                    page_id: params.id_pagina
                });
            });
        };
    } catch (e) {
        // Respuesta (Internal Sever Error - 500)
        return res.status(500).json({
            valid: false,
            error_stack: e.stack,
            page_id: params.id_pagina
        });
    }

    // Funciones
    function valpagReturn(rowData){
        let arrObj = [];
    
        for (let rs_parent of rowData) {
            const objReg = new Object();
    
            for (let rs_child of rs_parent) {  
                objReg["regist_" + rs_child.co_pagreg]               = rs_child.va_pagreg; // Valor del Registro
                objReg["regist_" + rs_child.co_pagreg + "_type"]     = rs_child.ti_pagreg; // Tipo de Dato
                objReg["regist_" + rs_child.co_pagreg + "_est"]      = rs_child.ti_estreg; // Estado del Registro
                objReg["regist_" + rs_child.co_pagreg + "_color"]    = rs_child.ti_colreg; // Color del Registro
                objReg["regist_" + rs_child.co_pagreg + "_ico"]      = rs_child.va_icoreg; // Icono
                objReg["regist_" + rs_child.co_pagreg + "_conten"]   = rs_child.id_conten; // Contenedor
                objReg["regist_" + rs_child.co_pagreg + "_datsel"]   = rs_child.ar_datsel; // Datos del Combo
                objReg["regist_" + rs_child.co_pagreg + "_link"]     = rs_child.va_urllin; // Link de Redireccion
                objReg["regist_" + rs_child.co_pagreg + "_pagref"]   = rs_child.ar_pagref; // Datos del Combo
                objReg["regist_" + rs_child.co_pagreg + "_plhold"]   = rs_child.va_plhold; // PlaceHolder
                objReg["regist_" + rs_child.co_pagreg + "_dialog"]   = rs_child.va_dialog; // Dialog Contenedor
                objReg["regist_" + rs_child.co_pagreg + "_dialvw"]   = rs_child.va_dialvw; // Dialog Contenedor
                objReg["regist_" + rs_child.co_pagreg + "_sizreg"]   = rs_child.va_sizreg; // Tamaño Letra del Registro
                objReg["regist_" + rs_child.co_pagreg + "_filter"]   = rs_child.va_filter; // Filtro del Registro
                objReg["regist_" + rs_child.co_pagreg + "_required"] = rs_child.il_requir; // Validacion Requerida
                objReg["regist_" + rs_child.co_pagreg + "_tooltip"]  = rs_child.va_tooltp; // Tooltip
                objReg["regist_" + rs_child.co_pagreg + "_parname"]  = rs_child.no_params; // Nombre de Parametro
                objReg["regist_" + rs_child.co_pagreg + "_disabled"] = rs_child.il_disabl; // Campo Desahabilitado
                objReg["dash_card"]                                  = rs_child.dash_card; // Configuracion de Card
            };
    
            arrObj.push(objReg);
        };
    
        return arrObj;
    };

    async function HTTP(url, method, body){
        let bodyJson = JSON.stringify(body);
        let contenType = {"Content-type": "application/json"};

        let response = fetch(url, {method: method, body: bodyJson, headers: contenType});
        
        return response;
    }

    function add_msg_alert(msg_title, msg_body, msg_type){
        if (RES_JS.msg_alert === undefined) {
            RES_JS.msg_alert = {};
        };

        RES_JS.msg_alert.msg_title = msg_title;
        RES_JS.msg_alert.msg_body = msg_body;
        RES_JS.msg_alert.msg_type = msg_type;
    };

    function remove_param(key_par){
        if (RES_JS.remove_params === undefined) {
            RES_JS.remove_params = [];
        };

        RES_JS.remove_params.push(key_par);
    };
});

app.post('/propag', async (req, res) => {
    // HTTP Header
    let header = req.headers;

    // HTTP Body
    let body = req.body;

    // HTTP Query Params
    let params = req.query;
    // console.log("body propag: ", req.body)
    // console.log("ES UNDEFINED: ", params.params_page === undefined)
    // console.log("PARSEO PARAMETROS: ", JSON.parse(params.params_page))

    // [querys] Informacion del JS con el Propag de la Pagina
    let query_propagjs = `select * from frame.pagina_propag_js(${params.id_pagina}, null);`;

    // Parametros para el procesarPropag
    const PARAMS = params.params_page === undefined ? {} : JSON.parse(params.params_page);
    const ALLREG = body;
    const BUTTON = params.id_boton;
    const PAGEID = params.id_pagina;
    const USUARI = {cod_usu:params.usu_cod};
    let   RES_JS = {};

    try {
        // Conectar y Ejecutar Query - Buscar JS de la Pagina
        const execPageJS = await db.query(query_propagjs);

        // Obtiene el Resultado del Propag
        const resultPropagJS = execPageJS.rows[0];

        // No Existe Propag?
        if (!resultPropagJS) {
            // Respuesta (Bad Request - 400)
            return res.status(400).json({
                valid: false,
                error_stack: 'No existe el Propag JS de la pagina',
                page_id: params.id_pagina
            });
        };

        // Crear Funcion
        let asyncProcesFunction = `async function procesarPropag() { ${resultPropagJS.js_page} }`

        // Ejecutar JS Propag y crear la funcion
        eval(asyncProcesFunction);
        
        procesarPropag().then( x => {
            // Flag Rpta valida
            RES_JS.valid = true;

            //console.log("==============> RESPUESTA RES_JS:", RES_JS);

            // Respuesta (HTTP 200 - OK)
            res.status(200).send(RES_JS);
        }).catch( err => {
            res.status(500).json({
                valid: false,
                error_stack: err.stack,
                page_id: params.id_pagina
            });
        });
    } catch (e) {
        // Respuesta (Internal Sever Error - 500)
        return res.status(500).json({
            valid: false,
            error_stack: e.stack,
            page_id: params.id_pagina
        });
    };

    // Funciones
    function add_param(key_par, value_par){
        if (RES_JS.page_params === undefined) {
            RES_JS.page_params = {};
        };

        RES_JS.page_params[key_par] = value_par;
    };

    function remove_param(key_par){
        if (RES_JS.remove_params === undefined) {
            RES_JS.remove_params = [];
        };

        RES_JS.remove_params.push(key_par);
    };

    function add_page_refresh(page_refresh){
        RES_JS.pages_to_refresh = page_refresh;
    };

    function add_redirect(conten_redirect){
        RES_JS.page_redirect = conten_redirect;
    };

    function add_close_dialog(dialog_close){
        RES_JS.close_dialog = dialog_close;
    };

    function add_open_dialog(conten_open, min_vw){
        if (RES_JS.open_dialog === undefined) {
            RES_JS.open_dialog = {};
        };

        RES_JS.open_dialog.conten = conten_open;
        RES_JS.open_dialog.min_vw = min_vw;
    };

    function add_msg_alert(msg_title, msg_body, msg_type){
        if (RES_JS.msg_alert === undefined) {
            RES_JS.msg_alert = {};
        };

        RES_JS.msg_alert.msg_title = msg_title;
        RES_JS.msg_alert.msg_body = msg_body;
        RES_JS.msg_alert.msg_type = msg_type;
    };

    async function HTTP(url, method, body){
        let bodyJson = JSON.stringify(body);
        let contenType = {"Content-type": "application/json"};

        let response = fetch(url, {method: method, body: bodyJson, headers: contenType});

        return response;
    }
});

app.post('/pagina-propag', async (req, res) => {
    // HTTP Header
    let header = req.headers;

    // HTTP Body
    let body = req.body;

    // HTTP Query Params
    let params = req.query;

    // console.log('query params', params);
    // console.log('en el body', body);

    // [querys] Informacion del JS con el Propag de la Pagina
    let query_propagjs = `select * from frame.set_pagina_propag(${body.id_pagina}, '${body.js_propag.split("'").join("''")}');`;

    try {
        // Conectar y Ejecutar Query - Buscar JS de la Pagina
        const execPageJS = await db.query(query_propagjs);

        // Obtiene el Resultado del Propag
        const resultPropagJS = execPageJS.rows[0];

        // No Existe Propag?
        if (!resultPropagJS) {
            // Respuesta (Bad Request - 400)
            return res.status(400).json({
                error: { message: 'No se pudo actualizar el propag' }
            });
        };
 
        res.status(200).send({mensaje: 'se proceso correctamente el propag'});
    } catch (e) {
        // Respuesta (Internal Sever Error - 500)
        return res.status(500).json({
            query_valpagjs: query_propagjs,
            error: e,
            stack_err: e.stack
        });
    }
});

app.get('/pagina-propag', async (req, res) => {
    // HTTP Header
    let header = req.headers;

    // HTTP Body
    let body = req.body;

    // HTTP Query Params
    let params = req.query;

    // console.log('query params', params);
    // console.log('en el body', body);

    // [querys] Informacion del JS con el Propag de la Pagina
    let query_propagjs = `select * from frame.get_pagina_propag(${params.id_pagina});`;

    try {
        // Conectar y Ejecutar Query - Buscar JS de la Pagina
        const execPageJS = await db.query(query_propagjs);

        // Obtiene el Resultado del Propag
        const resultPropagJS = execPageJS.rows[0];

        // No Existe Propag?
        if (!resultPropagJS) {
            // Respuesta (Ok - 400)
            return res.status(200).json({
                propag: ''
            });
        };
 
        res.status(200).json({
            propag: resultPropagJS.propag
        });

    } catch (e) {
        // Respuesta (Internal Sever Error - 500)
        return res.status(500).json({
            query_valpagjs: query_propagjs,
            error: e,
            stack_err: e.stack
        });
    }
});

app.post('/pagina-valpag', async (req, res) => {
    // HTTP Header
    let header = req.headers;

    // HTTP Body
    let body = req.body;

    // HTTP Query Params
    let params = req.query;

    //console.log('pagina-valpag(post)');
    //console.log('query params', params);
    //console.log('en el body', body);
    // console.log('query_propagjs', body.id_pagina);
    // console.log('body aquiii', body.js_valpag);
    
    // [querys] Informacion del JS con el Propag de la Pagina
    let query_propagjs = `select * from frame.set_pagina_valpag(${body.id_pagina},'${body.js_valpag.split("'").join("''")}');`;
    
    try {
        // Conectar y Ejecutar Query - Buscar JS de la Pagina
        const execPageJS = await db.query(query_propagjs);

        // Obtiene el Resultado del Propag
        const resultPropagJS = execPageJS.rows[0];

        // No Existe Propag?
        if (!resultPropagJS) {
            // Respuesta (Bad Request - 400)
            return res.status(400).json({
                error: { message: 'No se pudo actualizar el valpag' }
            });
        };
 
        res.status(200).send({mensaje: 'se proceso correctamente el valpag'});

    } catch (e) {
        // Respuesta (Internal Sever Error - 500)
        return res.status(500).json({
            query_valpagjs: query_propagjs,
            error: e,
            stack_err: e.stack
        });
    }
});

app.get('/pagina-valpag', async (req, res) => {
    // HTTP Header
    let header = req.headers;

    // HTTP Body
    let body = req.body;

    // HTTP Query Params
    let params = req.query;

    // console.log('query params', params);
    // console.log('en el body', body);

    // [querys] Informacion del JS con el Propag de la Pagina
    let query_propagjs = `select * from frame.get_pagina_valpag(${params.id_pagina});`;

    try {
        // Conectar y Ejecutar Query - Buscar JS de la Pagina
        const execPageJS = await db.query(query_propagjs);

        // Obtiene el Resultado del Propag
        const resultValpagJS = execPageJS.rows[0];

        // No Existe Valpag?
        if (!resultValpagJS) {
            // Respuesta (Bad Request - 400)
            return res.status(200).json({
                valpag: ''
            });
        };

        res.status(200).json({
            valpag: resultValpagJS.valpag
        });
    } catch (e) {
        // Respuesta (Internal Sever Error - 500)
        return res.status(500).json({
            query_valpagjs: query_propagjs,
            error: e,
            stack_err: e.stack
        });
    }
});

app.get('/pagina/search', async (req, res) => {
    // HTTP Header
    let header = req.headers;

    // HTTP Body
    let body = req.body;

    // HTTP Query Params
    let params = req.query;

    // query
    let query = `select * from frame.pagina_search(${params.tipo_busqueda} , '${params.dato_busqueda}', null)`;
    
    try {
        // Conectar y Ejecutar Query
        const queryResult = await db.query(query);
        const dataResult = queryResult.rows;
        
        // No Existe Data?
        if (!dataResult) {
            // Respuesta (Bad Request - 400)
            return res.status(400).json({
                error: { message: 'No Existe la pagina' }
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