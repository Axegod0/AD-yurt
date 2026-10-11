import React from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Dashboard from './Dashboard'
import Laundry from './pages/Laundry'
import LaundryStep1 from './pages/LaundryStep1'
import LaundryStep2 from './pages/LaundryStep2'
import LaundryStep3 from './pages/LaundryStep3'
import LaundryStep4 from './pages/LaundryStep4'
import Orders from './pages/Orders'
import Services from './pages/Services'
import AnnouncementsPage from './pages/AnnouncementsPage'
import Profile from './pages/Profile'
import AdminLaundryOrders from './pages/AdminLaundryOrders'
import AdminBalanceManagement from './pages/AdminBalanceManagement'
import AdminSupportTickets from './pages/AdminSupportTickets'
import AdminStudents from './pages/AdminStudents'
import Login from './pages/Login'
import ComingSoon from './pages/ComingSoon'
import Transactions from './pages/Transactions'
import ResetPassword from './pages/ResetPassword'
import NotificationsSettings from './pages/NotificationsSettings'
import DormRules from './pages/DormRules'
import Contact from './pages/Contact'
import CreateTicket from './pages/CreateTicket'
import ForceChangePassword from './pages/ForceChangePassword'

function AnimatedRoutes() {
  const location = useLocation();
  return (
    <div className="page-transition">
      <Routes location={location}>
        <Route path="/" element={<Dashboard />} />
        <Route path="/login" element={<Login />} />
        <Route path="/laundry" element={<Laundry />} />
        <Route path="/laundry/step1" element={<LaundryStep1 />} />
        <Route path="/laundry/step2" element={<LaundryStep2 />} />
        <Route path="/laundry/step3" element={<LaundryStep3 />} />
        <Route path="/laundry/step4" element={<LaundryStep4 />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/services" element={<Services />} />
        <Route path="/duyurular" element={<AnnouncementsPage />} />
        <Route path="/profil" element={<Profile />} />
        <Route path="/admin/laundry" element={<AdminLaundryOrders />} />
        <Route path="/admin/balance" element={<AdminBalanceManagement />} />
        <Route path="/admin/support" element={<AdminSupportTickets />} />
        <Route path="/admin/students" element={<AdminStudents />} />
        <Route path="/coming-soon" element={<ComingSoon />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/force-password" element={<ForceChangePassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/notifications-settings" element={<NotificationsSettings />} />
        <Route path="/dorm-rules" element={<DormRules />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/create-ticket" element={<CreateTicket />} />
      </Routes>
    </div>
  );
}

function App() {
  return (
    <Router>
      <AnimatedRoutes />
    </Router>
  )
}

export default App
