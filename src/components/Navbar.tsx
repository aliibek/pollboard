import { useNavigate } from 'react-router-dom'

function Navbar() {
    const navigate = useNavigate()

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
        </nav>
    )
}

export default Navbar