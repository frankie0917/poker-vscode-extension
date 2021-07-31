import { makeAutoObservable } from 'mobx'
import { RootStore } from '.'
import { User as UserT } from '../../shared/User'

export class User {
  constructor(private root: RootStore) {
    makeAutoObservable(this)
  }
  data: UserT | null = null

  setUser = (data: UserT) => {
    this.data = data
  }

  login = () => {
    if (window.vscode) {
      window.vscode.postMessage({ type: 'login' })
      return
    }

    this.setUser({
      name: 'fakeUser',
      avatarUrl: 'https://dummyimage.com/400x400.png',
    })
  }
}
