import { Routes, Route, useNavigate } from 'react-router-dom'
import { useEffect } from 'react'
import AppShell from './components/AppShell'
import LandingScreen from './screens/LandingScreen'
import DashboardScreen from './screens/DashboardScreen'
import CreatePollScreen from './screens/CreatePollScreen'
import VoteScreen from './screens/VoteScreen'
import ResultsScreen from './screens/ResultsScreen'
import { supabase } from './lib/supabase'
import useAuth from './hooks/useAuth'

function App() {
    const navigate          = useNavigate()
    const { user, loading } = useAuth()

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

    // Redirect signed in users from landing to dashboard
    useEffect(() => {
        if (!loading && user && window.location.pathname === '/') {
            navigate('/dashboard')
        }
    }, [user, loading])

    return (
        <AppShell>
            <Routes>
                <Route path="/"                element={<LandingScreen />}    />
                <Route path="/dashboard"       element={<DashboardScreen />}  />
                <Route path="/create"          element={<CreatePollScreen />} />
                <Route path="/vote/:pollId"    element={<VoteScreen />}       />
                <Route path="/results/:pollId" element={<ResultsScreen />}    />
            </Routes>
        </AppShell>
    )
}

export default App