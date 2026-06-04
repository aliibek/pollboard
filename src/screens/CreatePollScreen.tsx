import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import useVoterID from '../hooks/useVoterID'
import useToastStore from '../store/toastStore'

function CreatePollScreen() {
    const navigate     = useNavigate()
    const voterId      = useVoterID()
    const { addToast } = useToastStore()

    const [question,     setQuestion]     = useState('')
    const [options,      setOptions]      = useState(['', ''])
    const [expiresAt,    setExpiresAt]    = useState<string | null>(null)
    const [showCustom,   setShowCustom]   = useState(false)
    const [submitting,   setSubmitting]   = useState(false)
    const [error,        setError]        = useState<string | null>(null)
    const [requiresAuth, setRequiresAuth] = useState(false)
    const [allowRevote,  setAllowRevote]  = useState(false)
    const [showVoters,   setShowVoters]   = useState(false)

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

    const validOptions = options.filter(o => o.trim().length > 0)
    const isValid      = question.trim().length > 0 && validOptions.length >= 2

    const pad = (n: number) => String(n).padStart(2, '0')

    const getMinStr = () => {
        const now = new Date()
        return `${now.getFullYear()}-${pad(now.getMonth()+1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`
    }

    const getDefaultCustomStr = () => {
        const d = new Date(Date.now() + 3600000)
        return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
    }

    const PRESETS = [
        { label: 'No expiry', ms: null      },
        { label: '1 hour',    ms: 3600000   },
        { label: '24 hours',  ms: 86400000  },
        { label: '7 days',    ms: 604800000 },
    ]

    const handleSubmit = async () => {
        if (!isValid || !voterId) return

        if (expiresAt && new Date(expiresAt) <= new Date()) {
            setError('Expiry time must be in the future.')
            return
        }
        setSubmitting(true)
        setError(null)

        const { data, error: sbError } = await supabase
            .from('polls')
            .insert({
                question:      question.trim(),
                options:       validOptions.map(o => o.trim()),
                status:        'open',
                creator_id:    voterId,
                expires_at:    expiresAt,
                requires_auth: requiresAuth,
                allow_revote:  allowRevote,
                show_voters:   showVoters,
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

    const CheckboxRow = ({
                             id, checked, onChange, label,
                         }: {
        id: string; checked: boolean; onChange: (v: boolean) => void; label: string
    }) => (
        <div
            className="flex items-center gap-3 px-4 py-3 rounded-md"
            style={{
                background: 'var(--color-bg-subtle)',
                border:     '1px solid var(--color-border-default)',
            }}
        >
            <input
                type="checkbox"
                id={id}
                checked={checked}
                onChange={e => onChange(e.target.checked)}
                className="w-4 h-4 rounded cursor-pointer"
                style={{ accentColor: 'var(--color-accent)' }}
            />
            <label
                htmlFor={id}
                className="text-sm cursor-pointer flex-1"
                style={{ color: 'var(--color-text-secondary)' }}
            >
                {label}
            </label>
        </div>
    )

    return (
        <div style={{ maxWidth: '480px', margin: '0 auto' }}>

            <button
                onClick={() => navigate('/dashboard')}
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
                        className="mt-3 text-sm font-medium"
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
                    {PRESETS.map(opt => {
                        const isActive = opt.ms === null
                            ? expiresAt === null && !showCustom
                            : !showCustom && expiresAt !== null &&
                            Math.abs(new Date(expiresAt).getTime() - (Date.now() + opt.ms)) < 60000
                        return (
                            <button
                                key={opt.label}
                                onClick={() => {
                                    setExpiresAt(opt.ms ? new Date(Date.now() + opt.ms).toISOString() : null)
                                    setShowCustom(false)
                                }}
                                className="text-sm px-3 py-1.5 rounded-md transition-all duration-150"
                                style={{
                                    background: isActive ? 'var(--color-accent)' : 'var(--color-bg-stone)',
                                    color:      isActive ? 'var(--color-text-on-teal)' : 'var(--color-text-secondary)',
                                    border:     '1px solid transparent',
                                }}
                            >
                                {opt.label}
                            </button>
                        )
                    })}
                    <button
                        onClick={() => {
                            setShowCustom(!showCustom)
                            if (!showCustom) setExpiresAt(new Date(Date.now() + 3600000).toISOString())
                        }}
                        className="text-sm px-3 py-1.5 rounded-md transition-all duration-150"
                        style={{
                            background: showCustom ? 'var(--color-accent)' : 'var(--color-bg-stone)',
                            color:      showCustom ? 'var(--color-text-on-teal)' : 'var(--color-text-secondary)',
                            border:     '1px solid transparent',
                        }}
                    >
                        Custom
                    </button>
                </div>

                {showCustom && (
                    <div className="mt-3">
                        <input
                            type="datetime-local"
                            min={getMinStr()}
                            defaultValue={getDefaultCustomStr()}
                            onChange={e => {
                                if (e.target.value) setExpiresAt(new Date(e.target.value).toISOString())
                            }}
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
            </div>

            {/* Settings */}
            <div className="flex flex-col gap-2 mb-8">
                <CheckboxRow
                    id="requires_auth"
                    checked={requiresAuth}
                    onChange={setRequiresAuth}
                    label="Require Google sign in to vote"
                />
                <CheckboxRow
                    id="allow_revote"
                    checked={allowRevote}
                    onChange={setAllowRevote}
                    label="Allow voters to change their vote"
                />
                <CheckboxRow
                    id="show_voters"
                    checked={showVoters}
                    onChange={setShowVoters}
                    label="Show who voted (collect voter names)"
                />
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