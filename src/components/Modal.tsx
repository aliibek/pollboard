import { type ReactNode } from 'react'

type Props = {
    open:     boolean
    onClose:  () => void
    children: ReactNode
}

function Modal({ open, onClose, children }: Props) {
    if (!open) return null

    return (
        <div
            className="fixed inset-0 flex items-center justify-center"
            style={{ zIndex: 100, background: 'rgb(0 0 0 / 0.4)' }}
            onClick={onClose}
        >
            <div
                className="w-full rounded-lg px-6 py-6"
                style={{
                    maxWidth:   '400px',
                    margin:     '0 16px',
                    background: 'var(--color-bg-card)',
                    border:     '1px solid var(--color-border-default)',
                    boxShadow:  '0 8px 24px rgb(0 0 0 / 0.12)',
                }}
                onClick={e => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    )
}

export default Modal