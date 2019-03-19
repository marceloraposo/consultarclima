const server = require('./server');
var express = require('express');
var bodyParser = require('body-parser');
var tempo = require('./routes/tempo');
var app = express();
var request = require('request');

app.use(bodyParser.json());


app.use(function(req, res, next) {
    //bodyParser.json();
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, PUT, DELETE,GET");
    next();
  });

app.use(bodyParser.urlencoded({extended: false}));
app.use('/tempo', tempo);

app.listen(server.port, server.ip, () => {
  console.log(`Servidor rodando em http://${server.ip}:${server.port}`)
})
