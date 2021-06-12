const http = require("http");
const express = require("express");
var mqtt=require('mqtt');
var fs = require('fs');

/*
var options={
    clientId:"mqttjs01",
    username:"elviserafim",
    password:"elvis123",
    clean:true}
    
var options2={
        retain:true,
        qos:1};
*/
var client = mqtt.connect("mqtt://45.167.218.51:8684", "")
client.on("connect",function(){	
    console.log("connected");
})
client.subscribe("sensor",{qos:1});
client.on('message',function(topic, message, packet){
	console.log("message is "+ message);
	console.log("topic is "+ topic);
    var string = ''+ message +'';
    var bitmap = new Buffer.from(message, 'base64');
    fs.writeFileSync("./example.jpg", bitmap);
});

 //single topic
 //Adicionar as imagens em um diretorio e pegar
/*client.publish("testtopic","Funcionando",options2);*/
