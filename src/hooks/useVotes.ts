import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { type Vote } from '../types'

function useVotes(pollId: string) {
    const [votes, setVotes]     = useState<Vote[]>([])
    const [loading, setLoading] = useState(true)

    const fetchVotes = async () => {
        const { data } = await supabase
            .from('votes')
            .select('*')
            .eq('poll_id', pollId)

        if (data) setVotes(data)
        setLoading(false)
    }

    useEffect(() => {
        if (!pollId) return
        fetchVotes()
    }, [pollId])

    const addVote = (vote: Vote) => {
        setVotes(prev => {
            const exists = prev.find(v => v.id === vote.id)
            if (exists) return prev
            return [...prev, vote]
        })
    }

    return { votes, loading, addVote }
}

export default useVotes