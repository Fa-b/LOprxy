// Comunication between front and backend
var socket = io.connect(); //load socket.io-client and connect to the host
// function I2C_LED(data) {
//     socket.emit("state", data); //send button state to server
// }
// function Websocket_LED(data) {
//     socket.emit("websocket", data); //send button state to server
// }

// Toggle swicth
var arduino_input = document.getElementById('arduino_switch');
var arduino_outputtext = document.getElementById('arduino_status');

arduino_input.addEventListener('change', function() {
    if (this.checked) {
        socket.emit("state", 1); //send button state to server
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
        socket.emit("websocket", "D" + slider.value); //send button state to server
        ESP_outputtext.innerHTML = "an";
    } else {
        socket.emit("websocket", "LED0"); //send button state to server
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
    socket.emit("websocket", "D" + this.value); //send button state to server
}