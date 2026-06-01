export type Poll = {
    id:            string
    question:      string
    options:       string[]
    status:        'open' | 'closed'
    creator_id:    string
    expires_at:    string | null
    created_at:    string
    requires_auth: boolean
    allow_revote:  boolean
    show_voters:   boolean
}

export type Vote = {
    id:           string
    poll_id:      string
    option_index: number
    voter_id:     string
    voter_name:   string | null
    created_at:   string
}

export type ToastType = {
    id:      string
    message: string
    type:    'success' | 'error'
}