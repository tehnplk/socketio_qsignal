const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const io = socketIO(server, {
    cors: {
        origin: '*',
    }
});

app.use(cors());

const PORT = 3000;

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

    socket.on('sc1', (msg) => {
        io.emit('sc1', msg); // ส่งกลับไปคนที่ส่งมาด้วย
        //socket.broadcast.emit('sc1', msg); // ไม่ส่งกลับไปคนที่ส่งมา        
        console.log(`${socket.handshake.address} emit sc1`, msg);
    });



});



server.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
