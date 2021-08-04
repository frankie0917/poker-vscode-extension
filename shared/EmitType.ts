import { User } from './User'
import { Room } from './Room'
export enum CLIENT_EVT {
  hostRoom = 'hostRoom',
  joinRoom = 'joinRoom',
  leaveRoom = 'leaveRoom',
  userMessage = 'userMessage',
}

export type ClientEvtDataMap = {
  [CLIENT_EVT.hostRoom]: {
    user: User
  }
  [CLIENT_EVT.joinRoom]: { id: string; user: User }
  [CLIENT_EVT.leaveRoom]: { roomId: string; userName: string }
  [CLIENT_EVT.userMessage]: {
    roomId: string
    user: User
    message: string
  }
}

export enum SERVER_EVT {
  hostRoomRes = 'hostRoomRes',
  joinRoomRes = 'joinRoomRes',
  leaveRoomRes = 'leaveRoomRes',
  roomClosed = 'roomClosed',
  userLeft = 'userLeft',
  userMessage = 'userMessage',
}

export type ServerEvtDataMap = {
  [SERVER_EVT.hostRoomRes]: {
    room: Room
  }
  [SERVER_EVT.joinRoomRes]: {
    room?: Room
    error?: 'notFound'
  }
  [SERVER_EVT.leaveRoomRes]: {
    result: 'leaved room' | 'room closed'
  }
  [SERVER_EVT.roomClosed]: {
    result: 'room closed'
  }
  [SERVER_EVT.userLeft]: {
    room: Room
    userName: string
  }
  [SERVER_EVT.userMessage]: {
    user: User
    message: string
  }
}
