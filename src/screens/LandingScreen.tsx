import { ArrowUp } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useState, useEffect } from 'react'

function PollDemo() {
    const [votes, setVotes] = useState([7, 3, 2])
    const total  = votes.reduce((a, b) => a + b, 0)
    const winner = votes.indexOf(Math.max(...votes))
    const OPTIONS = ['React', 'Vue', 'Svelte']

    useEffect(() => {
        const interval = setInterval(() => {
            setVotes(prev => {
                const next = [...prev]
                next[Math.floor(Math.random() * 3)]++
                return next
            })
        }, 1800)
        return () => clearInterval(interval)
    }, [])

    return (
        <div
            style={{
                background:   'var(--color-bg-card)',
                border:       '1px solid var(--color-border-default)',
                borderRadius: '16px',
                padding:      '28px',
                boxShadow:    '0 4px 24px rgb(0 0 0 / 0.08)',
            }}
        >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
        <span style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: 'var(--color-accent)', display: 'inline-block',
            animation: 'pulse-dot 2s ease-in-out infinite', flexShrink: 0,
        }} />
                <span style={{ fontSize: '13px', fontWeight: '500', color: 'var(--color-accent)' }}>Live</span>
                <span style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginLeft: 'auto' }}>{total} votes</span>
            </div>
            <p style={{ fontSize: '17px', fontWeight: '500', color: 'var(--color-text-primary)', marginBottom: '6px' }}>
                What's your favorite framework?
            </p>
            <p style={{ fontSize: '13px', color: 'var(--color-text-muted)', marginBottom: '20px' }}>3 options · open</p>
            {OPTIONS.map((opt, i) => {
                const pct = Math.round(votes[i] / total * 100)
                const isWinner = i === winner
                return (
                    <div key={i} style={{
                        position: 'relative', overflow: 'hidden',
                        padding: '12px 16px', borderRadius: '10px',
                        border: `1px solid ${isWinner ? 'var(--color-accent)' : 'var(--color-border-default)'}`,
                        background: isWinner ? 'var(--color-bg-teal-subtle)' : 'var(--color-bg-card)',
                        marginBottom: '10px', display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between', transition: 'border-color 0.3s ease',
                    }}>
                        <div style={{
                            position: 'absolute', left: 0, top: 0, height: '100%',
                            width: `${pct}%`, background: 'var(--color-accent)',
                            opacity: 0.07, borderRadius: '10px',
                            transition: 'width 0.8s cubic-bezier(0.34, 1.56, 0.64, 1)',
                        }} />
                        <span style={{ position: 'relative', fontSize: '15px', fontWeight: '500', color: isWinner ? 'var(--color-text-teal)' : 'var(--color-text-primary)' }}>{opt}</span>
                        <span style={{ position: 'relative', fontSize: '14px', color: isWinner ? 'var(--color-accent)' : 'var(--color-text-muted)' }}>{pct}%</span>
                    </div>
                )
            })}
        </div>
    )
}

