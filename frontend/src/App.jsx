import React from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'

const Login = React.lazy(() => import('./pages/Login'));
const Signup = React.lazy(() => import('./pages/Signup'));
const AdminDashboard = React.lazy(() => import('./pages/AdminDashboard'));
const AgentDashboard = React.lazy(() => import('./pages/AgentDashboard'));

const App = () => {
  return (
    <div className="min-h-screen min-w-full" style={{ background: 'linear-gradient(135deg, #e0f7fa 0%, #f0fff4 60%, #38bdf8 100%)' }}>
      <Router>
        <React.Suspense fallback={<div>Loading...</div>}>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/agent" element={<AgentDashboard />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </React.Suspense>
      </Router>
    </div>
  )
}

export default App