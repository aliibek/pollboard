import Modal from './Modal'

type Props = {
    open:    boolean
    onClose: () => void
    pollId:  string
    question: string
}

function QRModal({ open, onClose, pollId, question }: Props) {
    const voteUrl = `${window.location.origin}/vote/${pollId}`

    return (
        <Modal open={open} onClose={onClose}>
            <h2
                className="text-base font-medium mb-1"
                style={{ color: 'var(--color-text-primary)', letterSpacing: '-0.02em' }}
            >
                Scan to vote
            </h2>
            <p
                className="text-xs mb-6 truncate"
                style={{ color: 'var(--color-text-muted)' }}
            >
                {question}
            </p>

            <div
                className="flex items-center justify-center rounded-md p-4 mb-6"
                style={{ background: 'var(--color-bg-subtle)', border: '1px solid var(--color-border-default)' }}
            >
                <QRCodeSVG
                    value={voteUrl}
                    size={200}
                    bgColor="transparent"
                    fgColor="var(--color-text-primary)"
                    level="M"
                />
            </div>

            <p
                className="text-xs text-center mb-6 break-all"
                style={{ color: 'var(--color-text-muted)' }}
            >
                {voteUrl}
            </p>

            <button
                onClick={onClose}
                className="w-full h-10 text-sm font-medium rounded-md transition-all duration-150"
                style={{
                    background: 'var(--color-bg-stone)',
                    color:      'var(--color-text-secondary)',
                }}
            >
                Close
            </button>
        </Modal>
    )
}

// import at top
import { QRCodeSVG } from 'qrcode.react'

export default QRModal