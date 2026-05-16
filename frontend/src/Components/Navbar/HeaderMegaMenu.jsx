import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import styles from './HeaderMegaMenu.module.css'

export function HeaderMegaMenu() {
  const [menuOpen, setMenuOpen] = useState(false)
  const location = useLocation()
  const isLoginPage = location.pathname === '/login'

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
          {isLoginPage ? (
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
          <Link to="/login" className={styles.drawerLink} onClick={() => setMenuOpen(false)}>Sign In</Link>
          <Link to="/register" className={styles.drawerLink} onClick={() => setMenuOpen(false)}>Register</Link>
        </div>
      )}
    </div>
  )
}