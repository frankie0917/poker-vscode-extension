import { makeAutoObservable } from 'mobx'
import { RootStore } from '.'

export interface UserT {
  avavatarUrl: string
  name: string
}

export class User {
  constructor(private root: RootStore) {
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
