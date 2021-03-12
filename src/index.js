const express = require('express')
const path = require('path')
const http = require('http')
const {generateMessage,generateLocation} = require('../src/utils/messages')
const socketio = require('socket.io')
const Filter = require('bad-words')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000
const publicDirectoryPath = path.join(__dirname,'../public')

app.use(express.static(publicDirectoryPath))

// let message = 'Welcome'

io.on('connection',(socket)=>{
    console.log('New Web socket connection')
    
    socket.on('join',({username,room})=>{
        socket.join(room)
        socket.emit('message',generateMessage('Welcome'))
        
        socket.broadcast.to(room).emit('message',generateMessage(`${username} has joined`))
    })

    socket.on('sendMessage',(message,callback)=>{
        const filter = new Filter()
        if(filter.isProfane(message)){
            return callback('Profaned Message')
        }
        io.to('My room').emit('message',generateMessage(message))
        callback()
    })

    socket.on('sendLocation',(coords,callback)=>{
        io.emit('locationMessage',generateLocation(`https://google.com/maps?q=${coords.lat},${coords.long}`))
        callback()
    })

    socket.on('disconnect',()=>{
        io.emit('message',generateMessage('A user has left'))
    })

})

server.listen(port,()=>{
    console.log("Successfully connected to port:"+ port)
})