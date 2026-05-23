import { Routes, Route, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import AppShell from './components/AppShell'
import DashboardScreen from './screens/DashboardScreen'
import CreatePollScreen from './screens/CreatePollScreen'
import VoteScreen from './screens/VoteScreen'
import ResultsScreen from './screens/ResultsScreen'
import { supabase } from './lib/supabase'

function App() {
    const navigate = useNavigate()

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event) => {
            if (event === 'SIGNED_IN') {
                const redirect = localStorage.getItem('pollboard_auth_redirect')
                if (redirect) {
                    localStorage.removeItem('pollboard_auth_redirect')
                    navigate(redirect)
                }
            }
        })

        return () => subscription.unsubscribe()
    }, [])

    return (
        <AppShell>
            <Routes>
                <Route path="/" element={<DashboardScreen />} />
                <Route path="/create" element={<CreatePollScreen />} />
                <Route path="/vote/:pollId" element={<VoteScreen />} />
                <Route path="/results/:pollId" element={<ResultsScreen />} />
            </Routes>
        </AppShell>
    )
}

export default App