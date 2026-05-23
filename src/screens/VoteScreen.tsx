import { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import usePoll from '../hooks/usePoll'
import useVoterID from '../hooks/useVoterID'

function VoteScreen() {
    const { pollId }  = useParams<{ pollId: string }>()
    const navigate    = useNavigate()
    const voterId     = useVoterID()
    const { poll, loading, error } = usePoll(pollId ?? '')

    const [selected,   setSelected]   = useState<number | null>(null)
    const [submitting, setSubmitting] = useState(false)
    const [voteError,  setVoteError]  = useState<string | null>(null)
    const [alreadyVoted, setAlreadyVoted] = useState(false)

    const isPollClosed =
        poll?.status === 'closed' ||
        (poll?.expires_at ? new Date(poll.expires_at) < new Date() : false)

    const handleVote = async () => {
        if (selected === null || !voterId || !pollId) return
        setSubmitting(true)
        setVoteError(null)

        const { error: sbError } = await supabase
            .from('votes')
            .insert({
                poll_id:      pollId,
                option_index: selected,
                voter_id:     voterId,
            })

        setSubmitting(false)

        if (sbError) {
            if (sbError.code === '23505') {
                setAlreadyVoted(true)
            } else {
                setVoteError('Something went wrong. Please try again.')
            }
            return
        }

        navigate(`/results/${pollId}`)
    }

    // --- Loading ---
    if (loading) {
        return (
            <div className="flex items-center justify-center py-24">
                <div
                    className="w-6 h-6 rounded-full border-2 border-t-transparent animate-spin"
                    style={{ borderColor: 'var(--color-accent)', borderTopColor: 'transparent' }}
                />
            </div>
        )
    }

    // --- Error / not found ---
    if (error || !poll) {
        return (
            <div className="text-center py-24">
                <p className="text-lg font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                    Poll not found
                </p>
                <p className="text-sm mb-6" style={{ color: 'var(--color-text-muted)' }}>
                    This poll may have been deleted or the link is invalid.
                </p>
                <button
                    onClick={() => navigate('/')}
                    className="text-sm font-medium"
                    style={{ color: 'var(--color-accent)' }}
                >
                    ← Go home
                </button>
            </div>
        )
    }

    // --- Already voted ---
    if (alreadyVoted) {
        return (
            <div style={{ maxWidth: '480px', margin: '0 auto' }}>
                <div
                    className="rounded-md px-4 py-3 mb-6 text-sm"
                    style={{
                        background: 'var(--color-bg-teal-subtle)',
                        border:     '1px solid var(--color-accent-light)',
                        color:      'var(--color-text-teal)',
                    }}
                >
                    You've already voted on this poll.
                </div>
                <button
                    onClick={() => navigate(`/results/${pollId}`)}
                    className="w-full h-11 text-sm font-medium rounded-md"
                    style={{
                        background: 'var(--color-accent)',
                        color:      'var(--color-text-on-teal)',
                    }}
                >
                    See results →
                </button>
            </div>
        )
    }

    // --- Poll closed ---
    if (isPollClosed) {
        return (
            <div style={{ maxWidth: '480px', margin: '0 auto' }}>
                <p
                    className="text-2xl font-medium mb-2"
                    style={{ color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}
                >
                    {poll.question}
                </p>
                <div
                    className="rounded-md px-4 py-3 mt-6 text-sm"
                    style={{
                        background: 'var(--color-bg-stone)',
                        color:      'var(--color-text-muted)',
                    }}
                >
                    This poll is closed.
                </div>
                <button
                    onClick={() => navigate(`/results/${pollId}`)}
                    className="w-full h-11 text-sm font-medium rounded-md mt-4"
                    style={{
                        background: 'var(--color-accent)',
                        color:      'var(--color-text-on-teal)',
                    }}
                >
                    See results →
                </button>
            </div>
        )
    }

    // --- Vote screen ---
    return (
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>

            <p
                className="text-2xl font-medium mb-8"
                style={{ color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}
            >
                {poll.question}
            </p>

            <div className="flex flex-col gap-3 mb-8">
                {poll.options.map((option, i) => (
                    <button
                        key={i}
                        onClick={() => setSelected(i)}
                        className="w-full text-left px-4 py-3 rounded-md text-sm transition-all duration-150"
                        style={{
                            background:  selected === i ? 'var(--color-bg-teal-subtle)' : 'var(--color-bg-card)',
                            border:      `1px solid ${selected === i ? 'var(--color-accent)' : 'var(--color-border-default)'}`,
                            color:       selected === i ? 'var(--color-text-teal)' : 'var(--color-text-primary)',
                            fontWeight:  selected === i ? '500' : '400',
                        }}
                    >
            <span className="mr-3" style={{ color: 'var(--color-text-muted)' }}>
              {selected === i ? '●' : '○'}
            </span>
                        {option}
                    </button>
                ))}
            </div>

            {voteError && (
                <p className="text-sm mb-4" style={{ color: 'var(--color-danger)' }}>
                    {voteError}
                </p>
            )}

            <button
                onClick={handleVote}
                disabled={selected === null || submitting}
                className="w-full h-11 text-sm font-medium rounded-md transition-all duration-150"
                style={{
                    background: selected !== null && !submitting ? 'var(--color-accent)' : 'var(--color-bg-stone)',
                    color:      selected !== null && !submitting ? 'var(--color-text-on-teal)' : 'var(--color-text-muted)',
                    cursor:     selected !== null && !submitting ? 'pointer' : 'not-allowed',
                }}
            >
                {submitting ? 'Submitting...' : 'Submit vote →'}
            </button>

        </div>
    )
}

export default VoteScreen