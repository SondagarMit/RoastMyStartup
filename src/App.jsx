import React, { useState } from 'react'
import { HashRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './pages/LandingPage'
import RoastExperience from './pages/RoastExperience'
import Pricing from './pages/Pricing'
import Dashboard from './pages/Dashboard'
import Examples from './pages/Examples'
import { AuthProvider } from './context/AuthContext'

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-bg text-white selection:bg-primary selection:text-white">
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/roast" element={<RoastExperience />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/examples" element={<Examples />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
