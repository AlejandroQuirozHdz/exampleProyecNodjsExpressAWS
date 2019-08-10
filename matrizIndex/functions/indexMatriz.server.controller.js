//imporatación de modulos y archivos
const tools = require('../../utils/tools.server.controller');

//exportación de la función
exports.matrizIndex = async (req, res, next) => {
    //validaciones
    if (req.body.matriz.length < 0) return res.status(401).json(tools.respons(false, 401, { mensage: "Requiere que tenga al menos un dato la matriz" }));
    if (!req.body.valorSearch) return res.status(401).json(tools.respons(false, 401, { mensage: "Requiere un dato para la busqueda" }));

    //busqueda de la variable enviada en el arreglo
    let result = req.body.matriz.indexOf(req.body.valorSearch);
    // validación de la respuesta de la busqueda
    if (result != -1) {//si es -1 significa que no existe en el arreglo si es lo contrario existe
        // respuesta de exito en la busqueda y la posición de valor
        return res.status(200).json(tools.respons(true, 200, { mensage: "Busqueda exitosa", posición: result }));
    } else {
        //creación de una variables para almacenar dato
        let posicion;
        // for para recorrer el areglo 
        for (let index = 0; index < req.body.matriz.length; index++) {
            // validación que el dato ingresado  sea menor a los de los arreglos
            if (req.body.valorSearch < req.body.matriz[index]) {
                // si lo es asigna en la variables posicion el index del dato mayor 
                posicion = index;
                // datiene el ciclo del for
                break;
            }
        }
        // si la posición es undefined no hay dato mayor en el arreglo y asigna el consecutivo si se agregara en el arreglo en la variable posicion
        if (posicion == undefined) posicion = req.body.matriz.length;
        // responde el exito en la busqueda y mensiona la posición del dato no existente y donde seria si se agregara
        return res.status(200).json(tools.respons(true, 200, { mensage: "Dato no existente posición sugerida de insertar: " + posicion, posicion: posicion }));
    }
};