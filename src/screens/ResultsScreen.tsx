import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import usePoll from '../hooks/usePoll'
import useVotes from '../hooks/useVotes'
import useRealtime from '../hooks/useRealtime'
import useVoterID from '../hooks/useVoterID'
import { type Vote } from '../types'
import QRModal from '../components/QRModal'
import { QrCode } from 'lucide-react'

function ResultsScreen() {
    const { pollId } = useParams<{ pollId: string }>()
    const navigate   = useNavigate()
    const voterId    = useVoterID()

    const { poll, loading: pollLoading } = usePoll(pollId ?? '')
    const { votes, loading: votesLoading, addVote } = useVotes(pollId ?? '')

    const [closing, setClosing] = useState(false)
    const [copied,  setCopied]  = useState(false)

    const [showQR, setShowQR] = useState(false)

    useRealtime(pollId ?? '', (vote: Vote) => addVote(vote))

    const isCreator = poll?.creator_id === voterId
    const isPollOpen =
        poll?.status === 'open' &&
        (poll?.expires_at ? new Date(poll.expires_at) > new Date() : true)

    const totalVotes = votes.length

    const getCount = (index: number) =>
        votes.filter(v => v.option_index === index).length

    const getPercent = (index: number) => {
        if (totalVotes === 0) return 0
        return Math.round((getCount(index) / totalVotes) * 100)
    }

    const handleClose = async () => {
        if (!pollId || !voterId) return
        setClosing(true)

        const { error } = await supabase
            .from('polls')
            .update({ status: 'closed' })
            .eq('id', pollId)
            .eq('creator_id', voterId)

        setClosing(false)

        if (error) {
            console.error(error)
            return
        }
        window.location.reload()
    }

    const handleCopyVoteLink = () => {
        navigator.clipboard.writeText(`${window.location.origin}/vote/${pollId}`)
        setCopied(true)
        setTimeout(() => setCopied(false), 2000)
    }

    // --- Loading ---
    if (pollLoading || votesLoading) {
        return (
            <div className="flex items-center justify-center py-24">
                <div
                    className="w-6 h-6 rounded-full border-2 animate-spin"
                    style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }}
                />
            </div>
        )
    }

    if (!poll) {
        return (
            <div className="text-center py-24">
                <p className="text-lg font-medium" style={{ color: 'var(--color-text-primary)' }}>
                    Poll not found
                </p>
            </div>
        )
    }

    return (
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>

            <button
                onClick={() => navigate('/')}
                className="text-sm mb-6 flex items-center gap-1"
                style={{ color: 'var(--color-text-secondary)' }}
            >
                ← Back
            </button>

            {/* Header */}
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    {isPollOpen ? (
                        <>
              <span
                  className="w-2 h-2 rounded-full inline-block"
                  style={{
                      background: 'var(--color-accent)',
                      animation:  'pulse-dot 2s ease-in-out infinite',
                  }}
              />
                            <span className="text-xs font-medium" style={{ color: 'var(--color-accent)' }}>
                Live
              </span>
                        </>
                    ) : (
                        <span
                            className="text-xs font-medium px-2 py-0.5 rounded-full"
                            style={{
                                background: 'var(--color-bg-stone)',
                                color:      'var(--color-text-muted)',
                            }}
                        >
              Closed
            </span>
                    )}
                </div>

                <button
                    onClick={handleCopyVoteLink}
                    className="text-xs font-medium px-3 py-1.5 rounded-md transition-all duration-150"
                    style={{
                        background: copied ? 'var(--color-accent-light)' : 'var(--color-bg-stone)',
                        color:      copied ? 'var(--color-accent)' : 'var(--color-text-secondary)',
                    }}
                >
                    {copied ? '✓ Copied!' : 'Copy vote link'}
                </button>

                <button
                    onClick={() => setShowQR(true)}
                    className="flex items-center justify-center rounded-md transition-all duration-150"
                    style={{
                        background: 'var(--color-bg-stone)',
                        color:      'var(--color-text-secondary)',
                        height:     '28px',
                        width:      '28px',
                        flexShrink: 0,
                    }}
                    title="Show QR code"
                >
                    <QrCode size={14} />
                </button>
            </div>

            {/* Question */}
            <h1
                className="text-2xl font-medium mb-1"
                style={{ color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}
            >
                {poll.question}
            </h1>
            <p className="text-sm mb-8" style={{ color: 'var(--color-text-muted)' }}>
                {totalVotes} {totalVotes === 1 ? 'vote' : 'votes'}
            </p>

            {/* Bars */}
            <div className="flex flex-col gap-5 mb-10">
                {poll.options.map((option, i) => {
                    const pct   = getPercent(i)
                    const count = getCount(i)
                    const isWinner = count === Math.max(...poll.options.map((_, j) => getCount(j))) && count > 0

                    return (
                        <div key={i}>
                            <div className="flex justify-between items-center mb-1.5">
                <span
                    className="text-sm"
                    style={{
                        color:      isWinner ? 'var(--color-text-primary)' : 'var(--color-text-secondary)',
                        fontWeight: isWinner ? '500' : '400',
                    }}
                >
                  {option}
                </span>
                                <span className="text-sm" style={{ color: 'var(--color-text-muted)' }}>
                  {count} · {pct}%
                </span>
                            </div>
                            <div
                                className="w-full rounded-full overflow-hidden"
                                style={{ height: '6px', background: 'var(--color-bg-stone)' }}
                            >
                                <div
                                    className="h-full rounded-full transition-all duration-700"
                                    style={{
                                        width:      `${pct}%`,
                                        background: isWinner ? 'var(--color-accent)' : 'var(--color-border-strong)',
                                    }}
                                />
                            </div>
                        </div>
                    )
                })}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-3">
                <button
                    onClick={() => navigate(`/vote/${pollId}`)}
                    className="w-full h-10 text-sm font-medium rounded-md transition-all duration-150"
                    style={{
                        background: 'var(--color-bg-stone)',
                        color:      'var(--color-text-secondary)',
                    }}
                >
                    Vote screen
                </button>

                {isCreator && isPollOpen && (
                    <button
                        onClick={handleClose}
                        disabled={closing}
                        className="w-full h-10 text-sm font-medium rounded-md transition-all duration-150"
                        style={{
                            background: 'var(--color-danger-bg)',
                            color:      'var(--color-danger)',
                        }}
                    >
                        {closing ? 'Closing...' : 'Close poll'}
                    </button>
                )}
            </div>

            <QRModal
                open={showQR}
                onClose={() => setShowQR(false)}
                pollId={pollId ?? ''}
                question={poll.question}
            />

        </div>
    )
}

export default ResultsScreen