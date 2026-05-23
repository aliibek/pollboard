import { useNavigate } from 'react-router-dom'
import useThemeStore from '../store/themeStore'

function Navbar() {
    const navigate       = useNavigate()
    const { isDark, toggle } = useThemeStore()

    return (
        <nav
            className="w-full px-4 sm:px-6 h-14 flex items-center justify-between"
            style={{
                borderBottom: '1px solid var(--color-border-default)',
                background:   'var(--color-bg-page)',
            }}
        >
      <span
          className="text-base font-medium cursor-pointer"
          style={{ color: 'var(--color-accent)' }}
          onClick={() => navigate('/')}
      >
        PollBoard
      </span>

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