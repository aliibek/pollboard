import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import useVoterID from '../hooks/useVoterID'
import useToastStore from '../store/toastStore'

type Expiry = 'none' | '1h' | '24h' | '7d'

const EXPIRY_OPTIONS: { label: string; value: Expiry }[] = [
    { label: 'No expiry', value: 'none' },
    { label: '1 hour',   value: '1h'   },
    { label: '24 hours', value: '24h'  },
    { label: '7 days',   value: '7d'   },
]

function getExpiresAt(expiry: Expiry): string | null {
    if (expiry === 'none') return null
    const ms = { '1h': 3600000, '24h': 86400000, '7d': 604800000 }
    return new Date(Date.now() + ms[expiry]).toISOString()
}

function CreatePollScreen() {
    const navigate     = useNavigate()
    const voterId      = useVoterID()
    const { addToast } = useToastStore()

    const [question,     setQuestion]     = useState('')
    const [options,      setOptions]      = useState(['', ''])
    const [expiry,       setExpiry]       = useState<Expiry>('none')
    const [submitting,   setSubmitting]   = useState(false)
    const [error,        setError]        = useState<string | null>(null)
    const [requiresAuth, setRequiresAuth] = useState(false)

    const addOption = () => {
        if (options.length < 6) setOptions([...options, ''])
    }

    const removeOption = (index: number) => {
        if (options.length <= 2) return
        setOptions(options.filter((_, i) => i !== index))
    }

    const updateOption = (index: number, value: string) => {
        const updated = [...options]
        updated[index] = value
        setOptions(updated)
    }

    const isValid =
        question.trim().length > 0 &&
        options.filter(o => o.trim().length > 0).length >= 2

    const handleSubmit = async () => {
        if (!isValid || !voterId) return
        setSubmitting(true)
        setError(null)

        const { data, error: sbError } = await supabase
            .from('polls')
            .insert({
                question:      question.trim(),
                options:       options.filter(o => o.trim().length > 0).map(o => o.trim()),
                status:        'open',
                creator_id:    voterId,
                expires_at:    getExpiresAt(expiry),
                requires_auth: requiresAuth,
            })
            .select()
            .single()

        setSubmitting(false)

        if (sbError || !data) {
            setError('Something went wrong. Please try again.')
            addToast('Something went wrong. Please try again.', 'error')
            return
        }

        addToast('Poll created!', 'success')
        navigate(`/results/${data.id}`)
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

            <h1
                className="text-2xl font-medium mb-8"
                style={{ color: 'var(--color-text-primary)', letterSpacing: '-0.03em' }}
            >
                Create a poll
            </h1>

            {/* Question */}
            <div className="mb-6">
                <div className="flex justify-between items-center mb-2">
                    <label className="text-sm font-medium" style={{ color: 'var(--color-text-secondary)' }}>
                        Question
                    </label>
                    <span className="text-xs" style={{ color: 'var(--color-text-muted)' }}>
            {question.length}/140
          </span>
                </div>
                <textarea
                    value={question}
                    onChange={e => setQuestion(e.target.value.slice(0, 140))}
                    placeholder="Ask something..."
                    rows={2}
                    className="w-full text-sm rounded-md px-3 py-2.5 resize-none transition-all duration-150 focus:outline-none"
                    style={{
                        background: 'var(--color-bg-card)',
                        border:     '1px solid var(--color-border-default)',
                        color:      'var(--color-text-primary)',
                    }}
                    onFocus={e => e.currentTarget.style.borderColor = 'var(--color-border-teal)'}
                    onBlur={e  => e.currentTarget.style.borderColor = 'var(--color-border-default)'}
                />
            </div>

            {/* Options */}
            <div className="mb-6">
                <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--color-text-secondary)' }}>
                    Options
                </label>
                <div className="flex flex-col gap-2">
                    {options.map((opt, i) => (
                        <div key={i} className="flex items-center gap-2">
                            <input
                                type="text"
                                value={opt}
                                onChange={e => updateOption(i, e.target.value)}
                                placeholder={`Option ${i + 1}`}
                                className="flex-1 text-sm rounded-md px-3 h-10 transition-all duration-150 focus:outline-none"
                                style={{
                                    background: 'var(--color-bg-card)',
                                    border:     '1px solid var(--color-border-default)',
                                    color:      'var(--color-text-primary)',
                                }}
                                onFocus={e => e.currentTarget.style.borderColor = 'var(--color-border-teal)'}
                                onBlur={e  => e.currentTarget.style.borderColor = 'var(--color-border-default)'}
                            />
                            <button
                                onClick={() => removeOption(i)}
                                disabled={options.length <= 2}
                                className="w-8 h-8 flex items-center justify-center rounded text-lg transition-all duration-150"
                                style={{
                                    color:  options.length <= 2 ? 'var(--color-border-strong)' : 'var(--color-text-muted)',
                                    cursor: options.length <= 2 ? 'not-allowed' : 'pointer',
                                }}
                            >
                                ×
                            </button>
                        </div>
                    ))}
                </div>

                {options.length < 6 && (
                    <button
                        onClick={addOption}
                        className="mt-3 text-sm font-medium transition-all duration-150"
                        style={{ color: 'var(--color-accent)' }}
                    >
                        + Add option
                    </button>
                )}
            </div>

            {/* Expiry */}
            <div className="mb-6">
                <label className="text-sm font-medium mb-2 block" style={{ color: 'var(--color-text-secondary)' }}>
                    Expires
                </label>
                <div className="flex gap-2 flex-wrap">
                    {EXPIRY_OPTIONS.map(opt => (
                        <button
                            key={opt.value}
                            onClick={() => setExpiry(opt.value)}
                            className="text-sm px-3 py-1.5 rounded-md transition-all duration-150"
                            style={{
                                background: expiry === opt.value ? 'var(--color-accent)' : 'var(--color-bg-stone)',
                                color:      expiry === opt.value ? 'var(--color-text-on-teal)' : 'var(--color-text-secondary)',
                                border:     '1px solid transparent',
                            }}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Require sign in */}
            <div
                className="mb-8 flex items-center gap-3 px-4 py-3 rounded-md"
                style={{
                    background: 'var(--color-bg-subtle)',
                    border:     '1px solid var(--color-border-default)',
                }}
            >
                <input
                    type="checkbox"
                    id="requires_auth"
                    checked={requiresAuth}
                    onChange={e => setRequiresAuth(e.target.checked)}
                    className="w-4 h-4 rounded cursor-pointer"
                    style={{ accentColor: 'var(--color-accent)' }}
                />
                <label
                    htmlFor="requires_auth"
                    className="text-sm cursor-pointer flex-1"
                    style={{ color: 'var(--color-text-secondary)' }}
                >
                    Require Google sign in to vote
                </label>
            </div>

            {/* Error */}
            {error && (
                <p className="text-sm mb-4" style={{ color: 'var(--color-danger)' }}>
                    {error}
                </p>
            )}

            {/* Submit */}
            <button
                onClick={handleSubmit}
                disabled={!isValid || submitting}
                className="w-full h-11 text-sm font-medium rounded-md transition-all duration-150"
                style={{
                    background: isValid && !submitting ? 'var(--color-accent)' : 'var(--color-bg-stone)',
                    color:      isValid && !submitting ? 'var(--color-text-on-teal)' : 'var(--color-text-muted)',
                    cursor:     isValid && !submitting ? 'pointer' : 'not-allowed',
                }}
            >
                {submitting ? 'Creating...' : 'Create poll →'}
            </button>

        </div>
    )
}

export default CreatePollScreen