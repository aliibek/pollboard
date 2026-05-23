import { useNavigate } from 'react-router-dom'
import useThemeStore from '../store/themeStore'
import useAuth from '../hooks/useAuth'

function Navbar() {
    const navigate           = useNavigate()
    const { isDark, toggle } = useThemeStore()
    const { user, signInWithGoogle, signOut } = useAuth()

    return (
        <nav
            className="w-full px-4 sm:px-6 h-16 flex items-center justify-between"
            style={{
                borderBottom: '1px solid var(--color-border-default)',
                background:   'var(--color-bg-page)',
            }}
        >
            <img
                src="/colored-logo.svg"
                alt="PollBoard"
                style={{ height: '40px', cursor: 'pointer' }}
                onClick={() => navigate('/')}
            />

            <div className="flex items-center gap-3">
                <button
                    onClick={toggle}
                    className="w-8 h-8 flex items-center justify-center rounded-md transition-all duration-150 text-base"
                    style={{
                        background: 'var(--color-bg-stone)',
                        color:      'var(--color-text-secondary)',
                    }}
                    title={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
                >
                    {isDark ? '☀️' : '🌙'}
                </button>

                {user ? (
                    <div className="flex items-center gap-3">
                        <div className="flex items-center gap-2">
                            {user.user_metadata?.avatar_url && (
                                <img
                                    src={user.user_metadata.avatar_url}
                                    alt="avatar"
                                    className="rounded-full"
                                    style={{ width: '28px', height: '28px' }}
                                />
                            )}
                            <span
                                className="text-xs font-medium hidden sm:block"
                                style={{ color: 'var(--color-text-secondary)' }}
                            >
                {user.user_metadata?.full_name?.split(' ')[0] ?? user.email}
              </span>
                        </div>
                        <button
                            onClick={signOut}
                            className="text-sm font-medium px-3 py-1.5 rounded-md transition-all duration-150"
                            style={{
                                background: 'var(--color-bg-stone)',
                                color:      'var(--color-text-secondary)',
                                height: '32px',
                            }}
                        >
                            Sign out
                        </button>
                    </div>
                ) : (
                    <button
                        onClick={signInWithGoogle}
                        className="text-sm font-medium px-3 py-1.5 rounded-md transition-all duration-150 flex items-center gap-2"
                        style={{
                            background: 'var(--color-bg-stone)',
                            color:      'var(--color-text-secondary)',
                            border:     '1px solid var(--color-border-default)',
                            height: '32px',
                        }}
                    >
                        <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: '15px', height: '15px' }} />
                        Sign in
                    </button>
                )}

                <button
                    onClick={() => navigate('/create')}
                    className="text-sm font-medium px-4 py-1.5 rounded-md transition-all duration-150"
                    style={{
                        background: 'var(--color-accent)',
                        color:      'var(--color-text-on-teal)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-accent-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--color-accent)'}
                >
                    + Create poll
                </button>
            </div>
        </nav>
    )
}

export default Navbar