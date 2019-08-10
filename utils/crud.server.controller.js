//imporatación de modulos y archivos
const pool = require('../config/database');
const tools = require('./tools.server.controller');
const jwt = require('jsonwebtoken');
const config = require('../config/config');

//funciones encargadas para ejecutar los querys y los datos que traen en asignación para la base de datos

//exportación de la función 
exports.createUserBD = async (req, res, next) => {
    try {
        let result = await pool.execute(req.user.query, req.user.data);
        req.credentialUser.data.push(result[0].insertId);
        //console.log("crud: Crecion exitosa user 10: "+JSON.stringify(result));
        next();
    } catch (e) {
        console.error("crud: Error de creación user 13: " + e);
        return res.status(400).json(tools.respons(false, 400, { mensage: tools.getErrorMessage(e) }));
    }
}

//exportación de la función
exports.createCredentialBD = async (req, res, next) => {

    try {
        let result = await pool.execute(req.credentialUser.query, req.credentialUser.data);
        //console.log("crud: Crecion exitosa credential 22: "+JSON.stringify(result));
        req.tokenData = { id: result[0].insertId, user: req.credentialUser.data[0] };
        req.mensage = "Usuario creado con exito";
        next();
    } catch (e) {
        console.error("crud: Error de creación credential 27: " + e);
        return res.status(401).json(tools.respons(false, 401, { mensage: "Error de creación del usuario", auth: false, token: null }));
    }

}

//exportación de la función
exports.createToken = async (req, res, next) => {
    let token = jwt.sign(req.tokenData, config.secret, {
        expiresIn: 86400 // expires in 24 hours
    });
    return res.status(200).json(tools.respons(true, 200, { mensage: req.mensage, auth: true, token: token }));
};

//exportación de la función
exports.createTaskBD = async (req, res, next) => {
    try {
        let result = await pool.execute(req.task.query, req.task.data);
        //console.log("crud: Crecion exitosa task 43:"+JSON.stringify(result));
        return res.status(200).json(tools.respons(true, 200, { mensage: "Task creado con exito" }));
    } catch (e) {
        console.error("crud: Error de creación task 46: " + e);
        return res.status(400).json(tools.respons(false, 400, { mensage: tools.getErrorMessage(e) }));
    }
}

//exportación de la función
exports.updateTaskBD = async (req, res, next) => {
    try {
        let result = await pool.execute(req.task.query, req.task.data);
        //console.log("crud: Update exitosa task 54:"+JSON.stringify(result));
        return res.status(200).json(tools.respons(true, 200, { mensage: "Task actualizado con exito" }));
    } catch (e) {
        console.error("crud: Error de update task 57: " + e);
        return res.status(400).json(tools.respons(false, 400, { mensage: tools.getErrorMessage(e) }));
    }
}

//exportación de la función
exports.deleteTaskBD = async (req, res, next) => {
    try {
        let result = await pool.execute(req.task.query, req.task.data);
        //console.log("crud: Eliminación exitosa task 65:"+JSON.stringify(result));
        return res.status(200).json(tools.respons(true, 200, { mensage: "Task eliminado con éxito" }));
    } catch (e) {
        console.error("crud: Error de eliminación task 68: " + e);
        return res.status(400).json(tools.respons(false, 400, { mensage: tools.getErrorMessage(e) }));
    }
}

//exportación de la función
exports.searchTaskBD = async (req, res, next) => {
    try {
        let result = await pool.execute(req.task.query, req.task.data);
        //console.log("crud: Busquedas exitosa task 76:"+JSON.stringify(result));
        return res.status(200).json(tools.respons(true, 200, { mensage: "Consulta de task con exito", data: result[0] }));
    } catch (e) {
        console.error("crud: Error de busqueda task 79: " + e);
        return res.status(400).json(tools.respons(false, 400, { mensage: tools.getErrorMessage(e) }));
    }
}

//exportación de la función
exports.oneTaskBD = async (req, res, next) => {
    try {
        let result = await pool.execute(req.task.query, req.task.data);
        console.log("crud: Busquedas exitosa task 87:" + JSON.stringify(result));
        if (result[0].length == 1) {
            return res.status(200).json(tools.respons(true, 200, { mensage: "Consulta de task con exito", data: result[0][0] }));
        } else {
            return res.status(401).json(tools.respons(false, 401, { mensage: "Task no existente" }));
        }
    } catch (e) {
        console.error("crud: Error de Busqueda task 94: " + e);
        return res.status(400).json(tools.respons(false, 400, { mensage: tools.getErrorMessage(e) }));
    }
}

//exportación de la función
exports.listTaskBD = async (req, res, next) => {
    try {
        let result = await pool.query(req.task.query);
        console.log("crud: Busquedas exitosa tasks 102:" + JSON.stringify(result));
        return res.status(200).json(tools.respons(true, 200, { mensage: "Consulta de task con exito", data: result[0] }));
    } catch (e) {
        console.error("crud: Error de Busqueda tasks 105: " + e);
        return res.status(400).json(tools.respons(false, 400, { mensage: tools.getErrorMessage(e) }));
    }
}

//exportación de la función
exports.addRelationTaskUser = async (req, res, next) => {
    try {
        let result = await pool.query(req.task.query);
        console.log("crud: Agregación exitosa relatión 113:" + JSON.stringify(result));
        return res.status(200).json(tools.respons(true, 200, { mensage: "Creación exitosa de relación" }));
    } catch (e) {
        console.error("crud: Error de Guardado de Relation 116: " + e);
        return res.status(400).json(tools.respons(false, 400, { mensage: tools.getErrorMessage(e) }));
    }
} 