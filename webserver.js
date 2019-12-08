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

var clients = {}; // not yet necessary to: Store clients
//var clitenIDs = [];  // not yet necessary to: Store clients
var devices = {}; // List of devices
//var deviceIDs = []; // List of ISs of connected devices

// I2C for communication with arduino
const i2c = require('i2c-bus');
const MCP9808_ADDR = 0x05;

var callback = (socket) => { // Socket Connection to client
    clients[socket.id] = socket; // not yet necessary to: Store clients
    console.log('New Client with ID', socket.id);
    socket.on('state', function(data) { //get content from function "state" from client
        const i2c1 = i2c.openSync(1);
        console.log('Sending to arduino:', data);
        const rawData = i2c1.sendByteSync(MCP9808_ADDR, data);
        i2c1.closeSync();
    });
    socket.on('Socket2', (data) => { //get content from function "websocket"  from client
        // Websocket
        console.log('Sending to Socket2:', data);
        Object.keys(devices).forEach((element) => {
            devices[element].emit("event", data);
        });
    });
    socket.on('disconnect', () => { // Do this if on client disconnetcs
        console.log('Disconnection of ID', socket.id);
        delete clients[socket.id]; // not yet necessary to: Store clients
    });

    Object.keys(devices).forEach((element) => {
        socket.emit("attach", { id: element, type: "LED" });
    });

}

// first socket to communicate with clients
var io = require('socket.io')(http) //require socket.io module and pass the http object
io.sockets.on('connection', callback);

// ------------------------------- DEVICE SOCKET ----------------------------------------
// Socket2 to communicate with devices
var app2 = require('http').createServer()
var io2 = require('socket.io')(app2);
app2.listen(8081); // this one listens to 8081

io2.on('connection', function(socket) {
    console.log('New Device with ID', socket.id);
    socket.on("jsonObject", function(data) {
        console.log(data);
    });

    Object.keys(clients).forEach((element) => {
        clients[element].emit("attach", { id: socket.id, type: "LED" });
    });

    devices[socket.id] = socket; // Store object to make it available for other functions
    //deviceIDs.push(socket.id); // And store its ID in an array
    socket.on('disconnect', function() { // Do this if a device disconnetcs
        console.log('Disconnection of ID', socket.id);

        Object.keys(clients).forEach((element) => {
            clients[element].emit("detach", { id: socket.id, type: "LED" });
        });

        delete devices[socket.id]; // delete element
    });
});