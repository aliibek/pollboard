import { useState } from 'react'
import Modal from './Modal'

type Props = {
    open:     boolean
    onClose:  () => void
    onSelect: (expiresAt: string | null) => void
}

function ExpiryPickerModal({ open, onClose, onSelect }: Props) {
    const now    = new Date()
    const pad    = (n: number) => String(n).padStart(2, '0')

    // Default to 1 hour from now
    const defaultDate = new Date(Date.now() + 3600000)
    const defaultStr  = `${defaultDate.getFullYear()}-${pad(defaultDate.getMonth() + 1)}-${pad(defaultDate.getDate())}T${pad(defaultDate.getHours())}:${pad(defaultDate.getMinutes())}`
    const minStr      = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}T${pad(now.getHours())}:${pad(now.getMinutes())}`

    const [customDate,   setCustomDate]   = useState(defaultStr)
    const [showCustom,   setShowCustom]   = useState(false)

    const PRESETS = [
        { label: '1 hour',   ms: 3600000   },
        { label: '24 hours', ms: 86400000  },
        { label: '7 days',   ms: 604800000 },
    ]

    const handlePreset = (ms: number) => {
        onSelect(new Date(Date.now() + ms).toISOString())
        onClose()
    }

    const handleCustom = () => {
        if (!customDate) return
        onSelect(new Date(customDate).toISOString())
        onClose()
    }

    const handleNoExpiry = () => {
        onSelect(null)
        onClose()
    }

    return (
        <Modal open={open} onClose={onClose}>
            <h2
                className="text-base font-medium mb-4"
                style={{ color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}
            >
                Set expiry
            </h2>

            {/* Preset buttons */}
            <div className="flex gap-2 flex-wrap mb-4">
                {PRESETS.map(p => (
                    <button
                        key={p.label}
                        onClick={() => handlePreset(p.ms)}
                        className="text-sm px-3 py-1.5 rounded-md transition-all duration-150"
                        style={{
                            background: 'var(--color-bg-stone)',
                            color:      'var(--color-text-secondary)',
                            border:     '1px solid transparent',
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = 'var(--color-border-default)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'var(--color-bg-stone)'}
                    >
                        {p.label}
                    </button>
                ))}
                <button
                    onClick={() => setShowCustom(!showCustom)}
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

            {/* Custom date picker */}
            {showCustom && (
                <div className="mb-4">
                    <input
                        type="datetime-local"
                        value={customDate}
                        min={minStr}
                        onChange={e => setCustomDate(e.target.value)}
                        className="w-full text-sm rounded-md px-3 h-10 focus:outline-none transition-all duration-150 mb-3"
                        style={{
                            background: 'var(--color-bg-card)',
                            border:     '1px solid var(--color-border-default)',
                            color:      'var(--color-text-primary)',
                        }}
                        onFocus={e => e.currentTarget.style.borderColor = 'var(--color-border-teal)'}
                        onBlur={e  => e.currentTarget.style.borderColor = 'var(--color-border-default)'}
                    />
                    <button
                        onClick={handleCustom}
                        disabled={!customDate}
                        className="w-full h-10 text-sm font-medium rounded-md transition-all duration-150"
                        style={{
                            background: customDate ? 'var(--color-accent)' : 'var(--color-bg-stone)',
                            color:      customDate ? 'var(--color-text-on-teal)' : 'var(--color-text-muted)',
                            cursor:     customDate ? 'pointer' : 'not-allowed',
                        }}
                    >
                        Set deadline
                    </button>
                </div>
            )}

            <button
                onClick={handleNoExpiry}
                className="w-full h-9 text-sm rounded-md transition-all duration-150"
                style={{
                    background: 'transparent',
                    color:      'var(--color-text-muted)',
                    border:     '1px solid var(--color-border-default)',
                }}
            >
                No expiry
            </button>
        </Modal>
    )
}

export default ExpiryPickerModal