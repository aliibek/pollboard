import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import usePoll from '../hooks/usePoll'
import useVoterID from '../hooks/useVoterID'
import useAuth from '../hooks/useAuth'

function VoteScreen() {
    const { pollId }  = useParams<{ pollId: string }>()
    const navigate    = useNavigate()
    const voterId     = useVoterID()
    const { user, signInWithGoogle } = useAuth()
    const { poll, loading, error } = usePoll(pollId ?? '')

    const [selected,        setSelected]        = useState<number | null>(null)
    const [submitting,      setSubmitting]       = useState(false)
    const [voteError,       setVoteError]        = useState<string | null>(null)
    const [alreadyVoted,    setAlreadyVoted]     = useState(false)
    const [existingVoteId,  setExistingVoteId]   = useState<string | null>(null)
    const [isChangingVote,  setIsChangingVote]   = useState(false)
    const [voterName,       setVoterName]        = useState('')

    const isPollClosed =
        poll?.status === 'closed' ||
        (poll?.expires_at ? new Date(poll.expires_at) < new Date() : false)

    useEffect(() => {
        if (!pollId || !voterId) return
        if (isChangingVote) return  // ← add this line

        const checkVoted = async () => {
            const { data } = await supabase
                .from('votes')
                .select('id, option_index')
                .eq('poll_id', pollId)
                .eq('voter_id', voterId)
                .single()

            if (data) {
                setAlreadyVoted(true)
                setExistingVoteId(data.id)
                setSelected(data.option_index)
            }
        }

        checkVoted()
    }, [pollId, voterId, isChangingVote])

    const handleVote = async () => {
        if (selected === null || !voterId || !pollId) return
        setSubmitting(true)
        setVoteError(null)

        console.log('isChangingVote:', isChangingVote)
        console.log('existingVoteId:', existingVoteId)

        if (isChangingVote && existingVoteId) {
            console.log('Attempting delete...')
            const { error: deleteError, data: deleteData } = await supabase
                .from('votes')
                .delete()
                .eq('id', existingVoteId)
                .select()

            console.log('Delete data:', deleteData)
            console.log('Delete error:', deleteError)

            if (deleteError) {
                setVoteError('Something went wrong. Please try again.')
                setSubmitting(false)
                return
            }
        }

        console.log('Inserting vote, option:', selected)
        const { error: sbError, data: insertData } = await supabase
            .from('votes')
            .insert({
                poll_id:      pollId,
                option_index: selected,
                voter_id:     voterId,
                voter_name:   poll?.show_voters
                    ? (user?.user_metadata?.full_name ?? voterName ?? null)
                    : null,
            })
            .select()

        console.log('Insert data:', insertData)
        console.log('Insert error:', sbError)

        setSubmitting(false)

        if (sbError) {
            if (sbError.code === '23505') {
                setAlreadyVoted(true)
                setIsChangingVote(false)
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
                    className="w-6 h-6 rounded-full border-2 animate-spin"
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

    // --- Poll closed ---
    if (isPollClosed) {
        return (
            <div style={{ maxWidth: '480px', margin: '0 auto' }}>
                <button
                    onClick={() => navigate('/')}
                    className="text-sm mb-6 flex items-center gap-1"
                    style={{ color: 'var(--color-text-secondary)' }}
                >
                    ← Back
                </button>
                <p
                    className="text-2xl font-medium mb-2"
                    style={{ color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}
                >
                    {poll.question}
                </p>
                <div
                    className="rounded-md px-4 py-3 mt-6 text-sm"
                    style={{ background: 'var(--color-bg-stone)', color: 'var(--color-text-muted)' }}
                >
                    This poll is closed.
                </div>
                <button
                    onClick={() => navigate(`/results/${pollId}`)}
                    className="w-full h-11 text-sm font-medium rounded-md mt-4"
                    style={{ background: 'var(--color-accent)', color: 'var(--color-text-on-teal)' }}
                >
                    See results →
                </button>
            </div>
        )
    }

    // --- Requires auth but not signed in ---
    if (poll.requires_auth && !user) {
        return (
            <div style={{ maxWidth: '480px', margin: '0 auto' }}>
                <button
                    onClick={() => navigate('/')}
                    className="text-sm mb-6 flex items-center gap-1"
                    style={{ color: 'var(--color-text-secondary)' }}
                >
                    ← Back
                </button>
                <p
                    className="text-2xl font-medium mb-3"
                    style={{ color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}
                >
                    {poll.question}
                </p>
                <div
                    className="rounded-md px-5 py-8 text-center mt-8"
                    style={{ background: 'var(--color-bg-subtle)', border: '1px solid var(--color-border-default)' }}
                >
                    <p className="text-sm font-medium mb-2" style={{ color: 'var(--color-text-primary)' }}>
                        Sign in required to vote
                    </p>
                    <p className="text-xs mb-6" style={{ color: 'var(--color-text-muted)' }}>
                        The creator of this poll requires voters to sign in with Google.
                    </p>
                    <button
                        onClick={() => signInWithGoogle(`/vote/${pollId}`)}
                        className="flex items-center gap-2 mx-auto px-4 py-2 rounded-md text-sm font-medium"
                        style={{ background: 'var(--color-accent)', color: 'var(--color-text-on-teal)' }}
                    >
                        <img src="https://www.google.com/favicon.ico" alt="Google" style={{ width: '14px', height: '14px' }} />
                        Sign in with Google
                    </button>
                </div>
            </div>
        )
    }

    // --- Already voted ---
    if (alreadyVoted && !isChangingVote) {
        return (
            <div style={{ maxWidth: '480px', margin: '0 auto' }}>
                <button
                    onClick={() => navigate('/')}
                    className="text-sm mb-6 flex items-center gap-1"
                    style={{ color: 'var(--color-text-secondary)' }}
                >
                    ← Back
                </button>
                <p
                    className="text-2xl font-medium mb-6"
                    style={{ color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}
                >
                    {poll.question}
                </p>
                <div
                    className="rounded-md px-4 py-3 mb-4 text-sm"
                    style={{
                        background: 'var(--color-bg-teal-subtle)',
                        border:     '1px solid var(--color-accent-light)',
                        color:      'var(--color-text-teal)',
                    }}
                >
                    You've already voted on this poll.
                </div>
                <div className="flex flex-col gap-3">
                    <button
                        onClick={() => navigate(`/results/${pollId}`)}
                        className="w-full h-11 text-sm font-medium rounded-md"
                        style={{ background: 'var(--color-accent)', color: 'var(--color-text-on-teal)' }}
                    >
                        See results →
                    </button>
                    {poll.allow_revote && (
                        <button
                            onClick={() => setIsChangingVote(true)}
                            className="w-full h-11 text-sm font-medium rounded-md transition-all duration-150"
                            style={{
                                background: 'var(--color-bg-stone)',
                                color:      'var(--color-text-secondary)',
                                border:     '1px solid var(--color-border-default)',
                            }}
                        >
                            Change my vote
                        </button>
                    )}
                </div>
            </div>
        )
    }

    // --- Vote screen ---
    return (
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>

            <button
                onClick={() => isChangingVote ? setIsChangingVote(false) : navigate('/')}
                className="text-sm mb-6 flex items-center gap-1"
                style={{ color: 'var(--color-text-secondary)' }}
            >
                ← {isChangingVote ? 'Cancel' : 'Back'}
            </button>

            <p
                className="text-2xl font-medium mb-8"
                style={{ color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}
            >
                {poll.question}
            </p>

            {/* Name input if show_voters and not signed in */}
            {poll.show_voters && !user && (
                <div className="mb-6">
                    <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--color-text-secondary)' }}>
                        Your name
                    </label>
                    <input
                        type="text"
                        value={voterName}
                        onChange={e => setVoterName(e.target.value)}
                        placeholder="Enter your name..."
                        className="w-full text-sm rounded-md px-3 h-10 focus:outline-none transition-all duration-150"
                        style={{
                            background: 'var(--color-bg-card)',
                            border:     '1px solid var(--color-border-default)',
                            color:      'var(--color-text-primary)',
                        }}
                        onFocus={e => e.currentTarget.style.borderColor = 'var(--color-border-teal)'}
                        onBlur={e  => e.currentTarget.style.borderColor = 'var(--color-border-default)'}
                    />
                </div>
            )}

            <div className="flex flex-col gap-3 mb-8">
                {poll.options.map((option, i) => (
                    <button
                        key={i}
                        onClick={() => setSelected(i)}
                        className="w-full text-left px-4 py-3 rounded-md text-sm transition-all duration-150"
                        style={{
                            background: selected === i ? 'var(--color-bg-teal-subtle)' : 'var(--color-bg-card)',
                            border:     `1px solid ${selected === i ? 'var(--color-accent)' : 'var(--color-border-default)'}`,
                            color:      selected === i ? 'var(--color-text-teal)' : 'var(--color-text-primary)',
                            fontWeight: selected === i ? '500' : '400',
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

            {isChangingVote && (
                <p className="text-xs mb-3 text-center" style={{ color: 'var(--color-text-muted)' }}>
                    Your previous vote will be replaced
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
                {submitting
                    ? 'Submitting...'
                    : isChangingVote
                        ? 'Update vote →'
                        : 'Submit vote →'
                }
            </button>

        </div>
    )
}

export default VoteScreen