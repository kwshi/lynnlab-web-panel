

var socket = io();

socket.on('connect', () => {
    socket.send('hi');
    
});

socket.on('message', (message) => {
    console.log('message?');
    console.log(message);
    
});

socket.on('log', (message) => {
    console.log('log');
    console.log(message);
});
