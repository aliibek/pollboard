import { Routes, Route } from 'react-router-dom'
import AppShell from './components/AppShell'
import DashboardScreen from './screens/DashboardScreen'
import CreatePollScreen from './screens/CreatePollScreen'
import VoteScreen from './screens/VoteScreen'
import ResultsScreen from './screens/ResultsScreen'

function App() {
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