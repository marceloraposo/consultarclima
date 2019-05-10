const server = require('../server');
const request = require('request');

exports.ver = function (req, res) {
    const appid = server.appid;
    const lat = req.params.lat;
    const lon = req.params.lon;

    request('http://api.openweathermap.org/data/2.5/weather?lat='+lat+'&lon='+lon+'&appid='+appid+'&units=metric&lang=pt', function (error, response, body) {
        if(response == null){
            res.send('Erro');
        }else{
            res.send(response.body);
        }
        res.status(200);
        res.send();   
    });
};

exports.forecast = function (req, res) {
    const appid = server.appid;
    const lat = req.params.lat;
    const lon = req.params.lon;

    request('http://api.openweathermap.org/data/2.5/forecast/hourly?lat='+lat+'&lon='+lon+'&appid='+appid+'&units=metric&lang=pt', function (error, response, body) {
        if(response == null){
            res.send('Erro');
        }else{
            res.send(response.body);
        }
        res.status(200);
        res.send();   
    });
};