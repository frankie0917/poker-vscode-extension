import http = require('http')
import socketIo = require('socket.io')

const server = http.createServer()

const io = socketIo(server)
io.on('connection', (socket) => {
  socket.on('hello', (data) => {
    console.log('data', data)
    socket.emit('world', { hello: 'world' })
  })
})
server.listen(5000, () => {
  console.log('server listening on port: 5000')
})
