const express = require("express");
var mqtt = require('mqtt');
var fs = require('fs');
var path = require("path");
var bodyParser = require('body-parser')
var jsonParser = bodyParser.json()
const http = require("http");
const socketIo = require('socket.io');

var flag = false;
var imageURL = '';
var topico = '';
var now = new Date();
var app = express();
var server = http.createServer(app);
const io = socketIo(server);
var client;
app.use('/static', express.static('public'));


var options = {
    clientId: "mqttjs01",
    username: "elviserafim",
    password: "elvis123",
    clean: true
}

var options2 = {
    retain: true,
    qos: 1
};



app.get('/', function (req, res) {
    var path = require("path");
    var absolutePath = path.resolve("./public/example.jpg");
    res.send(absolutePath);
});
app.post('/conexao', function (req, res) {
    client = mqtt.connect("mqtt://45.167.218.51:8684", "")
    client.on("connect", function () {
        console.log("connected");
    })
    client.subscribe("monitoramento/aovivo/1", { qos: 0 });
    client.subscribe("monitoramento/aovivo/2", { qos: 0 });
    client.subscribe("monitoramento/aovivo/3", { qos: 0 });
    client.subscribe("monitoramento/lockdown/#", { qos: 0 });
    client.on('message', function (topic, message, packet) {
        console.log("topic is " + topic);
        console.log(message);

        var bitmap = new Buffer.from(message, 'base64');
        fs.writeFileSync("./public/example.jpg", bitmap);
        imageURL = message;
        console.log(flag);
        console.log(imageURL);

        if (topic === 'monitoramento/aovivo/1') {
            topico = 'monitoramento/aovivo/1';
        } else if (topic === 'monitoramento/aovivo/2') {
            topico = 'monitoramento/aovivo/2';
        } else if (topic === 'monitoramento/aovivo/3') {
            topico = 'monitoramento/aovivo/3';
        } else {
            topico = 'monitoramento/lockdown/#';
        }
        flag = true;

    });
    res.send(options.clientId);

})

app.post('/horario', jsonParser, function (req, res) {
    console.log(req.body);

    client.publish("horario", JSON.stringify(req.body.data), options2);
    res.send('DEU BOM');
})

//Antes tava sem o on
io.on("connection", (socket) => {
    setInterval(() => {
        if (flag == true) {
            console.log('entrei');
            var image = imageURL.toString('base64');
            var dataInfo = {
                image: image,
                topic: topico,
                data: now.getDate() + ":" + now.getMonth() + ":" + now.getFullYear(),
                hora: now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds()
            }
            io.emit('dataInfo', dataInfo);
            flag = false;
        }
    })
})
server.listen(8080, () => console.log('servidor rodando na porta 4000'));









// respond with "hello world" when a GET request is made to the homepage

/*var client = mqtt.connect("mqtt://45.167.218.51:8684", "")
client.on("connect",function(){
    console.log("connected");
})
client.subscribe("sensor",{qos:1});
client.on('message',function(topic, message, packet){
    console.log("message is "+ message);
    console.log("Messagem length is: " +message.length)
    console.log("topic is "+ topic);
    var string = ''+ message +'';
    var bitmap = new Buffer.from(message, 'base64');
    fs.writeFileSync("./example.jpg", bitmap);
});*/

 //single topic
 //Adicionar as imagens em um diretorio e pegar
/*client.publish("testtopic","Funcionando",options2);*/

