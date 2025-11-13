//npm install express socket.io cors

const express = require('express')
const http = require('http')
const { Server } = require('socket.io')
const cors = require('cors')

const app = express()
app.use(cors())

const server = http.createServer(app)
const io = new Server(server, {
  cors: {
    origin: '*', 
    methods: ['GET', 'POST']
  }
})

io.on('connection', (socket) => {
  console.log('novo usuario conectado:', socket.id)

  socket.on('joinRoom', (room) => {
    socket.join(room)
    console.log(`usuario ${socket.id} entrou na sala ${room}`)
  })

  socket.on('message', ({ room, user, text }) => {
    console.log(`[${room}] ${user}: ${text}`)
    io.to(room).emit('message', { user, text })
  })

  socket.on('disconnect', () => {
    console.log('usuario desconectado:', socket.id)
  })
})

const PORT = 3001
server.listen(PORT, () => console.log(`server rodando em http://localhost:${PORT}`))
