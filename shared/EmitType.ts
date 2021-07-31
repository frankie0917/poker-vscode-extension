import { User } from './User'
import { Room } from './Room'
export enum CLIENT_EVT {
  hostRoom = 'hostRoom',
  joinRoom = 'joinRoom',
}

export type ClientEvtDataMap = {
  [CLIENT_EVT.hostRoom]: {
    user: User
  }
  [CLIENT_EVT.joinRoom]: { id: string }
}

export enum SERVER_EVT {
  hostRoomRes = 'hostRoomRes',
  joinRoomRes = 'joinRoomRes',
}

export type ServerEvtDataMap = {
  [SERVER_EVT.hostRoomRes]: {
    room: Room
  }
  [SERVER_EVT.joinRoomRes]: {
    room?: Room
    error?: 'notFound'
  }
}
