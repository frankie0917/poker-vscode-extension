import http = require('http')
import socketIo = require('socket.io')
import {
  CLIENT_EVT,
  SERVER_EVT,
  ClientEvtDataMap,
  ServerEvtDataMap,
} from '../shared/EmitType'
import { Room } from '../shared/Room'
import { v4 as uuid } from 'uuid'

const server = http.createServer()

let rooms: Record<string, Room> = {}

const io = socketIo(server)
io.on('connection', (socket) => {
  const on = <T extends CLIENT_EVT>(
    type: T,
    callback: (data: ClientEvtDataMap[T]) => void
  ) => {
    socket.on(type, callback)
  }

  const emit = <T extends SERVER_EVT>(type: T, data: ServerEvtDataMap[T]) => {
    socket.emit(type, data)
  }

  on(CLIENT_EVT.hostRoom, (data) => {
    const id = uuid()
    const room = {
      id,
      host: data.user,
      players: [data.user],
    }
    rooms[id] = room

    emit(SERVER_EVT.hostRoomRes, { room })
  })

  on(CLIENT_EVT.joinRoom, ({ id }) => {
    const res = rooms[id]
    if (res === undefined) {
      emit(SERVER_EVT.joinRoomRes, { error: 'notFound' })
      return
    }
    emit(SERVER_EVT.joinRoomRes, { room: res })
  })
})

server.listen(5000, () => {
  console.log('server listening on port: 5000')
})
