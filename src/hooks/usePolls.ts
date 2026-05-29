import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { type Poll } from '../types'

type PollWithCount = Poll & { voteCount: number; recentVotes: number }

function usePolls(voterId: string) {
    const [polls, setPolls]     = useState<PollWithCount[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!voterId) return

        const fetchPolls = async () => {
            const oneHourAgo = new Date(Date.now() - 3600000).toISOString()

            const { data: pollData } = await supabase
                .from('polls')
                .select('*, votes(count)')
                .eq('creator_id', voterId)
                .order('created_at', { ascending: false })

            if (!pollData) { setLoading(false); return }

            const pollIds = pollData.map(p => p.id)

            const { data: recentData } = await supabase
                .from('votes')
                .select('poll_id')
                .in('poll_id', pollIds)
                .gte('created_at', oneHourAgo)

            const recentCounts: Record<string, number> = {}
            recentData?.forEach(v => {
                recentCounts[v.poll_id] = (recentCounts[v.poll_id] ?? 0) + 1
            })

            const mapped = pollData.map(poll => ({
                ...poll,
                voteCount:   poll.votes?.[0]?.count ?? 0,
                recentVotes: recentCounts[poll.id] ?? 0,
            }))

            setPolls(mapped)
            setLoading(false)
        }

        fetchPolls()
    }, [voterId])

    const removePoll = (id: string) => {
        setPolls(prev => prev.filter(p => p.id !== id))
    }

    return { polls, loading, removePoll }
}

export default usePolls