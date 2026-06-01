import { useEffect } from 'react'
import { supabase } from '../lib/supabase'
import { type Vote } from '../types'

function useRealtime(
    pollId: string,
    onNewVote: (vote: Vote) => void,
    onDeleteVote?: (voteId: string) => void
) {
    useEffect(() => {
        if (!pollId) return

        const channel = supabase
            .channel(`votes:${pollId}`)
            .on(
                'postgres_changes',
                {
                    event:  'INSERT',
                    schema: 'public',
                    table:  'votes',
                    filter: `poll_id=eq.${pollId}`,
                },
                (payload) => {
                    onNewVote(payload.new as Vote)
                }
            )
            .on(
                'postgres_changes',
                {
                    event:  'DELETE',
                    schema: 'public',
                    table:  'votes',
                    filter: `poll_id=eq.${pollId}`,
                },
                (payload) => {
                    if (onDeleteVote) onDeleteVote(payload.old.id)
                }
            )
            .subscribe()

        return () => {
            supabase.removeChannel(channel)
        }
    }, [pollId])
}

export default useRealtime