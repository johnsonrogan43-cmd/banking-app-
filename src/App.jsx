import React from 'react'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'  // ADD THIS IMPORT
import Verify from './pages/Verify'
import Dashboard from './pages/Dashboard'
import AdminSecure from "./pages/AdminSecure"
import AdminHidden from "./pages/AdminHidden"
import Transfer from "./pages/Transfer"
import TransferConfirm from "./pages/TransferConfirm"

export default function App() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />  {/* ADD THIS ROUTE */}
          <Route path="/verify" element={<Verify />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/transfer" element={<Transfer />} />
          <Route path="/transfer/confirm" element={<TransferConfirm />} />
          <Route path="/plb-internal-9823-admin" element={<AdminSecure />} />
          <Route path="/system-terminal-access" element={<AdminSecure />} />
          <Route path="/xadm993" element={<AdminHidden />} />
        </Routes>
      </main>
      <Footer />
    </div>
  )
}