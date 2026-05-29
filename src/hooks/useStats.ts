import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { type Poll } from '../types'

type Stats = {
    totalPolls:  number
    totalVotes:  number
    activePolls: number
}

function useStats(voterId: string) {
    const [stats, setStats]     = useState<Stats>({ totalPolls: 0, totalVotes: 0, activePolls: 0 })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!voterId) return

        const fetchStats = async () => {
            const { data: polls } = await supabase
                .from('polls')
                .select('*, votes(count)')
                .eq('creator_id', voterId)

            if (!polls) { setLoading(false); return }

            const totalPolls  = polls.length
            const totalVotes  = polls.reduce((sum, p) => sum + (p.votes?.[0]?.count ?? 0), 0)
            const activePolls = polls.filter((p: Poll) =>
                p.status === 'open' &&
                (p.expires_at ? new Date(p.expires_at) > new Date() : true)
            ).length

            setStats({ totalPolls, totalVotes, activePolls })
            setLoading(false)
        }

        fetchStats()
    }, [voterId])

    return { stats, loading }
}

export default useStats