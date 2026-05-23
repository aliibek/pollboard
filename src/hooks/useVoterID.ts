import { useEffect, useState } from 'react'

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
        const stored = localStorage.getItem('pollboard_voter_id')
        if (stored) {
            setVoterId(stored)
        } else {
            const newId = generateUUID()
            localStorage.setItem('pollboard_voter_id', newId)
            setVoterId(newId)
        }
    }, [])

    return voterId
}

export default useVoterID