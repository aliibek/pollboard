import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import { type Poll } from '../types'

function usePolls(voterId: string) {
    const [polls, setPolls]     = useState<Poll[]>([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!voterId) return

        const fetchPolls = async () => {
            const { data } = await supabase
                .from('polls')
                .select('*')
                .eq('creator_id', voterId)
                .order('created_at', { ascending: false })

            if (data) setPolls(data)
            setLoading(false)
        }

        fetchPolls()
    }, [voterId])

    return { polls, loading }
}

export default usePolls