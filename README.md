"exampleProyecNodjsExpressAWS"

Combinación de proyecto monolítico a lambda  el proyecto esta adaptado para funcionar de las 2 formas poder ser desplegado


para bajar el proyecto necesitas de 

git clone git@github.com:AlejandroQuirozHdz/exampleProyecNodjsExpressAWS.git

una vez abajo el proyecto instalar los modulos que necesita mediante 

npm install

y para correr el proyecto  solo necesitas 

npm start

el cual por defaul tiene el puerto 8090 y si esta en un servidor productivo le asigana el puerto que disponga 

para corre el proyecto de modo local mediante AWS y el serverless

sls offline start

el cual por defaul tiene el puerto 3000 y si esta en un servidor productivo le asigana el puerto que disponga y el dominio si es el caso

en la carpeta Content biene la carpeta backup_mysql se encuentra el respaldo de la base de datos que necesita para funcionar por el momento esta 
conectada a una base de datos en la nube que proporciona remotemysql.com 

y de igual forma la carpeta postman se encuentra el exportable de postman con las pruebas  de los servicios para su uso

# exampleProyecNodjsExpressAWS

