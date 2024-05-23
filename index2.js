const express = require('express');
const app = express();
const http = require('http').createServer(app);
const io = require('socket.io')(http,{
    cors: {
        origin: '*',
    }
});

// Define namespaces
const chatNsp = io.of('/chat');
const notificationNsp = io.of('/notification');

// Chat namespace
chatNsp.on('connection', (socket) => {
    console.log('a user connected to the chat namespace');

    socket.on('chat message', (msg) => {
        console.log('message: ' + msg);
        chatNsp.emit('chat message', msg);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected from the chat namespace');
    });
});

// Notification namespace
notificationNsp.on('connection', (socket) => {
    console.log('a user connected to the notification namespace');

    socket.on('new notification', (data) => {
        console.log('new notification:', data);
        notificationNsp.emit('new notification', data);
    });

    socket.on('disconnect', () => {
        console.log('user disconnected from the notification namespace');
    });
});

http.listen(3000, () => {
    console.log('listening on *:3000');
});