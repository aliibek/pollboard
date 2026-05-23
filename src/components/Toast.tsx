import useToastStore from '../store/toastStore'

function Toast() {
    const { toasts, removeToast } = useToastStore()

    if (toasts.length === 0) return null

    return (
        <div
            className="fixed bottom-6 right-6 flex flex-col gap-2"
            style={{ zIndex: 50 }}
        >
            {toasts.map(toast => (
                <div
                    key={toast.id}
                    className="flex items-center justify-between gap-4 px-4 py-3 rounded-md text-sm font-medium"
                    style={{
                        background:  toast.type === 'success' ? 'var(--color-accent)' : 'var(--color-danger)',
                        color:       '#fff',
                        minWidth:    '220px',
                        boxShadow:   '0 4px 12px rgb(0 0 0 / 0.15)',
                        animation:   'slide-up 200ms cubic-bezier(0, 0, 0.2, 1) forwards',
                    }}
                >
                    <span>{toast.message}</span>
                    <button
                        onClick={() => removeToast(toast.id)}
                        style={{ opacity: 0.7, fontSize: '16px', lineHeight: 1 }}
                    >
                        ×
                    </button>
                </div>
            ))}
        </div>
    )
}

export default Toast