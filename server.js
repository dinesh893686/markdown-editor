const express = require('express');
const http = require('http');
const socketIO = require('socket.io');
const marked = require('marked');
const cors = require('cors'); // Import cors middleware
const app = express();
const server = http.createServer(app);
const io = socketIO(server,{cors:{origin:'*',methods:['GET', 'POST']}});
const corsOptions = {
    credentials: true,
    origin: ['http://localhost:3002'] // Whitelist the domains you want to allow
};
// Use cors middleware to handle CORS headers
app.use(cors(corsOptions));

app.use(express.static('public'));

io.on('connection', (socket) => {
    console.log('New client connected');

    socket.on('markdown', (data) => {
        const html = marked.parse(data);
        io.emit('html', html);
    });

    socket.on('disconnect', () => {
        console.log('Client disconnected');
    });
});

server.listen(3001, () => {
    console.log('Server running on http://localhost:3001');
});
