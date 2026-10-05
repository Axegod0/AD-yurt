import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Dashboard from './Dashboard'
import Laundry from './pages/Laundry'
import LaundryStep1 from './pages/LaundryStep1'
import LaundryStep2 from './pages/LaundryStep2'
import LaundryStep3 from './pages/LaundryStep3'
import LaundryStep4 from './pages/LaundryStep4'
import Orders from './pages/Orders'
import Services from './pages/Services'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/laundry" element={<Laundry />} />
        <Route path="/laundry/step1" element={<LaundryStep1 />} />
        <Route path="/laundry/step2" element={<LaundryStep2 />} />
        <Route path="/laundry/step3" element={<LaundryStep3 />} />
        <Route path="/laundry/step4" element={<LaundryStep4 />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/services" element={<Services />} />
      </Routes>
    </Router>
  )
}

export default App
