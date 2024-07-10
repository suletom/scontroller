const express = require('express');
bodyParser = require('body-parser');
var session = require('express-session');

const mainservice = function(cb){

    let app = express();
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());

    app.use('/static', express.static(__dirname+"/../node_modules/bootstrap/dist/"));
    app.use('/statica', express.static(__dirname+"/../node_modules/apexcharts/dist/"));

    app.get('/', function(req, res) {
        res.sendFile(__dirname + '/dashboard.html');
    });

    let port=6789;

    app.listen(port,function(){ 

        cb(port);
        console.log("Listening on port: "+port);
     });

}

exports.mainservice=mainservice;