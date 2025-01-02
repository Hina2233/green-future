import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import AdminDashboard from './pages/admin/Dashboard';
import Home from './pages/Home';
import CreateNewIdea from './components/Idea Collestions/CreateNewIdea';
import Detailspage from './components/Idea Collestions/Detailspage';
import RoleSelection from './components/RoleSelection';
import OfflineSubmissions from './pages/OfflineSubmissions';
import Manager from './pages/manager/Manager';

function App() {
  const [count, setCount] = useState(0)

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/role-selection" element={<RoleSelection />} />
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/" element={<RoleSelection />} />
        <Route path="/home-page" element={<Home />} />
        <Route path="/create-new-idea" element={<CreateNewIdea />} />
        <Route path="/detail-page/:id" element={<Detailspage />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/offline-submissions" element={<OfflineSubmissions />} /> 
        <Route path="/manager/dashboard" element={<Manager />} /> 
      </Routes>
    </BrowserRouter>
  )
}

export default App
