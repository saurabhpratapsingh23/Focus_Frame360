import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import EmployeeLogin from './pages/EmployeeLogin'
import EmsPerformance from './pages/emsPerformance'
import KPIReport from './pages/KPIReport'
import Layout from "./components/layout/Layout"
import WeeklyRoleSummary from './pages/WeeklyRoleSummary'
import WeeklySummaryEntry from './pages/WeeklySummaryEntry'
import MyGoalsDashboard from './pages/MyGoalsDashboard'
import EmployeeRoleManagement from './pages/EmployeeRoleManagement'
import WeeklyGoalsAction from './pages/WeeklyGoalsAction'
import Profile from './components/Profile'
import WeeklyReport from './components/WeeklyReport'
import './App.css'

function App() {
  return (
    <Router>
      {/* <nav className="flex gap-6 p-4 bg-gray-100 shadow mb-8">
        <Link to="/" className="text-blue-700 font-semibold hover:underline">Performance Report</Link>
        <Link to="/kpi" className="text-blue-700 font-semibold hover:underline">Performance KPI Report</Link>
      </nav> */}
      <Routes>
        <Route path="/" element={<EmployeeLogin/>}/>
        <Route path="/app" element={<Layout/>}>
          <Route path="weeklysummary" element={<WeeklyRoleSummary />} />
          <Route path="weeklysummaryentry" element={<WeeklySummaryEntry />} />
          <Route path="mygoals" element={<MyGoalsDashboard />} />
          <Route path="performance" element={<EmsPerformance />} />
          <Route path="kpi" element={<KPIReport/>}/>
          <Route path="role" element={<EmployeeRoleManagement />} />
          <Route path="actions" element={<WeeklyGoalsAction />} />
          <Route path="profile" element={<Profile />} />
          <Route path="weeklyreport" element={<WeeklyReport />} />
        </Route>
      </Routes>
    </Router>
  )
}

export default App
