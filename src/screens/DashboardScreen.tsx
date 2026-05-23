import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import usePolls from '../hooks/usePolls'
import useVoterID from '../hooks/useVoterID'
import useToastStore from '../store/toastStore'
import { type Poll } from '../types'

type PollWithCount = Poll & { voteCount: number }

function getStatus(poll: Poll): 'open' | 'closed' | 'expired' {
    if (poll.status === 'closed') return 'closed'
    if (poll.expires_at && new Date(poll.expires_at) < new Date()) return 'expired'
    return 'open'
}

function StatusBadge({ status }: { status: 'open' | 'closed' | 'expired' }) {
    const styles = {
        open: {
            background: 'var(--color-accent-light)',
            color:      'var(--color-accent-hover)',
        },
        closed: {
            background: 'var(--color-bg-stone)',
            color:      'var(--color-text-muted)',
        },
        expired: {
            background: 'var(--color-warning-bg)',
            color:      'var(--color-warning)',
        },
    }

    return (
        <span
            className="text-xs font-medium px-2 py-0.5 rounded-full"
            style={styles[status]}
        >
      {status}
    </span>
    )
}

function PollCard({ poll }: { poll: PollWithCount }) {
    const navigate            = useNavigate()
    const { addToast }        = useToastStore()
    const [copied, setCopied] = useState(false)
    const status              = getStatus(poll)

    const handleCopy = (e: React.MouseEvent) => {
        e.stopPropagation()
        navigator.clipboard.writeText(`${window.location.origin}/vote/${poll.id}`)
        setCopied(true)
        addToast('Vote link copied!', 'success')
        setTimeout(() => setCopied(false), 2000)
    }

    return (
        <div
            className="rounded-md px-5 py-4 cursor-pointer transition-all duration-150"
            style={{
                background: 'var(--color-bg-card)',
                border:     '1px solid var(--color-border-default)',
                boxShadow:  '0 1px 3px 0 rgb(0 0 0 / 0.06)',
            }}
            onClick={() => navigate(`/results/${poll.id}`)}
            onMouseEnter={e => {
                e.currentTarget.style.borderColor = 'var(--color-border-strong)'
                e.currentTarget.style.boxShadow   = '0 2px 6px 0 rgb(0 0 0 / 0.08)'
            }}
            onMouseLeave={e => {
                e.currentTarget.style.borderColor = 'var(--color-border-default)'
                e.currentTarget.style.boxShadow   = '0 1px 3px 0 rgb(0 0 0 / 0.06)'
            }}
        >
            <div className="flex items-start justify-between gap-4">

                <div className="flex-1 min-w-0">
                    <p
                        className="text-sm font-medium mb-2 truncate"
                        style={{ color: 'var(--color-text-primary)' }}
                    >
                        {poll.question}
                    </p>
                    <div className="flex items-center gap-2 flex-wrap">
                        <StatusBadge status={status} />
                        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {poll.options.length} options
            </span>
                        <span style={{ color: 'var(--color-border-strong)', fontSize: '10px' }}>·</span>
                        <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
              {poll.voteCount} {poll.voteCount === 1 ? 'vote' : 'votes'}
            </span>
                        {poll.expires_at && status === 'open' && (
                            <>
                                <span style={{ color: 'var(--color-border-strong)', fontSize: '10px' }}>·</span>
                                <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
                  closes {new Date(poll.expires_at).toLocaleDateString()}
                </span>
                            </>
                        )}
                    </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                    <button
                        onClick={handleCopy}
                        className="text-xs font-medium px-3 py-1.5 rounded-md transition-all duration-150"
                        style={{
                            background: copied ? 'var(--color-accent-light)' : 'var(--color-bg-stone)',
                            color:      copied ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                        }}
                    >
                        {copied ? '✓ Copied!' : 'Copy link'}
                    </button>
                    <span style={{ color: 'var(--color-text-muted)', fontSize: '18px' }}>→</span>
                </div>

            </div>
        </div>
    )
}

function DashboardScreen() {
    const navigate           = useNavigate()
    const voterId            = useVoterID()
    const { polls, loading } = usePolls(voterId)

    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <div
                    className="w-6 h-6 rounded-full border-2 animate-spin"
                    style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }}
                />
            </div>
        )
    }

    return (
        <div>

            <div
                className="flex items-center justify-between mb-8 pb-6"
                style={{ borderBottom: '1px solid var(--color-border-default)' }}
            >
                <div>
                    <h1
                        className="text-2xl font-medium"
                        style={{ color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}
                    >
                        Your polls
                    </h1>
                    <p className="text-sm mt-1" style={{ color: 'var(--color-text-muted)' }}>
                        {polls.length} {polls.length === 1 ? 'poll' : 'polls'} created
                    </p>
                </div>

                <button
                    onClick={() => navigate('/create')}
                    className="text-sm font-medium px-4 py-2 rounded-md transition-all duration-150"
                    style={{
                        background: 'var(--color-accent)',
                        color:      'var(--color-text-on-teal)',
                    }}
                    onMouseEnter={e => e.currentTarget.style.background = 'var(--color-accent-hover)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'var(--color-accent)'}
                >
                    + New poll
                </button>
            </div>

            {polls.length === 0 ? (
                <div
                    className="text-center py-20 rounded-md"
                    style={{
                        border:     '1px dashed var(--color-border-strong)',
                        background: 'var(--color-bg-subtle)',
                    }}
                >
                    <p
                        className="text-base font-medium mb-2"
                        style={{ color: 'var(--color-text-primary)' }}
                    >
                        No polls yet
                    </p>
                    <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
                        Create your first poll and share it with anyone
                    </p>
                    <button
                        onClick={() => navigate('/create')}
                        className="text-sm font-medium px-4 py-2 rounded-md transition-all duration-150"
                        style={{
                            background: 'var(--color-accent)',
                            color:      'var(--color-text-on-teal)',
                        }}
                    >
                        Create a poll →
                    </button>
                </div>
            ) : (
                <div className="flex flex-col gap-3">
                    {polls.map(poll => (
                        <PollCard key={poll.id} poll={poll} />
                    ))}
                </div>
            )}

        </div>
    )
}

export default DashboardScreen