import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import { getIsLoggedIn, getName, getUserAvatar, removeUser } from '../../redux/slices/User'
import styles from './HeaderMegaMenu.module.css'

export function HeaderMegaMenu() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const isLoggedIn = useSelector(getIsLoggedIn)
  const name = useSelector(getName)
  const avatar = useSelector(getUserAvatar)

  const isLoginPage = location.pathname === '/login'

  const handleLogout = () => {
    dispatch(removeUser())
    setMenuOpen(false)
    navigate('/login')
  }

  return (
    <div style={{ position: 'relative' }}>
      <header className={styles.header}>

        {/* Logo — top left */}
        <Link to="/" className={styles.logo}>
          <div className={styles.logoIcon}>🍽️</div>
          <div className={styles.logoTextWrap}>
            <span className={styles.logoText}>Donate<span>Dish</span></span>
            <span className={styles.logoTagline}>Feed the need</span>
          </div>
        </Link>

        {/* Auth Buttons — top right */}
        <div className={styles.actions}>
          {isLoggedIn ? (
            <>
              {/* Avatar + name */}
              <div className={styles.userInfo}>
                {avatar ? (
                  <img src={avatar} alt={name} className={styles.avatar} />
                ) : (
                  <div className={styles.avatarFallback}>
                    {name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
                <span className={styles.userName}>{name?.split(' ')[0]}</span>
              </div>

              {/* Logout button */}
              <button className={styles.btnOutline} onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : isLoginPage ? (
            <Link to="/register" className={styles.btnPrimary}>
              Create Account
            </Link>
          ) : (
            <>
              <Link to="/login" className={styles.btnOutline}>Sign In</Link>
              <Link to="/register" className={styles.btnPrimary}>Register</Link>
            </>
          )}
        </div>

        {/* Mobile Burger */}
        <button
          className={styles.burger}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span className={`${styles.line} ${menuOpen ? styles.open1 : ''}`} />
          <span className={`${styles.line} ${menuOpen ? styles.open2 : ''}`} />
          <span className={`${styles.line} ${menuOpen ? styles.open3 : ''}`} />
        </button>
      </header>

      {/* Mobile Drawer */}
      {menuOpen && (
        <div className={styles.drawer}>
          {isLoggedIn ? (
            <>
              <div className={styles.drawerUser}>
                {avatar ? (
                  <img src={avatar} alt={name} className={styles.avatar} />
                ) : (
                  <div className={styles.avatarFallback}>
                    {name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                )}
                <span>{name}</span>
              </div>
              <button className={styles.drawerLink} onClick={handleLogout}>
                Logout
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.drawerLink} onClick={() => setMenuOpen(false)}>Sign In</Link>
              <Link to="/register" className={styles.drawerLink} onClick={() => setMenuOpen(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </div>
  )
}