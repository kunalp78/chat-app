const path = require('path');
const http = require('http');
const express = require('express');
const socketio = require('socket.io');
const Filter = require('bad-words');
const { generateMessage, generateLocationMessage } = require('./utils/messages');

const app = express();
const server = http.createServer(app);
const io = socketio(server)

const port  = process.env.PORT || 3000;
const publicDirectoryPath = path.join(__dirname,'../public');

app.use(express.static(publicDirectoryPath));



io.on('connection',(socket)=>{
    console.log('New WEB Connection')

    socket.emit('message', generateMessage('Welcome!'))
    socket.broadcast.emit('message',generateMessage('A new User has Joined the clan'))
    socket.on('sendMessage',(message, callback)=>{
        const filter = new Filter();
        if(filter.isProfane(message)){
            return callback("or may contain Profane Words XX")
        }

        io.emit('message',generateMessage(message))
        callback('Delivered!')
    })
    socket.on('sendLocation',(coords, callback)=>{
        io.emit('locationMessage',generateLocationMessage(`https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`));
        callback()
    })
    socket.on('disconnect',()=>{
        io.emit('message',generateMessage('A user is disconnected'))
    })
   
})

server.listen(port,()=>{
    console.log(`server is up and running${port}`)
})
