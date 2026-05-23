import { type ReactNode } from 'react'
import Navbar from './Navbar'
import Toast from './Toast'

type Props = { children: ReactNode }

function AppShell({ children }: Props) {
    return (
        <div className="min-h-screen flex flex-col" style={{ background: 'var(--color-bg-page)' }}>
            <Navbar />
            <main className="flex-1 mx-auto w-full px-4 sm:px-6 py-8" style={{ maxWidth: '720px' }}>
                {children}
            </main>
            <footer
                className="w-full px-4 sm:px-6 py-5 mt-auto"
                style={{ borderTop: '1px solid var(--color-border-default)' }}
            >
                <div
                    className="mx-auto flex items-center justify-between"
                    style={{ maxWidth: '720px' }}
                >
          <span className="text-sm font-medium" style={{ color: 'var(--color-accent)' }}>
            PollBoard
          </span>
                    <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            Fast, real-time polling for everyone
          </span>
                    <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            © 2026
          </span>
                </div>
            </footer>
            <Toast />
        </div>
    )
}

export default AppShell