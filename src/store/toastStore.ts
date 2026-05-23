import { create } from 'zustand'
import { type ToastType } from '../types'

type ToastStore = {
    toasts: ToastType[]
    addToast: (message: string, type: 'success' | 'error') => void
    removeToast: (id: string) => void
}

const useToastStore = create<ToastStore>((set) => ({
    toasts: [],
    addToast: (message, type) => {
        const id = Math.random().toString(36).slice(2)
        set(state => ({ toasts: [...state.toasts, { id, message, type }] }))
        setTimeout(() => {
            set(state => ({ toasts: state.toasts.filter(t => t.id !== id) }))
        }, 3000)
    },
    removeToast: (id) =>
        set(state => ({ toasts: state.toasts.filter(t => t.id !== id) })),
}))

export default useToastStore