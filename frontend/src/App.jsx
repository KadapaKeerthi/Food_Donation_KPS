import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HeaderMegaMenu } from './Components/Navbar/HeaderMegaMenu'
import LoginPage from './Pages/LoginPage/LoginPage'
import Home from './Pages/Home/Home'
import RegisterPage from './components/register/Register'
import RoleSelectPage from './components/role/RoleSelect'

export default function App() {
  return (
    <BrowserRouter>
      <HeaderMegaMenu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/select-role" element={<RoleSelectPage />} />
      </Routes>
    </BrowserRouter>
  )
}