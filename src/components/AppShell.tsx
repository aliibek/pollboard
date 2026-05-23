import { type ReactNode } from 'react'
import Navbar from './Navbar'
import Toast from './Toast'

type Props = { children: ReactNode }

function AppShell({ children }: Props) {
    return (
        <div className="min-h-screen" style={{ background: 'var(--color-bg-page)' }}>
            <Navbar />
            <main className="mx-auto px-4 sm:px-6 py-8" style={{ maxWidth: '720px' }}>
                {children}
            </main>
            <Toast />
        </div>
    )
}

export default AppShell