import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'

function generateUUID(): string {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (Math.random() * 16) | 0
        const v = c === 'x' ? r : (r & 0x3) | 0x8
        return v.toString(16)
    })
}

function useVoterID(): string {
    const [voterId, setVoterId] = useState<string>('')

    useEffect(() => {
        const init = async () => {
            // Check if user is signed in
            const { data: { session } } = await supabase.auth.getSession()

            if (session?.user) {
                // Use Supabase user ID as voter ID
                setVoterId(session.user.id)
                return
            }

            // Fall back to localStorage UUID
            const stored = localStorage.getItem('pollboard_voter_id')
            if (stored) {
                setVoterId(stored)
            } else {
                const newId = generateUUID()
                localStorage.setItem('pollboard_voter_id', newId)
                setVoterId(newId)
            }
        }

        init()

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setVoterId(session.user.id)
            } else {
                const stored = localStorage.getItem('pollboard_voter_id')
                if (stored) setVoterId(stored)
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    return voterId
}

export default useVoterID