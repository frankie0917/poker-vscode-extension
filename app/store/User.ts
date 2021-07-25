import { makeAutoObservable } from 'mobx'

export interface UserT {
  avavatarUrl: string
  name: string
}

export class User {
  constructor() {
    makeAutoObservable(this)
  }
  data: UserT | null = null

  setUser(data: UserT) {
    this.data = data
  }

  login() {
    window.vscode.postMessage({ type: 'login' })
  }
}
