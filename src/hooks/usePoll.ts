import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { type Poll } from '../types'

type UsePollResult = {
    poll:    Poll | null
    loading: boolean
    error:   string | null
}

function usePoll(pollId: string): UsePollResult {
    const [poll, setPoll]       = useState<Poll | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError]     = useState<string | null>(null)

    useEffect(() => {
        if (!pollId) return

        const fetchPoll = async () => {
            setLoading(true)
            setError(null)

            const { data, error: sbError } = await supabase
                .from('polls')
                .select('*')
                .eq('id', pollId)
                .single()

            if (sbError || !data) {
                setError('Poll not found.')
                setLoading(false)
                return
            }

            setPoll(data)
            setLoading(false)
        }

        fetchPoll()
    }, [pollId])

    return { poll, loading, error }
}

export default usePoll