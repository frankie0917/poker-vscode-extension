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
import { Game, makeDefaultGame } from '../shared/Game'
import { omit } from 'lodash'
import { ServerUser } from '../shared/User'

const server = http.createServer()

let rooms: Record<string, Room> = {}

let socketMap: Record<string, { roomId: string; userName: string }> = {}

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

  const emitError = (message: string) => {
    emit(SERVER_EVT.error, { message })
  }

  const emitToRoom = <T extends SERVER_EVT>(
    roomId: string,
    type: T,
    data: ServerEvtDataMap[T]
  ) => {
    io.in(roomId).emit(type, data)
  }

  const emitToSocket = <T extends SERVER_EVT>(
    id: string,
    type: T,
    data: ServerEvtDataMap[T]
  ) => {
    io.to(id).emit(type, data)
  }

  on(CLIENT_EVT.userMessage, ({ message, user, roomId, time }) => {
    emitToRoom(roomId, SERVER_EVT.userMessage, { user, message, time })
  })

  on(CLIENT_EVT.hostRoom, async (data) => {
    const roomId = makeRoomID()
    const user = { ...data.user, socketId: socket.id }
    const room: Room = {
      id: roomId,
      host: user,
      players: [user],
      game: makeDefaultGame(),
    }
    rooms[roomId] = room
    socketMap[socket.id] = {
      roomId,
      userName: data.user.name,
    }
    socket.join(roomId)
    emit(SERVER_EVT.hostRoomRes, { room })
  })

  on(CLIENT_EVT.joinRoom, async ({ id, user }) => {
    const res = rooms[id]
    if (res === undefined) {
      emit(SERVER_EVT.joinRoomRes, { error: 'notFound' })
      return
    }

    if (res.players.length === 8) {
      emit(SERVER_EVT.joinRoomRes, { error: 'the room already has 8 players' })
      return
    }
    rooms[id].players.push({ ...user, socketId: socket.id })
    socketMap[socket.id] = {
      roomId: id,
      userName: user.name,
    }
    await socket.join(id)
    emit(SERVER_EVT.joinRoomRes, { room: res })
    emitToRoom(id, SERVER_EVT.userJoin, {
      room: rooms[id],
      userName: user.name,
    })
  })

  on(CLIENT_EVT.leaveRoom, async ({ userName }) => {
    const roomId = socketMap[socket.id].roomId
    if (!roomId) {
      emitError('Not in any room')
      return
    }

    const index = rooms[roomId].players.findIndex(
      ({ name }) => name === userName
    )
    if (index < 0) return
    await socket.leave(roomId)
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

  on(CLIENT_EVT.startGame, ({ blinds, money }) => {
    const socketData = socketMap[socket.id]
    if (!socketData.roomId) {
      emitError('Not in any room')
      return
    }
    if (rooms[socketData.roomId].host.name !== socketData.userName) {
      emitError('Permission denied: Not the room host')
      return
    }

    const room = rooms[socketData.roomId]

    if (room.players.length < 2) {
      emitError('Need At leaset 2 players')
      return
    }

    const isSolo = room.players.length === 2
    const dealerIndex = Math.floor(Math.random() * room.players.length)

    const res: Game = {
      ...makeDefaultGame(),
      blinds,
      running: true,
      position: {
        dealer: dealerIndex,
        smallBlind: isSolo ? -1 : (dealerIndex + 1) % room.players.length,
        bigBlind: (dealerIndex + (isSolo ? 1 : 2)) % room.players.length,
      },
    }

    res.deck.shuffle()

    res.players = room.players.map((data) => ({
      active: true,
      data,
      hand: res.deck.draw(2),
      status: 'waiting',
      role: 'normal',
      bet: 0,
      money,
    }))

    res.players[res.position.dealer].role = 'Dealer'
    if (!isSolo) {
      res.players[res.position.smallBlind].role = 'Small blind'
      res.players[res.position.smallBlind].money -= res.blinds.small
      res.players[res.position.smallBlind].bet += res.blinds.small
    }

    res.players[res.position.bigBlind].role = 'Big blind'
    res.players[res.position.bigBlind].money -= res.blinds.big
    res.players[res.position.bigBlind].bet += res.blinds.big

    res.bet = res.blinds.big

    res.pool = res.blinds.big + (isSolo ? 0 : res.blinds.small)
    res.players[
      (isSolo ? res.position.dealer : res.position.bigBlind + 1) %
        res.players.length
    ].status = 'betting'

    rooms[socketData.roomId].game = res

    const withoutId = (player: ServerUser) => omit(player, 'socketId')

    rooms[socketData.roomId].game.players.forEach((player) => {
      emitToSocket(player.data.socketId, SERVER_EVT.preflop, {
        player: { ...player, data: withoutId(player.data) },
        room: {
          ...room,
          host: withoutId(room.host),
          players: room.players.map((p) => withoutId(p)),
          game: {
            ...res,
            players: res.players.map((p) => omit(p, 'hand')),
          },
        },
      })
    })
  })

  on(CLIENT_EVT.callBet, () => {
    const socketData = socketMap[socket.id]
    if (!socketData.roomId) {
      emitError('Not in any room')
      return
    }
    const room = rooms[socketData.roomId]

    const playerIndex = room.players.findIndex(
      ({ socketId }) => socket.id === socketId
    )
    if (playerIndex < 0) {
      emitError('Player not found')
      return
    }
    const res = room
    res.game.players[playerIndex].bet = res.game.bet
    res.game.players[playerIndex].money -= res.game.bet
    res.game.pool += res.game.bet
  })
})

const PORT = 5000
server.listen(PORT, () => {
  console.log(`server listening on port: ${PORT}`)
})
