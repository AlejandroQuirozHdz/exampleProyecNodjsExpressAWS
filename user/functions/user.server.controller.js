//imporatación de modulos y archivos
const bcrypt = require('bcryptjs');
const tools = require('../../utils/tools.server.controller');
const pool = require('../../config/database');

//exportación de la función
exports.createUser = async (req, res, next) => {
    //validaciones
    if (!req.body.nombre) return res.status(401).json(tools.respons(false, 401, { mensage: "Dato requerido nombre" }));
    if (!req.body.ap_pat) return res.status(401).json(tools.respons(false, 401, { mensage: "Dato requerido apellido paterno" }));
    if (!req.body.ap_mat) return res.status(401).json(tools.respons(false, 401, { mensage: "Dato requerido apellido materno" }));
    if (!req.body.edad) return res.status(401).json(tools.respons(false, 401, { mensage: "Dato requerido edad" }));
    if (!req.body.fecha_nacimiento) return res.status(401).json(tools.respons(false, 401, { mensage: "Dato requerido fecha de nacimiento" }));
    if (!tools.validaFechaDDMMAAAA(req.body.fecha_nacimiento)) return res.status(401).json(tools.respons(false, 401, { mensage: "No es un formato de fecha  valido DD-MM-YYYY" }));
    if (!req.body.telefono) return res.status(401).json(tools.respons(false, 401, { mensage: "Dato requerido telefono" }));
    if (!req.body.user) return res.status(401).json(tools.respons(false, 401, { mensage: "Dato requerido user" }));
    if (!req.body.password) return res.status(401).json(tools.respons(false, 401, { mensage: "Dato requerido password" }));
    //separacion de la fecha
    let parts = req.body.fecha_nacimiento.split('-');
    //validación del usuario
    let result = await pool.query("SELECT id_login,user,password FROM login where user=?", [req.body.user]);
    //recuperación de los datos y validación de la existencia
    if (result[0].length == 0) {
        //generación de la variables para ucuparla como objecto de la solicitud del middleware
        req.credentialUser = {};
        req.user = {};
        //asignacion a las variables  una propediad expecifica como el query a la base de datos
        req.user.query = "INSERT INTO users SET nombre=?,ap_pat=?,ap_mat=?,edad=?,fecha_nacimiento=?,telefono=? ";
        //asignacion a las variables  una propediad expecifica como los datos a insertar a la base de datos
        req.user.data = [req.body.nombre, req.body.ap_pat, req.body.ap_mat, req.body.edad, parts[2] + "-" + parts[1] + "-" + parts[0], req.body.telefono];
        //encriptación de la contraseña 
        let hashedPassword = await encripPassword(req.body.password);
        //asignacion a las variables  una propediad expecifica como el query a la base de datos
        req.credentialUser.query = "INSERT INTO login SET user=?, password=?, date_create=?,id_user=?";
        //asignacion a las variables  una propediad expecifica como los datos a insertar a la base de datos
        req.credentialUser.data = [req.body.user, hashedPassword, new Date()];
        //continuar
        next();
    } else {
        //respuesta de error
        return res.status(401).json(tools.respons(false, 401, { mensage: "Usuario ya existente", auth: false, token: null }));
    }
};

exports.userAuthentication = async (req, res, next) => {
    //validaciones
    if (!req.body.user) return res.status(401).json(tools.respons(false, 401, { mensage: "Dato requerido user" }));
    if (!req.body.password) return res.status(401).json(tools.respons(false, 401, { mensage: "Dato requerido password" }));
    //validación en busqueda en base de datos
    let result = await pool.query("SELECT id_login,user,password FROM login where user=?", [req.body.user]);
    //recuperación de los datos y validación de la existencia
    if (result[0].length > 0) {
        //comparación de la contraseña
        if (comparePassword(result[0][0].password, req.body.password)) {
            //asignacion a las variables  una propediad expecifica como los datos para la generación del token
            req.tokenData = { id: result[0][0].id_login, user: result[0][0].user };
            //continuar
            next();
        }
    } else {
        //respuesta de error
        return res.status(401).json(tools.respons(false, 401, { mensage: "Usuario y/o contraseña incorrectos ", auth: false, token: null }));
    }
};

let encripPassword = async (password) => {
    //proceso de la encriptación de la contraseña y la retorne
    try {
        let salt = bcrypt.genSaltSync(10);
        let hashedPassword = await bcrypt.hashSync(password, salt);
        return hashedPassword;
    } catch (e) {
        console.error("Error de encrip password: " + e);
    }

};

let comparePassword = async (passwordBD, passwordReq) => {
    //proceso de la comparación de la contraseña
    try {
        let hashedPassword = await encripPassword(passwordReq);
        return bcrypt.compareSync(passwordBD, hashedPassword); // true
    } catch (e) {
        console.error("Error de decrip password: " + e);
    }

};