const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
app.use(cors());

const io = socketIO(server, {
    cors: {
        origin: '*',
    }
});



const PORT = 19009;

var client = require("socket.io-client")(`http://localhost:${PORT}`);


app.get('/', (req, res) => {
    res.json('Socket.IO Server is running');
});

/*** client zone ***/
app.get('/sc1/:q', (req, res) => {
    let q = req.params.q
    client.emit('sc1', q)
    console.log('client emit sc1', q)
    res.json({ 'ch': 'sc1', 'q': q });
});
/*** end client zone ***/


io.on('connection', (socket) => {
    console.log(`${socket.handshake.address} connected.`);
    socket.on('disconnect', () => {
        console.log(`${socket.handshake.address} disconnected.!!`);
    });

    socket.on('a', (msg) => {
        io.emit('a', msg); // ส่งกลับไปคนที่ส่งมาด้วย
        socket.broadcast.emit('z', msg); // ไม่ส่งกลับไปคนที่ส่งมา        
        console.log(`${socket.handshake.address} emit a`, msg);
    });

    socket.on('b', (msg) => {
        io.emit('b', msg); // ส่งกลับไปคนที่ส่งมาด้วย
        socket.broadcast.emit('z', msg); // ไม่ส่งกลับไปคนที่ส่งมา        
        console.log(`${socket.handshake.address} emit b`, msg);
    });

    socket.on('z', (msg) => {
        io.emit('z', msg); // ส่งกลับไปคนที่ส่งมาด้วย
        //socket.broadcast.emit('z', msg); // ไม่ส่งกลับไปคนที่ส่งมา        
        console.log(`${socket.handshake.address} emit z`, msg);
    });



});



server.listen(PORT, () => {
    console.log(`Socket Server is running on port ${PORT}`);
});
