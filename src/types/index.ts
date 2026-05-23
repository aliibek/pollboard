export type Poll = {
    id: string
    question: string
    options: string[]
    status: 'open' | 'closed'
    creator_id: string
    expires_at: string | null
    created_at: string
}

export type Vote = {
    id: string
    poll_id: string
    option_index: number
    voter_id: string
    created_at: string
}

export type ToastType = {
    id: string
    message: string
    type: 'success' | 'error'
}