function HowItWorksCard({ step, title, desc, image }: { step: string; title: string; desc: string; image: React.ReactNode }) {
    return (
        <div style={{
            borderRadius: '16px',
            border:       '1px solid var(--color-border-default)',
            overflow:     'hidden',
            background:   'var(--color-bg-card)',
        }}>
            <div style={{ height: '220px', position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center', overflow: 'hidden' }}>
                {image}
            </div>
            <div style={{ padding: '28px' }}>
                <p style={{
                    fontSize:      '12px',
                    fontWeight:    '500',
                    color:         'var(--color-text-muted)',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    marginBottom:  '10px',
                }}>
                    {step}
                </p>
                <p style={{
                    fontSize:      '22px',
                    fontWeight:    '500',
                    color:         'var(--color-text-primary)',
                    letterSpacing: '-0.02em',
                    marginBottom:  '10px',
                }}>
                    {title}
                </p>
                <p style={{
                    fontSize:   '15px',
                    color:      'var(--color-text-secondary)',
                    lineHeight: '1.6',
                }}>
                    {desc}
                </p>
            </div>
        </div>
    )
}

function LandingScreen() {
    const navigate = useNavigate()
    const [showScrollTop, setShowScrollTop] = useState(false)
    const [activeFeature, setFeature] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => setFeature(f => (f + 1) % 5), 3500)
        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        const handleScroll = () => setShowScrollTop(window.scrollY > window.innerHeight * 0.5)
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    const scrollToTop = () => window.scrollTo({ top: 0, behavior: 'smooth' })

    const mockCard = (children: React.ReactNode) => (
        <div style={{
            background:   'var(--color-bg-card)',
            border:       '1px solid var(--color-border-default)',
            borderRadius: '10px',
            padding:      '16px',
            width:        '200px',
        }}>
            {children}
        </div>
    )

    const FEATURES = [
        {
            icon:  '⚡',
            title: 'Real-time results',
            desc:  'Votes update live as they happen. Every vote appears instantly — no refresh needed.',
            mockup: mockCard(
                <>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '12px' }}>
                        <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'var(--color-accent)' }} />
                        <span style={{ fontSize: '11px', fontWeight: '500', color: 'var(--color-accent)' }}>Live · 24 votes</span>
                    </div>
                    {[['React', '58%', 58], ['Vue', '28%', 28], ['Svelte', '14%', 14]].map(([l, p, w]) => (
                        <div key={l as string} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '6px' }}>
                            <span style={{ fontSize: '10px', color: 'var(--color-text-secondary)', minWidth: '36px' }}>{l}</span>
                            <div style={{ flex: 1, height: '5px', borderRadius: '3px', background: 'var(--color-bg-stone)', overflow: 'hidden' }}>
                                <div style={{ height: '5px', borderRadius: '3px', background: 'var(--color-accent)', width: `${w}%`, opacity: l === 'React' ? 1 : 0.4 }} />
                            </div>
                            <span style={{ fontSize: '10px', color: l === 'React' ? 'var(--color-accent)' : 'var(--color-text-muted)', minWidth: '24px' }}>{p}</span>
                        </div>
                    ))}
                </>
            ),
        },
        {
            icon:  '🔗',
            title: 'Instant sharing',
            desc:  'One link. Anyone can vote without creating an account — no signup, no friction, no barriers.',
            mockup: mockCard(
                <>
                    <p style={{ fontSize: '11px', fontWeight: '500', color: 'var(--color-text-primary)', marginBottom: '8px' }}>Share your poll</p>
                    <div style={{ fontSize: '10px', color: 'var(--color-text-secondary)', fontFamily: 'monospace', background: 'var(--color-bg-subtle)', padding: '6px 8px', borderRadius: '6px', marginBottom: '8px' }}>
                        pollboard.app/vote/xk92m
                    </div>
                    <div style={{ width: '100%', padding: '8px', borderRadius: '6px', background: 'var(--color-accent)', color: '#fff', fontSize: '11px', fontWeight: '500', textAlign: 'center' }}>
                        Copy link
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }}>
                        <div style={{ width: '56px', height: '56px', background: '#1c1917', borderRadius: '6px', display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '2px', padding: '5px' }}>
                            {[1,1,0,1,1, 1,0,1,0,1, 0,1,0,1,0, 1,0,1,0,1, 1,1,0,1,1].map((v, i) => (
                                <div key={i} style={{ background: v ? '#fff' : '#1c1917', borderRadius: '1px' }} />
                            ))}
                        </div>
                    </div>
                </>
            ),
        },
        {
            icon:  '📱',
            title: 'QR code sharing',
            desc:  'Generate a QR code for any poll. Perfect for meetings, classrooms, or events — scan and vote instantly.',
            mockup: (
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '12px' }}>
                    <div style={{ width: '100px', height: '100px', background: '#1c1917', borderRadius: '10px', display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: '2px', padding: '8px' }}>
                        {[1,1,1,0,1,1,1, 1,0,1,0,1,0,1, 1,1,0,1,0,1,1, 0,1,1,0,1,1,0, 1,0,1,1,1,0,1, 1,1,0,1,0,1,1, 1,1,1,0,1,1,1].flat().map((v, i) => (
                            <div key={i} style={{ background: v ? '#fff' : '#1c1917', borderRadius: '1px' }} />
                        ))}
                    </div>
                    <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)' }}>Scan to vote instantly</p>
                </div>
            ),
        },
        {
            icon:  '📊',
            title: 'Voter insights',
            desc:  'See exactly who voted for what. Names and choices — all visible to the poll creator.',
            mockup: mockCard(
                <>
                    <p style={{ fontSize: '11px', fontWeight: '500', color: 'var(--color-text-primary)', marginBottom: '10px' }}>Who voted</p>
                    {[
                        { initials: 'AM', name: 'Ali M.',    choice: 'React', bg: '#ccfbf1', color: '#0d9488' },
                        { initials: 'JS', name: 'John S.',   choice: 'Vue',   bg: '#fef3c7', color: '#d97706' },
                        { initials: '?',  name: 'Anonymous', choice: 'React', bg: '#ccfbf1', color: '#0d9488', anon: true },
                    ].map((v, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '7px 0', borderBottom: i < 2 ? '1px solid var(--color-border-default)' : 'none' }}>
                            <div style={{ width: '24px', height: '24px', borderRadius: '50%', background: v.anon ? 'var(--color-bg-stone)' : '#ccfbf1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: '500', color: v.anon ? 'var(--color-text-muted)' : '#0d9488', flexShrink: 0 }}>
                                {v.initials}
                            </div>
                            <span style={{ fontSize: '12px', color: v.anon ? 'var(--color-text-muted)' : 'var(--color-text-primary)', fontStyle: v.anon ? 'italic' : 'normal', flex: 1 }}>{v.name}</span>
                            <span style={{ fontSize: '10px', fontWeight: '500', padding: '2px 6px', borderRadius: '8px', background: v.bg, color: v.color }}>{v.choice}</span>
                        </div>
                    ))}
                </>
            ),
        },
        {
            icon:  '🚀',
            title: 'No limits, ever',
            desc:  'Unlimited polls, unlimited votes, unlimited participants. Free forever — no credit card, no upgrade required.',
            mockup: mockCard(
                <>
                    <p style={{ fontSize: '11px', fontWeight: '500', color: 'var(--color-text-primary)', marginBottom: '12px' }}>Your plan</p>
                    {[['Polls created', '∞ Unlimited'], ['Voters per poll', '∞ Unlimited'], ['Price', 'Free']].map(([label, value]) => (
                        <div key={label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                            <span style={{ fontSize: '11px', color: 'var(--color-text-secondary)' }}>{label}</span>
                            <span style={{ fontSize: '11px', fontWeight: '500', color: 'var(--color-accent)' }}>{value}</span>
                        </div>
                    ))}
                    <div style={{ padding: '8px', borderRadius: '6px', background: 'var(--color-accent-light)', textAlign: 'center', fontSize: '11px', fontWeight: '500', color: 'var(--color-accent-hover)', marginTop: '4px' }}>
                        No credit card required
                    </div>
                </>
            ),
        },
    ]
    const card1Image = (
        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #ccfbf1 0%, #99f6e4 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: '10px', padding: '14px 16px', boxShadow: '0 4px 16px rgb(0 0 0/.12)', transform: 'rotate(-2deg)', minWidth: '160px' }}>
                <p style={{ fontSize: '11px', fontWeight: '500', color: '#1c1917', marginBottom: '8px' }}>Best team lunch spot?</p>
                <div style={{ height: '6px', borderRadius: '3px', background: '#0d9488', width: '70%', marginBottom: '5px' }} />
                <div style={{ height: '6px', borderRadius: '3px', background: '#e7e5e0', width: '40%', marginBottom: '5px' }} />
                <div style={{ height: '6px', borderRadius: '3px', background: '#e7e5e0', width: '25%' }} />
            </div>
        </div>
    )

    const card2Image = (
        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #e0f2fe 0%, #bae6fd 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '16px' }}>
            <div style={{ background: '#fff', borderRadius: '10px', padding: '10px 14px', boxShadow: '0 4px 16px rgb(0 0 0/.12)', transform: 'rotate(1deg)' }}>
                <p style={{ fontSize: '10px', color: '#78716c', fontFamily: 'monospace', background: '#f5f5f4', padding: '4px 8px', borderRadius: '4px', marginBottom: '6px' }}>pollboard.app/vote/abc123</p>
                <span style={{ fontSize: '10px', fontWeight: '500', color: '#fff', background: '#0d9488', padding: '4px 10px', borderRadius: '4px' }}>Copy link</span>
            </div>
            <div style={{ background: '#fff', borderRadius: '8px', padding: '8px', boxShadow: '0 4px 12px rgb(0 0 0/.1)', transform: 'rotate(-1deg)' }}>
                <div style={{ width: '52px', height: '52px', background: '#1c1917', borderRadius: '4px', display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: '2px', padding: '4px' }}>
                    {[1,1,0,1,1, 1,0,1,0,1, 0,1,0,1,0, 1,0,1,0,1, 1,1,0,1,1].map((v, i) => (
                        <div key={i} style={{ background: v ? '#fff' : '#1c1917', borderRadius: '1px' }} />
                    ))}
                </div>
            </div>
        </div>
    )

    const card3Image = (
        <div style={{ width: '100%', height: '100%', background: 'linear-gradient(135deg, #fef9c3 0%, #fde68a 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <div style={{ background: '#fff', borderRadius: '10px', padding: '14px 16px', boxShadow: '0 4px 16px rgb(0 0 0/.12)', transform: 'rotate(-1deg)', minWidth: '170px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '10px' }}>
                    <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#0d9488' }} />
                    <span style={{ fontSize: '10px', fontWeight: '500', color: '#0d9488' }}>Live · 42 votes</span>
                </div>
                {[['React', '62%', '62%'], ['Vue', '28%', '28%'], ['Svelte', '10%', '10%']].map(([label, pct, w]) => (
                    <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '5px' }}>
                        <span style={{ fontSize: '10px', color: '#57534e', minWidth: '38px' }}>{label}</span>
                        <div style={{ flex: 1, height: '5px', borderRadius: '3px', background: '#e7e5e0', overflow: 'hidden' }}>
                            <div style={{ height: '5px', borderRadius: '3px', background: '#0d9488', width: w }} />
                        </div>
                        <span style={{ fontSize: '10px', color: '#a8a29e', minWidth: '24px', textAlign: 'right' }}>{pct}</span>
                    </div>
                ))}
            </div>
        </div>
    )

    return (
        <div>

            {/* Hero */}
            <div style={{
                minHeight: 'calc(100vh - 72px)',
                borderBottom: '1px solid var(--color-border-default)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
                <div style={{
                    display: 'grid', gridTemplateColumns: '1fr 1fr',
                    gap: '64px', alignItems: 'center',
                    maxWidth: '1000px', width: '100%', padding: '0 48px',
                }}>
                    <div>
                        <h1 style={{
                            fontSize: '56px', fontWeight: '500', lineHeight: '1.1',
                            letterSpacing: '-0.04em', color: 'var(--color-text-primary)', marginBottom: '20px',
                        }}>
                            Create a poll<br />
                            <span style={{ color: 'var(--color-accent)' }}>in seconds.</span>
                        </h1>
                        <p style={{
                            fontSize: '18px', color: 'var(--color-text-secondary)',
                            lineHeight: '1.6', marginBottom: '32px', maxWidth: '400px',
                        }}>
                            <span style={{ color: 'var(--color-text-primary)', fontWeight: '500' }}>No account needed.</span>{' '}
                            Share a link. Watch votes roll in live as they happen.
                        </p>
                        <button
                            onClick={() => navigate('/create')}
                            style={{
                                background: 'var(--color-accent)', color: 'var(--color-text-on-teal)',
                                fontSize: '16px', fontWeight: '500', padding: '14px 28px',
                                borderRadius: '8px', border: 'none', cursor: 'pointer',
                                transition: 'background 150ms ease, transform 100ms ease',
                            }}
                            onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-accent-hover)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                            onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-accent)'; e.currentTarget.style.transform = 'translateY(0)' }}
                        >
                            + Create your first poll
                        </button>
                    </div>
                    <div><PollDemo /></div>
                </div>
            </div>

            {/* How it works */}
            <div
                id="how-it-works"
                style={{
                    minHeight: 'calc(100vh - 72px)',
                    borderBottom: '1px solid var(--color-border-default)',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    padding: '80px 48px',
                }}
            >
                <h2 style={{
                    fontSize: '44px', fontWeight: '500', letterSpacing: '-0.04em',
                    color: 'var(--color-text-primary)', textAlign: 'center', marginBottom: '12px',
                }}>
                    How it works
                </h2>
                <p style={{
                    fontSize: '17px', color: 'var(--color-text-secondary)',
                    textAlign: 'center', marginBottom: '56px', lineHeight: '1.6',
                }}>
                    From idea to live poll in under 30 seconds.
                </p>
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)',
                    gap: '20px', maxWidth: '1000px', width: '100%',
                }}>
                    <HowItWorksCard
                        step="Step 01" title="Create your poll"
                        desc="Add a question, up to 6 options, set an expiry or leave it open. No account needed — just open and start."
                        image={card1Image}
                    />
                    <HowItWorksCard
                        step="Step 02" title="Share instantly"
                        desc="Copy the link or scan the QR code. Anyone can vote — no signup, no friction, no barriers."
                        image={card2Image}
                    />
                    <HowItWorksCard
                        step="Step 03" title="Watch results live"
                        desc="Results update in real time via WebSockets. Every vote appears instantly — no refresh needed."
                        image={card3Image}
                    />
                </div>
            </div>

            {/* Features — carousel */}
            <div
                id="features"
                style={{
                    minHeight:      'calc(100vh - 72px)',
                    display:        'flex',
                    flexDirection:  'column',
                    alignItems:     'center',
                    justifyContent: 'center',
                    padding:        '80px 48px',
                }}
            >
                <h2 style={{
                    fontSize:      '44px',
                    fontWeight:    '500',
                    letterSpacing: '-0.04em',
                    color:         'var(--color-text-primary)',
                    textAlign:     'center',
                    marginBottom:  '12px',
                }}>
                    Everything you need
                </h2>
                <p style={{
                    fontSize:     '17px',
                    color:        'var(--color-text-muted)',
                    textAlign:    'center',
                    marginBottom: '48px',
                }}>
                    Built for teams, classrooms, events — anyone who needs a quick answer.
                </p>

                <div style={{ position: 'relative', width: '100%', maxWidth: '900px', overflow: 'hidden', borderRadius: '16px', border: '1px solid var(--color-border-default)' }}>

                    {/* Arrow left */}
                    <button
                        onClick={() => setFeature(f => (f - 1 + 5) % 5)}
                        style={{
                            position:       'absolute',
                            left:           '14px',
                            top:            '50%',
                            transform:      'translateY(-50%)',
                            zIndex:         10,
                            width:          '36px',
                            height:         '36px',
                            borderRadius:   '50%',
                            border:         '1px solid var(--color-border-default)',
                            background:     'var(--color-bg-page)',
                            color:          'var(--color-text-secondary)',
                            cursor:         'pointer',
                            display:        'flex',
                            alignItems:     'center',
                            justifyContent: 'center',
                            fontSize:       '15px',
                        }}
                    >←</button>

                    {/* Arrow right */}
                    <button
                        onClick={() => setFeature(f => (f + 1) % 5)}
                        style={{
                            position:       'absolute',
                            right:          '14px',
                            top:            '50%',
                            transform:      'translateY(-50%)',
                            zIndex:         10,
                            width:          '36px',
                            height:         '36px',
                            borderRadius:   '50%',
                            border:         '1px solid var(--color-border-default)',
                            background:     'var(--color-bg-page)',
                            color:          'var(--color-text-secondary)',
                            cursor:         'pointer',
                            display:        'flex',
                            alignItems:     'center',
                            justifyContent: 'center',
                            fontSize:       '15px',
                        }}
                    >→</button>

                    {/* Track */}
                    <div style={{
                        display:    'flex',
                        transform:  `translateX(-${activeFeature * 100}%)`,
                        transition: 'transform 0.5s cubic-bezier(0.4, 0, 0.2, 1)',
                    }}>
                        {FEATURES.map((f, i) => (
                            <div
                                key={i}
                                style={{
                                    minWidth:            '100%',
                                    display:             'grid',
                                    gridTemplateColumns: '1fr 1fr',
                                    minHeight:           '360px',
                                }}
                            >
                                {/* Text side */}
                                {i % 2 === 0 ? (
                                    <>
                                        <div style={{ padding: '56px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'var(--color-bg-page)' }}>
                                            <div style={{ fontSize: '40px', marginBottom: '18px' }}>{f.icon}</div>
                                            <p style={{ fontSize: '28px', fontWeight: '500', color: 'var(--color-text-primary)', letterSpacing: '-0.02em', marginBottom: '10px' }}>{f.title}</p>
                                            <p style={{ fontSize: '16px', color: 'var(--color-text-secondary)', lineHeight: '1.6', maxWidth: '320px' }}>{f.desc}</p>
                                        </div>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', background: 'var(--color-bg-subtle)' }}>
                                            {f.mockup}
                                        </div>
                                    </>
                                ) : (
                                    <>
                                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '40px', background: 'var(--color-bg-subtle)' }}>
                                            {f.mockup}
                                        </div>
                                        <div style={{ padding: '56px', display: 'flex', flexDirection: 'column', justifyContent: 'center', background: 'var(--color-bg-page)' }}>
                                            <div style={{ fontSize: '40px', marginBottom: '18px' }}>{f.icon}</div>
                                            <p style={{ fontSize: '28px', fontWeight: '500', color: 'var(--color-text-primary)', letterSpacing: '-0.02em', marginBottom: '10px' }}>{f.title}</p>
                                            <p style={{ fontSize: '16px', color: 'var(--color-text-secondary)', lineHeight: '1.6', maxWidth: '320px' }}>{f.desc}</p>
                                        </div>
                                    </>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Dots */}
                    <div style={{
                        position:        'absolute',
                        bottom:          '16px',
                        left:            0,
                        right:           0,
                        display:         'flex',
                        justifyContent:  'center',
                        gap:             '6px',
                        zIndex:          10,
                    }}>
                        {FEATURES.map((_, i) => (
                            <div
                                key={i}
                                onClick={() => setFeature(i)}
                                style={{
                                    height:       '8px',
                                    borderRadius: '4px',
                                    cursor:       'pointer',
                                    transition:   'all 0.3s ease',
                                    background:   i === activeFeature ? 'var(--color-accent)' : 'var(--color-border-strong)',
                                    width:        i === activeFeature ? '20px' : '8px',
                                }}
                            />
                        ))}
                    </div>
                </div>
            </div>

            {/* Bottom CTA */}
            <div style={{
                minHeight: 'calc(100vh - 72px)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center',
                textAlign: 'center', padding: '0 24px',
            }}>
                <h2 style={{
                    fontSize: '44px', fontWeight: '500',
                    color: 'var(--color-text-primary)', letterSpacing: '-0.04em', marginBottom: '12px',
                }}>
                    Ready to get started?
                </h2>
                <p style={{ fontSize: '17px', color: 'var(--color-text-muted)', marginBottom: '32px' }}>
                    Create your first poll in under 30 seconds.
                </p>
                <button
                    onClick={() => navigate('/create')}
                    style={{
                        background: 'var(--color-accent)', color: 'var(--color-text-on-teal)',
                        fontSize: '16px', fontWeight: '500', padding: '14px 28px',
                        borderRadius: '8px', border: 'none', cursor: 'pointer',
                        transition: 'background 150ms ease, transform 100ms ease',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-accent-hover)'; e.currentTarget.style.transform = 'translateY(-1px)' }}
                    onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-accent)'; e.currentTarget.style.transform = 'translateY(0)' }}
                >
                    Create a poll →
                </button>
            </div>

            {/* Scroll to top */}
            <button
                onClick={scrollToTop}
                style={{
                    position: 'fixed', bottom: '80px', right: '32px',
                    width: '44px', height: '44px', borderRadius: '50%',
                    background: 'var(--color-bg-page)', color: 'var(--color-accent)',
                    border: '1.5px solid var(--color-accent)', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    boxShadow: '0 4px 12px rgb(0 0 0 / 0.10)',
                    opacity: showScrollTop ? 1 : 0,
                    transform: showScrollTop ? 'translateY(0)' : 'translateY(12px)',
                    transition: 'opacity 300ms ease, transform 300ms ease, background 150ms ease, color 150ms ease',
                    pointerEvents: showScrollTop ? 'auto' : 'none', zIndex: 40,
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'var(--color-accent)'; e.currentTarget.style.color = '#fff' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'var(--color-bg-page)'; e.currentTarget.style.color = 'var(--color-accent)' }}
            >
                <ArrowUp size={18} strokeWidth={2} />
            </button>

        </div>
    )
}

export default LandingScreen