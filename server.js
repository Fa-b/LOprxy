// Set up nodeJS webserver using http
// var fs = require('fs'); //require filesystem to read html files
var express = require('express');
var app = express();
// var cors = require('cors')
var http = require('http').createServer(app);

// app.use(function (req, res, next) {
//     res.header('Access-Control-Allow-Origin', req.get('Origin') || '*');
//     res.header('Access-Control-Allow-Credentials', 'true');
//     res.header('Access-Control-Allow-Methods', 'GET,HEAD,PUT,PATCH,POST,DELETE');
//     res.header('Access-Control-Expose-Headers', 'Content-Length');
//     res.header('Access-Control-Allow-Headers', 'Accept, Authorization, Content-Type, X-Requested-With, Range');
//     next();
// });

// const corsOptions = {
//     origin: "*",
//     credentials: true
// };
// app.use(cors(corsOptions));

var subject = null; // backend

// first socket to communicate with clients
var io = require('socket.io')(http, { log: false, origins: '*', path: "/LosOchos.org/socket.io" }); //require socket.io module and pass the http object

http.listen(8030, '0.0.0.0', function () { //listen to port 8030
    console.log("Waiting for clients on", "http://" + http.address().address + ":" + http.address().port);
});

io.sockets.on('connection', (socket) => { // Socket Connection to clients

    // clients[socket.id] = socket;
    console.log('New Client with ID', socket.id);

    if (socket.handshake.query.isSubject) {
        console.log('Subject is present :-)');
        subject = socket;
    }

    var oneventHandler = socket.onevent;
    socket.onevent = function () {
        oneventHandler.apply(this, arguments);
        var packet = arguments[0];
        var eventType = packet.data[0];
        var eventData = packet.data[1];
        var eventCallback = packet.data[2];
        if (socket === subject) {
            // forward all events from subject to other clients in namespace
            subject.broadcast.emit(eventType, eventData);
        } else {
            // forward all events from clients to subject
            subject.emit(eventType, eventData);
        }
    };
});