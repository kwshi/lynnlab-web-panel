
const websocket = new window.WebSocket('ws://'+window.location.host+'/ws');

websocket.addEventListener('open', () => {
    console.log('connect');

    websocket.addEventListener('message', () => {
        console.log('message');
    });
});


