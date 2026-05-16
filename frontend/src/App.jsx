import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HeaderMegaMenu } from './Components/Navbar/HeaderMegaMenu'
import LoginPage from './Pages/LoginPage/LoginPage'
import Home from './Pages/Home/Home'
import RegisterPage from './components/register/Register'
import RoleSelectPage from './components/role/RoleSelect'
import DonorForm from './Components/Forms/DonarForm'
import ReceiverForm from './Components/Forms/Receiver'

export default function App() {
  return (
    <BrowserRouter>
      <HeaderMegaMenu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/select-role" element={<RoleSelectPage />} />

        {/* Donate / Receive */}
        <Route path="/donate" element={<DonorForm />} />
        <Route path="/requests" element={<ReceiverForm />} />
      </Routes>
    </BrowserRouter>
  )
}

