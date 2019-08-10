//variable de proceso de evento inicial
process.env.NODE_ENV = process.env.NODE_ENV || 'development';
//imporatación de modulos y archivos
const awsServerlessExpress = require('aws-serverless-express')
const express = require('../../config/express');
require('../../config/database');
//asignación y importacion y uso de express en la variable let
let app = express();
const server = awsServerlessExpress.createServer(app)
//importacion de la variable de app 
exports.handler = (event, context) => { awsServerlessExpress.proxy(server, event, context) }