import { makeAutoObservable } from 'mobx'
import { RootStore } from '.'

export class Toasts {
  constructor(private root: RootStore) {
    makeAutoObservable(this)
  }

  toasts: { isOpen: boolean; message: string }[] = []

  showToast = (message: string) => {
    this.toasts.push({ isOpen: true, message })

    const index = this.toasts.length - 1

    setTimeout(() => {
      this.toasts[index].isOpen = false
    }, 3000)
  }
}
