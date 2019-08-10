//imporatación de modulos y archivos
const tools = require('../../utils/tools.server.controller');
const pool = require('../../config/database');


exports.createTask = async (req, res, next) => {
    //validaciones
    if (!req.body.nombre) return res.status(401).json(tools.respons(false, 401, { mensage: "Dato requerido nombre type string" }));
    if (!req.body.status) return res.status(401).json(tools.respons(false, 401, { mensage: "Dato requerido status type boolean" }));
    //generación de la variables para ucuparla como objecto de la solicitud del middleware
    req.task = {};
    //asignacion a las variables  una propediad expecifica como el query a la base de datos
    req.task.query = "INSERT INTO tasks SET nombre=?, status=?, date_create=?";
    //asignacion a las variables  una propediad expecifica como los datos a insertar a la base de datos
    req.task.data = [req.body.nombre, req.body.status, new Date()];
    //continuar
    next();
};

//exportación de la función
exports.updateTask = async (req, res, next) => {
    //validaciones
    if (!req.params.id) return res.status(401).json(tools.respons(false, 401, { mensage: "Dato requerido id del task" }));
    //validación en busqueda en base de datos
    let result = await pool.query("SELECT id_task FROM tasks where id_task=?", [req.params.id]);
    //recuperación de los datos y validación de la existencia
    if (result[0].length == 1) {
        //generación de la variables para ucuparla como objecto de la solicitud del middleware
        req.task = {};
        //asignacion a las variables  una propediad expecifica como el query a la base de datos
        req.task.query = "UPDATE tasks SET nombre=?,status=? WHERE id_task=?";
        //asignacion a las variables  una propediad expecifica como los datos a insertar a la base de datos
        req.task.data = [req.body.nombre, req.body.status, req.params.id];
        //continuar
        next();
    } else {
        //respuesta de error
        return res.status(401).json(tools.respons(false, 401, { mensage: "Task no existente" }));
    }
};

//exportación de la función
exports.deleteTask = async (req, res, next) => {
    //validaciones
    if (!req.params.id) return res.status(401).json(tools.respons(false, 401, { mensage: "Dato requerido id del task" }));
    //validación en busqueda en base de datos
    let result = await pool.query("SELECT id_task FROM tasks where id_task=?", [req.params.id]);
    //recuperación de los datos y validación de la existencia
    if (result[0].length == 1) {
        //generación de la variables para ucuparla como objecto de la solicitud del middleware
        req.task = {};
        //asignacion a las variables  una propediad expecifica como el query a la base de datos
        req.task.query = "DELETE FROM tasks WHERE id_task=?";
        //asignacion a las variables  una propediad expecifica como los datos a insertar a la base de datos
        req.task.data = [req.params.id];
        //continuar
        next();
    } else {
        //respuesta de error
        return res.status(401).json(tools.respons(false, 401, { mensage: "Task no existente" }));
    }
};

exports.searchTask = async (req, res, next) => {
    //generación de la variables para ucuparla como objecto de la solicitud del middleware
    req.task = {};
    //asignacion a las variables  una propediad expecifica como el query a la base de datos
    req.task.query = "SELECT id_task,nombre,status,date_format(date_create,'%d-%m-%Y')as date_create FROM tasks WHERE";
    //asignacion a las variables  una propediad expecifica como los datos a insertar a la base de datos
    req.task.data = [];
    //validación si existe la variable para la agregación en el query y en los datos a ingresa en la base de datos    
    if (req.body.id_task) {
        if (req.task.data.length > 0) req.task.query += " and ";
        req.task.query += " id_task=?";
        req.task.data.push(req.body.id_task);
    }
    if (req.body.nombre) {
        if (req.task.data.length > 0) req.task.query += " and ";
        req.task.query += " nombre=?";
        req.task.data.push(req.body.nombre);
    }
    if (req.body.status) {
        if (req.task.data.length > 0) req.task.query += " and ";
        req.task.query += " status=?";
        req.task.data.push(req.body.status);
    }
    if (req.body.date_create) {
        if (! await tools.validaFechaDDMMAAAA(req.body.date_create)) return res.status(401).json(tools.respons(false, 401, { mensage: "No es un formato de fecha  valido DD-MM-YYYY" }));
        let parts = req.body.date_create.split('-');
        if (req.task.data.length > 0) req.task.query += " and ";
        req.task.query += " date_create=?";
        req.task.data.push(parts[2] + "-" + parts[1] + "-" + parts[0]);
    }

    if (req.body.id_user) {
        if (req.task.data.length > 0) req.task.query += " and ";
        req.task.query += " id_task in (select id_task from users where id_user=?)";
        req.task.data.push(req.body.id_user);
    }
    //continuar
    next();
};

//exportación de la función
exports.listTask = async (req, res, next) => {
    //generación de la variables para ucuparla como objecto de la solicitud del middleware
    req.task = {};
    //asignacion a las variables  una propediad expecifica como el query a la base de datos
    req.task.query = "SELECT id_task,nombre,status,date_create FROM tasks ";
    //continuar
    next();
};

//exportación de la función
exports.taskOne = async (req, res, next) => {
    //validaciones
    if (!req.params.id) return res.status(401).json(tools.respons(false, 401, { mensage: "Dato requerido id del task" }));
    //generación de la variables para ucuparla como objecto de la solicitud del middleware
    req.task = {};
    //asignacion a las variables  una propediad expecifica como el query a la base de datos
    req.task.query = "SELECT id_task,nombre,status,date_create FROM tasks WHERE id_task=?";
    //asignacion a las variables  una propediad expecifica como los datos a insertar a la base de datos
    req.task.data = [req.params.id];
     //continuar
    next();
};

//exportación de la función
exports.relationTaskUser = async (req, res, next) => {
    //validaciones
    if (!req.body.id_task) return res.status(401).json(tools.respons(false, 401, { mensage: "Dato requerido id del task" }));
    if (!req.body.id_user) return res.status(401).json(tools.respons(false, 401, { mensage: "Dato requerido id del user" }));
    //generación de la variables para ucuparla como objecto de la solicitud del middleware
    req.taskUser = {};
    //asignacion a las variables  una propediad expecifica como el query a la base de datos
    req.taskUser.query = "INSERT INTO user_task SET id_user=?, id_task=?";
    //asignacion a las variables  una propediad expecifica como los datos a insertar a la base de datos
    req.taskUser.data = [req.body.id_user, req.body.id_task];
     //continuar
    next();
};
