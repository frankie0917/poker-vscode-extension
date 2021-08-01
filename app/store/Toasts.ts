import { makeAutoObservable } from 'mobx'
import { RootStore } from '.'

export enum ToastType {
  roomClosed = 'roomClosed',
  userLeft = 'userLeft',
}

export class Toasts {
  constructor(private root: RootStore) {
    makeAutoObservable(this)
  }

  toasts: { type: ToastType; isOpen: boolean; message: string }[] = []

  showToast = (type: ToastType, message: string) => {
    this.toasts.push({ isOpen: true, message, type })

    const index = this.toasts.length - 1

    setTimeout(() => {
      this.toasts[index].isOpen = false
    }, 3000)
  }
}
