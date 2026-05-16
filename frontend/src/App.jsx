import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { HeaderMegaMenu } from './Components/Navbar/HeaderMegaMenu'
import LoginPage from './Pages/LoginPage/LoginPage'
import Home from './Pages/Home/Home'
import { useSelector } from 'react-redux'
import { getIsLoggedIn } from './redux/slices/User'

import RegisterPage from './Components/Register/Register'
import RoleSelectPage from './Components/Role/RoleSelect'
import DonorForm from './Components/Forms/DonarForm'
import ReceiverForm from './Components/Forms/ReceiverForm'

export default function App() {
  return (
    <BrowserRouter>
      <HeaderMegaMenu />
      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/login"
          element={
            <PublicRoute>
              <LoginPage />
            </PublicRoute>
          }
        />

        <Route
          path="/register"
          element={
            <PublicRoute>
              <RegisterPage />
            </PublicRoute>
          }
        />

        <Route path="/select-role" element={<RoleSelectPage />} />
        <Route path="/donor-form" element={<DonorForm />} />
        <Route path="/receiver-form" element={<ReceiverForm />} />
      </Routes>
    </BrowserRouter>
  )
}

function PublicRoute({ children }) {
  const isLoggedIn = useSelector(getIsLoggedIn)
  return isLoggedIn ? <Navigate to="/" replace /> : children
}

