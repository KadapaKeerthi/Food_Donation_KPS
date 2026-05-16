import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HeaderMegaMenu } from './Components/Navbar/HeaderMegaMenu'
import LoginPage from './Pages/LoginPage/LoginPage'
import Home from './Pages/Home/Home'
import RegisterPage from './components/register/Register'
import RoleSelectPage from './components/role/RoleSelect'
import DonorForm from './components/Forms/DonarForm'
import ReceiverForm from './components/Forms/Receiver'
import { useSelector } from 'react-redux'
import { getIsLoggedIn } from './redux/slices/User'
import { Navigate } from 'react-router-dom'

export default function App() {
  return (
    <BrowserRouter>
      <HeaderMegaMenu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/select-role" element={<RoleSelectPage />} />
       <Route path="/donor-form" element={<DonorForm />} />
       <Route path="/receiver-form" element={<ReceiverForm />} />
       <Route path="/login" element={
  <PublicRoute>
    <LoginPage />
  </PublicRoute>
} />
<Route path="/register" element={
  <PublicRoute>
    <RegisterPage />
  </PublicRoute>
} />
      </Routes>
    </BrowserRouter>
  )
}
function PublicRoute({ children }) {
  const isLoggedIn = useSelector(getIsLoggedIn)
  return isLoggedIn ? <Navigate to="/" replace /> : children
}