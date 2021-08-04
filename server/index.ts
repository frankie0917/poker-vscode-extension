import http from 'http'
import { Server } from 'socket.io'
import {
  CLIENT_EVT,
  SERVER_EVT,
  ClientEvtDataMap,
  ServerEvtDataMap,
} from '../shared/EmitType'
import { Room } from '../shared/Room'
import { makeRoomID } from './utils/makeRoomID'

const server = http.createServer()

let rooms: Record<string, Room> = {}

const io = new Server(server, {
  cors: {
    origin: '*',
  },
})

io.on('connection', (socket) => {
  const on = <T extends CLIENT_EVT>(
    type: T,
    callback: (data: ClientEvtDataMap[T]) => void
  ) => {
    socket.on(type, callback as any)
  }

  const emit = <T extends SERVER_EVT>(type: T, data: ServerEvtDataMap[T]) => {
    socket.emit(type, data)
  }

  const emitToRoom = <T extends SERVER_EVT>(
    roomId: string,
    type: T,
    data: ServerEvtDataMap[T]
  ) => {
    io.in(roomId).emit(type, data)
  }

  on(CLIENT_EVT.userMessage, ({ message, user, roomId, time }) => {
    emitToRoom(roomId, SERVER_EVT.userMessage, { user, message, time })
  })

  on(CLIENT_EVT.hostRoom, async (data) => {
    const roomId = makeRoomID()
    const room = {
      id: roomId,
      host: data.user,
      players: [data.user],
    }
    rooms[roomId] = room
    socket.join(roomId)
    emit(SERVER_EVT.hostRoomRes, { room })
  })

  on(CLIENT_EVT.joinRoom, ({ id, user }) => {
    const res = rooms[id]
    if (res === undefined) {
      emit(SERVER_EVT.joinRoomRes, { error: 'notFound' })
      return
    }
    rooms[id].players.push(user)
    socket.join(id)
    emit(SERVER_EVT.joinRoomRes, { room: res })
  })

  on(CLIENT_EVT.leaveRoom, ({ roomId, userName }) => {
    const index = rooms[roomId].players.findIndex(
      ({ name }) => name === userName
    )
    if (index < 0) return
    socket.leave(roomId)
    if (rooms[roomId].host.name === userName) {
      delete rooms[roomId]

      emit(SERVER_EVT.leaveRoomRes, { result: 'room closed' })
      emitToRoom(roomId, SERVER_EVT.roomClosed, { result: 'room closed' })
    } else {
      rooms[roomId].players = rooms[roomId].players.filter(
        (_, i) => i !== index
      )
      emit(SERVER_EVT.leaveRoomRes, { result: 'leaved room' })

      emitToRoom(roomId, SERVER_EVT.userLeft, {
        room: rooms[roomId],
        userName,
      })
    }
  })
})

const PORT = 5000
server.listen(PORT, () => {
  console.log(`server listening on port: ${PORT}`)
})
