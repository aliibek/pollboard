import { type ReactNode } from 'react'
import { useLocation } from 'react-router-dom'
import Navbar from './Navbar'
import LandingNavbar from './LandingNavbar'
import Toast from './Toast'
import useThemeStore from '../store/themeStore'

type Props = { children: ReactNode }

function AppShell({ children }: Props) {
    const { pathname }       = useLocation()
    const isLanding          = pathname === '/'
    const { isDark, toggle } = useThemeStore()

    return (
        <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg-page)' }}>
            {isLanding ? <LandingNavbar /> : <Navbar />}
            <main
                className="flex-1 w-full"
                style={{
                    maxWidth:   isLanding ? '100%' : '720px',
                    margin:     isLanding ? '0' : '0 auto',
                    padding:    isLanding ? '72px 0 0' : '32px 24px',
                }}
            >
                {children}
            </main>
            <footer
                className="w-full px-6 sm:px-8 py-6 mt-auto"
                style={{ borderTop: '1px solid var(--color-border-default)' }}
            >
                <div
                    className="mx-auto flex items-center justify-between"
                    style={{ maxWidth: '1000px' }}
                >
                    <img
                        src="/colored-logo.svg"
                        alt="PollBoard"
                        style={{ height: '28px' }}
                    />
                    <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
      Fast, real-time polling for everyone
    </span>
                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggle}
                            className="text-sm flex items-center gap-2 transition-all duration-150"
                            style={{ color: 'var(--color-text-muted)' }}
                            onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-muted)'}
                        >
                            {isDark ? '☀️' : '🌙'}
                            <span>{isDark ? 'Light mode' : 'Dark mode'}</span>
                        </button>
                        <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
        © 2026
      </span>
                    </div>
                </div>
            </footer>
            <Toast />
        </div>
    )
}

export default AppShell