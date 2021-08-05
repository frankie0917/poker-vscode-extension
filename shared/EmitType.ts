import { User } from './User'
import { Room, ClientRoom } from './Room'
import { ChatMessage } from './ChatMessage'
import { ClientPlayer, Player } from './Game'
export enum CLIENT_EVT {
  hostRoom = 'hostRoom',
  joinRoom = 'joinRoom',
  leaveRoom = 'leaveRoom',
  userMessage = 'userMessage',
  startGame = 'startGame',
  callBet = 'callBet',
}

export type ClientEvtDataMap = {
  [CLIENT_EVT.hostRoom]: {
    user: User
  }
  [CLIENT_EVT.joinRoom]: { id: string; user: User }
  [CLIENT_EVT.leaveRoom]: { userName: string }
  [CLIENT_EVT.userMessage]: ChatMessage
  [CLIENT_EVT.startGame]: {
    blinds: {
      small: number
      big: number
    }
    money: number
  }
  [CLIENT_EVT.callBet]: {}
}

export enum SERVER_EVT {
  hostRoomRes = 'hostRoomRes',
  joinRoomRes = 'joinRoomRes',
  leaveRoomRes = 'leaveRoomRes',
  roomClosed = 'roomClosed',
  userJoin = 'userJoin',
  userLeft = 'userLeft',
  userMessage = 'userMessage',
  error = 'error',
  preflop = 'preflop',
}

export type ServerEvtDataMap = {
  [SERVER_EVT.hostRoomRes]: {
    room: Room
  }
  [SERVER_EVT.joinRoomRes]: {
    room?: Room
    error?: 'notFound' | 'the room already has 8 players'
  }
  [SERVER_EVT.leaveRoomRes]: {
    result: 'leaved room' | 'room closed'
  }
  [SERVER_EVT.roomClosed]: {
    result: 'room closed'
  }
  [SERVER_EVT.userJoin]: {
    room: ClientRoom
    userName: string
  }
  [SERVER_EVT.userLeft]: {
    room: ClientRoom
    userName: string
  }
  [SERVER_EVT.userMessage]: {
    user: User
    message: string
    time: Date
  }
  [SERVER_EVT.error]: {
    message: string
  }
  [SERVER_EVT.preflop]: {
    player: ClientPlayer
    room: ClientRoom
  }
}
