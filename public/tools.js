// Comunication between front and backend
var socket = io.connect(); //load socket.io-client and connect to the host

var devices = {};

// Toggle swicth arduino
var arduino_input = document.getElementById('arduino_switch');
var arduino_outputtext = document.getElementById('arduino_status');

arduino_input.addEventListener('change', function() {
    if (this.checked) {
        socket.emit("whiteLED/stateChange", { id: "2AAgbd_customID" }); //send button state to server
        arduino_outputtext.innerHTML = "an";
    } else {
        socket.emit("state", 0); //send button state to server
        arduino_outputtext.innerHTML = "aus";
    }
});

// Toggle swicth ESP
var ESP_input = document.getElementById('ESP_switch');
var ESP_outputtext = document.getElementById('ESP_status');

ESP_input.addEventListener('change', function() {
    if (this.checked) {
        socket.emit("Socket2", "D" + slider.value); //send button state to server
        ESP_outputtext.innerHTML = "an";
    } else {
        socket.emit("Socket2", "LED0"); //send button state to server
        ESP_outputtext.innerHTML = "aus";
    }
});

// Slider ESP
var slider = document.getElementById("myRange");
var output = document.getElementById("demo");
output.innerHTML = slider.value;

slider.oninput = function() {
    ESP_input.checked = true;
    output.innerHTML = this.value; // Turn switch on, when slider is moved
    socket.emit("Socket2", "D" + this.value); //send button state to server
}

// Add events from backend

socket.on("attach", (data) => {
    //devices.push(new Device({ id: data.id, type: data.type, ioHandle: socket }));
    console.log(data);
});

socket.on("detach", (data) => {
    console.log(data);
});

// class Device {
//     _id;
//     _type;
//     _handle;
//     constructor({ id, type, ioHandle }) {
//         _id = id;
//         _type = type;
//         _handle = ioHandle;
//     }

//     onClick() {
//         this._handle.emit(_type + "/stateChange", { id: _id }); //send button state to server
//     }

// }