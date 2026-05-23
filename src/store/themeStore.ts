import { create } from 'zustand'

type ThemeStore = {
    isDark: boolean
    toggle: () => void
}

const useThemeStore = create<ThemeStore>((set) => {
    const stored = localStorage.getItem('pollboard_theme')
    const isDark = stored ? stored === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches

    if (isDark) document.documentElement.classList.add('dark')

    return {
        isDark,
        toggle: () =>
            set(state => {
                const next = !state.isDark
                if (next) {
                    document.documentElement.classList.add('dark')
                    localStorage.setItem('pollboard_theme', 'dark')
                } else {
                    document.documentElement.classList.remove('dark')
                    localStorage.setItem('pollboard_theme', 'light')
                }
                return { isDark: next }
            }),
    }
})

export default useThemeStore