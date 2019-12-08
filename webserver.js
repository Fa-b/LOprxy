// Set up nodeJS webserver using http
var fs = require('fs'); //require filesystem to read html files
var express = require('express');
var app = express();
var http = require('http').createServer(app);
app.get('/', function(req, res) {
    res.sendFile(__dirname + '/public/index.html'); // routes initial call to index.html
});
app.use(express.static('public')); // express public folder
http.listen(8080); //listen to port 8080



// I2C for communication with arduino
const i2c = require('i2c-bus');
const MCP9808_ADDR = 0x05;

var io = require('socket.io')(http) //require socket.io module and pass the http object
io.sockets.on('connection', function(socket) { // Socket Connection to client
    console.log('New Connection with ID');
    console.log(socket.id);
    socket.on("jsonObject", function(data) {
        console.log(data);
    })
    socket.on('state', function(data) { //get content from function "state" from client
        const i2c1 = i2c.openSync(1);
        console.log('Sending to arduino: ', data);
        const rawData = i2c1.sendByteSync(MCP9808_ADDR, data);
        i2c1.closeSync();
    })
    socket.on('websocket', function(data) { //get content from function "websocket"  from client
        // Websocket
        socket.emit("plainString", "\"this is a plain string\"");
    })
    socket.on('disconnect', function() {
        console.log('Disconnection of ID');
        console.log(socket.id);
    })
});