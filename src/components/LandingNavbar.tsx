import { useNavigate } from 'react-router-dom'
import useAuth from '../hooks/useAuth'

function LandingNavbar() {
    const navigate = useNavigate()
    const { user, signInWithGoogle } = useAuth()

    const scrollTo = (id: string) => {
        const el = document.getElementById(id)
        if (el) {
            const top = el.getBoundingClientRect().top + window.scrollY - 72
            window.scrollTo({ top, behavior: 'smooth' })
        }
    }

    return (
        <nav
            style={{
                position:       'fixed',
                top:            0,
                left:           0,
                right:          0,
                zIndex:         50,
                background:     'var(--color-bg-page)',
                borderBottom:   '1px solid var(--color-border-default)',
                height:         '72px',
                display:        'flex',
                alignItems:     'center',
                justifyContent: 'center',
            }}
        >
            <div
                className="flex items-center justify-between w-full px-8"
                style={{ maxWidth: '1000px' }}
            >
                {/* Left — logo */}
                <img
                    src="/colored-logo.svg"
                    alt="PollBoard"
                    style={{ height: '36px', cursor: 'pointer' }}
                    onClick={() => navigate('/')}
                />

                {/* Middle — text links */}
                <div className="hidden sm:flex items-center gap-10">
                    <button
                        onClick={() => scrollTo('how-it-works')}
                        style={{
                            background:   'transparent',
                            color:        'var(--color-text-secondary)',
                            fontSize:     '17px',
                            fontWeight:   '500',
                            padding:      '6px 0',
                            borderBottom: '2px solid transparent',
                            transition:   'color 150ms ease, border-color 150ms ease',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.color = 'var(--color-text-primary)'
                            e.currentTarget.style.borderBottomColor = 'var(--color-accent)'
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.color = 'var(--color-text-secondary)'
                            e.currentTarget.style.borderBottomColor = 'transparent'
                        }}
                    >
                        How it works
                    </button>
                    <button
                        onClick={() => scrollTo('features')}
                        style={{
                            background:   'transparent',
                            color:        'var(--color-text-secondary)',
                            fontSize:     '17px',
                            fontWeight:   '500',
                            padding:      '6px 0',
                            borderBottom: '2px solid transparent',
                            transition:   'color 150ms ease, border-color 150ms ease',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.color = 'var(--color-text-primary)'
                            e.currentTarget.style.borderBottomColor = 'var(--color-accent)'
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.color = 'var(--color-text-secondary)'
                            e.currentTarget.style.borderBottomColor = 'transparent'
                        }}
                    >
                        Features
                    </button>
                </div>

                {/* Right — sign in + CTA */}
                <div className="flex items-center gap-5">
                    {user ? (
                        <button
                            onClick={() => navigate('/dashboard')}
                            style={{
                                background: 'transparent',
                                color:      'var(--color-text-secondary)',
                                fontSize:   '17px',
                                fontWeight: '500',
                                transition: 'color 150ms ease',
                            }}
                            onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text-primary)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
                        >
                            Dashboard
                        </button>
                    ) : (
                        <button
                            onClick={() => signInWithGoogle()}
                            style={{
                                background: 'transparent',
                                color:      'var(--color-text-secondary)',
                                fontSize:   '17px',
                                fontWeight: '500',
                                transition: 'color 150ms ease',
                            }}
                            onMouseEnter={e => e.currentTarget.style.color = 'var(--color-text-primary)'}
                            onMouseLeave={e => e.currentTarget.style.color = 'var(--color-text-secondary)'}
                        >
                            Sign in
                        </button>
                    )}

                    <button
                        onClick={() => navigate('/create')}
                        style={{
                            background:    'var(--color-accent)',
                            color:         'var(--color-text-on-teal)',
                            fontSize:      '17px',
                            fontWeight:    '500',
                            padding:       '11px 26px',
                            borderRadius:  '8px',
                            border:        'none',
                            cursor:        'pointer',
                            transition:    'background 150ms ease, transform 100ms ease',
                            letterSpacing: '-0.01em',
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.background = 'var(--color-accent-hover)'
                            e.currentTarget.style.transform  = 'translateY(-1px)'
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.background = 'var(--color-accent)'
                            e.currentTarget.style.transform  = 'translateY(0)'
                        }}
                    >
                        + Create poll
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default LandingNavbar