import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { HeaderMegaMenu } from './Components/Navbar/HeaderMegaMenu'
import LoginPage from './Pages/LoginPage/LoginPage'
import Home from './Pages/Home/Home'

export default function App() {
  return (
    <BrowserRouter>
      <HeaderMegaMenu />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<LoginPage />} />
      </Routes>
    </BrowserRouter>
  )
}