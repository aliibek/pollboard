import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { type Poll } from '../types'

type PollWithCount = Poll & { voteCount: number }

function usePolls(voterId: string) {
    const [polls, setPolls]     = useState<PollWithCount[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!voterId) return

        const fetchPolls = async () => {
            const { data } = await supabase
                .from('polls')
                .select('*, votes(count)')
                .eq('creator_id', voterId)
                .order('created_at', { ascending: false })

            if (data) {
                const mapped = data.map(poll => ({
                    ...poll,
                    voteCount: poll.votes?.[0]?.count ?? 0,
                }))
                setPolls(mapped)
            }
            setLoading(false)
        }

        fetchPolls()
    }, [voterId])

    return { polls, loading }
}

export default usePolls