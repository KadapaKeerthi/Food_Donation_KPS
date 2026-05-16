import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Service from '../../utils/http'
import logo from '../../assets/logo.png'
import { GoogleLogin } from '@react-oauth/google'

const service = new Service()

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .dd-page {
    min-height: 100vh;
    font-family: 'Segoe UI', sans-serif;
    background: #f3f4f6;
  }

  .dd-hero {
    position: relative;
    min-height: 520px;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: linear-gradient(145deg, #0f0f1a 0%, #16213e 60%, #1e2a45 100%);
  }

  .dd-hero-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 20% 50%, rgba(249,115,22,0.12) 0%, transparent 55%),
      radial-gradient(ellipse at 80% 20%, rgba(99,102,241,0.1) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  .dd-hero-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(to right,
      rgba(15,15,26,0.85) 0%,
      rgba(15,15,26,0.5) 50%,
      rgba(15,15,26,0.2) 100%
    );
    pointer-events: none;
    z-index: 1;
  }

  .dd-hero-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.35;
    pointer-events: none;
    z-index: 0;
  }

  .dd-hero-content {
    position: relative;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 100%;
    max-width: 1100px;
    padding: 3rem 2rem;
    gap: 3rem;
  }

  .dd-hero-text { flex: 1; max-width: 520px; }

  .dd-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(249,115,22,0.15);
    border: 1px solid rgba(249,115,22,0.35);
    border-radius: 20px;
    padding: 5px 16px;
    font-size: 11px;
    color: #fdba74;
    font-weight: 600;
    letter-spacing: 1.5px;
    margin-bottom: 1.25rem;
  }

  .dd-hero h1 {
    font-size: clamp(28px, 4vw, 48px);
    font-weight: 800;
    color: white;
    line-height: 1.2;
    margin-bottom: 1rem;
  }

  .dd-hero h1 span { color: #f97316; }

  .dd-hero p {
    font-size: 15px;
    color: rgba(255,255,255,0.6);
    line-height: 1.7;
    margin-bottom: 2rem;
    max-width: 420px;
  }

  .dd-hero-stats { display: flex; gap: 2rem; flex-wrap: wrap; }

  .dd-hero-stat-num {
    font-size: 24px;
    font-weight: 800;
    color: #f97316;
    display: block;
  }

  .dd-hero-stat-label { font-size: 12px; color: rgba(255,255,255,0.45); }

  .dd-login-card {
    background: white;
    border-radius: 20px;
    padding: 2.5rem 2rem;
    width: 100%;
    max-width: 380px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.35);
    border: 1px solid rgba(255,255,255,0.1);
    flex-shrink: 0;
    position: relative;
    z-index: 20;
  }

  .dd-card-top { text-align: center; margin-bottom: 1.75rem; }

  .dd-card-title {
    font-size: 22px;
    font-weight: 800;
    color: #111827;
    margin-bottom: 4px;
  }

  .dd-card-sub { font-size: 13px; color: #6b7280; }

  .dd-error {
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 10px;
    padding: 10px 14px;
    font-size: 13px;
    color: #dc2626;
    margin-bottom: 1rem;
  }

  .dd-google-wrap {
    display: flex;
    justify-content: center;
    position: relative;
    z-index: 21;
    margin-bottom: 4px;
  }

  .dd-divider {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 16px 0;
    font-size: 12px;
    color: #9ca3af;
  }

  .dd-divider::before,
  .dd-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e5e7eb;
  }

  .dd-form { display: flex; flex-direction: column; gap: 14px; }
  .dd-form-group { display: flex; flex-direction: column; gap: 5px; }

  .dd-label-row {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .dd-label {
    font-size: 11px;
    font-weight: 700;
    color: #6b7280;
    letter-spacing: 0.8px;
    text-transform: uppercase;
  }

  .dd-forgot { font-size: 12px; color: #f97316; text-decoration: none; }
  .dd-forgot:hover { text-decoration: underline; }

  .dd-input {
    padding: 11px 14px;
    border-radius: 10px;
    border: 1.5px solid #e5e7eb;
    background: #f9fafb;
    font-size: 14px;
    color: #111827;
    outline: none;
    transition: border-color 0.2s, background 0.2s;
    font-family: inherit;
    width: 100%;
    position: relative;
    z-index: 21;
    pointer-events: auto;
  }

  .dd-input:focus { border-color: #f97316; background: white; }
  .dd-input::placeholder { color: #d1d5db; }

  .dd-input-wrap { position: relative; z-index: 21; }

  .dd-input-icon {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    font-size: 16px;
    color: #9ca3af;
    user-select: none;
    z-index: 22;
  }

  .dd-input-with-icon { padding-right: 40px; }

  .dd-btn-login {
    width: 100%;
    padding: 12px;
    background: linear-gradient(135deg, #f97316, #ea580c);
    border: none;
    border-radius: 24px;
    color: white;
    font-size: 15px;
    font-weight: 700;
    cursor: pointer;
    margin-top: 4px;
    transition: opacity 0.2s, transform 0.15s;
    box-shadow: 0 4px 16px rgba(249,115,22,0.4);
    font-family: inherit;
    position: relative;
    z-index: 21;
  }

  .dd-btn-login:hover { opacity: 0.92; transform: translateY(-1px); }
  .dd-btn-login:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .dd-register-link {
    text-align: center;
    font-size: 13px;
    color: #6b7280;
    margin-top: 14px;
  }

  .dd-register-anchor {
    color: #f97316;
    text-decoration: none;
    font-weight: 700;
  }

  .dd-register-anchor:hover { text-decoration: underline; }

  .dd-about { background: white; padding: 4rem 2rem; }

  .dd-about-inner {
    max-width: 1100px;
    margin: 0 auto;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 3rem;
    align-items: center;
  }

  .dd-about-tag {
    font-size: 11px;
    font-weight: 700;
    color: #f97316;
    letter-spacing: 2px;
    text-transform: uppercase;
    margin-bottom: 0.75rem;
  }

  .dd-about h2 {
    font-size: clamp(24px, 3vw, 36px);
    font-weight: 800;
    color: #111827;
    line-height: 1.25;
    margin-bottom: 1rem;
  }

  .dd-about h2 span { color: #f97316; }
  .dd-about p { font-size: 15px; color: #6b7280; line-height: 1.75; margin-bottom: 1rem; }

  .dd-about-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }

  .dd-about-card {
    background: #fff7ed;
    border: 1px solid #fed7aa;
    border-radius: 14px;
    padding: 1.25rem;
  }

  .dd-about-card-icon { font-size: 24px; margin-bottom: 8px; display: block; }
  .dd-about-card-title { font-size: 14px; font-weight: 700; color: #111827; margin-bottom: 4px; }
  .dd-about-card-desc { font-size: 12px; color: #6b7280; line-height: 1.5; }

  .dd-footer { background: #0f0f1a; padding: 3rem 2rem 1.5rem; }
  .dd-footer-inner { max-width: 1100px; margin: 0 auto; }

  .dd-footer-grid {
    display: grid;
    grid-template-columns: 2fr 1fr 1fr;
    gap: 2.5rem;
    margin-bottom: 2.5rem;
  }

  .dd-footer-logo {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 1rem;
    text-decoration: none;
  }

  .dd-footer-logo-icon {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: linear-gradient(135deg, #f97316, #ea580c);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
  }

  .dd-footer-logo-text { font-size: 16px; font-weight: 800; color: white; }
  .dd-footer-logo-text span { color: #f97316; }

  .dd-footer-desc {
    font-size: 13px;
    color: rgba(255,255,255,0.4);
    line-height: 1.7;
    margin-bottom: 1.25rem;
  }

  .dd-social-row { display: flex; gap: 10px; }

  .dd-social-btn {
    width: 36px;
    height: 36px;
    border-radius: 50%;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.12);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 16px;
    cursor: pointer;
    text-decoration: none;
    transition: background 0.2s, border-color 0.2s;
  }

  .dd-social-btn:hover {
    background: rgba(249,115,22,0.2);
    border-color: rgba(249,115,22,0.4);
  }

  .dd-footer-col-title {
    font-size: 11px;
    font-weight: 700;
    color: rgba(255,255,255,0.5);
    letter-spacing: 1.5px;
    text-transform: uppercase;
    margin-bottom: 1rem;
  }

  .dd-footer-link {
    display: block;
    font-size: 13px;
    color: rgba(255,255,255,0.5);
    text-decoration: none;
    margin-bottom: 8px;
    transition: color 0.2s;
  }

  .dd-footer-link:hover { color: #f97316; }

  .dd-contact-btn {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 20px;
    background: linear-gradient(135deg, #f97316, #ea580c);
    border: none;
    border-radius: 24px;
    color: white;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    margin-top: 0.5rem;
    transition: opacity 0.2s, transform 0.1s;
    box-shadow: 0 4px 14px rgba(249,115,22,0.35);
    text-decoration: none;
  }

  .dd-contact-btn:hover { opacity: 0.9; transform: translateY(-1px); }
  .dd-footer-email { font-size: 12px; color: rgba(255,255,255,0.3); margin-top: 8px; }

  .dd-footer-bottom {
    border-top: 1px solid rgba(255,255,255,0.08);
    padding-top: 1.5rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 8px;
  }

  .dd-footer-copy { font-size: 12px; color: rgba(255,255,255,0.25); }
  .dd-footer-links { display: flex; gap: 1.5rem; }

  .dd-footer-links a {
    font-size: 12px;
    color: rgba(255,255,255,0.25);
    text-decoration: none;
    transition: color 0.2s;
  }

  .dd-footer-links a:hover { color: #f97316; }

  @media (max-width: 768px) {
    .dd-hero-content { flex-direction: column; align-items: center; text-align: center; }
    .dd-hero-stats { justify-content: center; }
    .dd-login-card { max-width: 100%; }
    .dd-about-inner { grid-template-columns: 1fr; }
    .dd-footer-grid { grid-template-columns: 1fr; }
  }
`

export default function LoginPage() {
  const [form, setForm] = useState({ email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const navigate = useNavigate()

  const update = (key) => (e) => setForm({ ...form, [key]: e.target.value })

  // ── Email Login ──────────────────────────────
  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    if (!form.email || !form.password) {
      setError('Please enter both email and password.')
      return
    }
    setLoading(true)
    try {
      await service.post('auth/login', form)
      navigate('/select-role')   // ← role selection after login
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        'Invalid email or password. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  // ── Google Login ─────────────────────────────
  // Uses GoogleLogin component which sends ID token
  // Backend loginWithGoogle expects { token } = req.body
  const handleGoogleSuccess = async (credentialResponse) => {
    setError('')
    setLoading(true)
    try {
      await service.post('auth/google', {
        token: credentialResponse.credential  // ← ID token backend verifies
      })
      navigate('/select-role')   // ← role selection after Google login
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        'Google login failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <style>{css}</style>
      <div className="dd-page">

        <section className="dd-hero">
          <div className="dd-hero-bg" />
          <img
            className="dd-hero-img"
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1400&q=80"
            alt="Children in need of food"
          />
          <div className="dd-hero-overlay" />

          <div className="dd-hero-content">

            {/* Left — Text */}
            <div className="dd-hero-text">
              <div className="dd-badge">🍽️ SHARE TODAY · NOURISH TOMORROW</div>
              <h1>
                No child should<br />sleep <span>hungry</span><br />tonight
              </h1>
              <p>
                DonateDish connects food donors with those in need.
                Every meal you share gives hope, strength, and a better tomorrow
                to families across India.
              </p>
              <div className="dd-hero-stats">
                <div>
                  <span className="dd-hero-stat-num">12,400+</span>
                  <span className="dd-hero-stat-label">Meals Donated</span>
                </div>
                <div>
                  <span className="dd-hero-stat-num">3,200+</span>
                  <span className="dd-hero-stat-label">Families Helped</span>
                </div>
                <div>
                  <span className="dd-hero-stat-num">98</span>
                  <span className="dd-hero-stat-label">Cities</span>
                </div>
              </div>
            </div>

            {/* Right — Login Card */}
            <div className="dd-login-card">
              <div className="dd-card-top">
                <img
                  src={logo}
                  alt="DonateDish"
                  style={{ width: 90, height: 90, objectFit: 'contain', marginBottom: '0.75rem' }}
                />
                <h2 className="dd-card-title">Welcome back</h2>
                <p className="dd-card-sub">Sign in to continue donating</p>
              </div>

              {error && <div className="dd-error">⚠️ {error}</div>}

              {/* ── Google Login ── */}
              <div className="dd-google-wrap">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => setError('Google login failed. Please try again.')}
                  width="340"
                  theme="outline"
                  size="large"
                  text="continue_with"
                  shape="pill"
                />
              </div>

              <div className="dd-divider"><span>or sign in with email</span></div>

              {/* ── Email Form ── */}
              <form className="dd-form" onSubmit={handleLogin}>
                <div className="dd-form-group">
                  <label className="dd-label" htmlFor="dd-email">Email address</label>
                  <input
                    id="dd-email"
                    type="email"
                    className="dd-input"
                    placeholder="you@example.com"
                    value={form.email}
                    onChange={update('email')}
                    autoComplete="email"
                    required
                  />
                </div>

                <div className="dd-form-group">
                  <div className="dd-label-row">
                    <label className="dd-label" htmlFor="dd-password">Password</label>
                    <Link to="/forgot-password" className="dd-forgot">Forgot?</Link>
                  </div>
                  <div className="dd-input-wrap">
                    <input
                      id="dd-password"
                      type={showPassword ? 'text' : 'password'}
                      className="dd-input dd-input-with-icon"
                      placeholder="••••••••"
                      value={form.password}
                      onChange={update('password')}
                      autoComplete="current-password"
                      required
                    />
                    <span
                      className="dd-input-icon"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </span>
                  </div>
                </div>

                <button
                  type="submit"
                  className="dd-btn-login"
                  disabled={loading}
                >
                  {loading ? 'Signing in...' : 'Sign In →'}
                </button>
              </form>

              <p className="dd-register-link">
                New here?{' '}
                <Link to="/register" className="dd-register-anchor">
                  Register free →
                </Link>
              </p>
            </div>
          </div>
        </section>

        {/* ── ABOUT SECTION ── */}
        <section className="dd-about">
          <div className="dd-about-inner">
            <div>
              <p className="dd-about-tag">About DonateDish</p>
              <h2>Turning <span>surplus food</span> into second chances</h2>
              <p>
                Every day, tons of edible food goes to waste while millions
                go to bed hungry. DonateDish bridges this gap by connecting
                restaurants, households, and businesses with NGOs and
                families in need — quickly, safely, and for free.
              </p>
              <p>
                Whether you have leftover food from a wedding, a restaurant
                closing for the night, or simply want to help — we make
                donation effortless.
              </p>
            </div>
            <div className="dd-about-cards">
              {[
                { icon: '🍱', title: 'Donate Food', desc: 'List surplus food in seconds and we handle the rest.' },
                { icon: '🚚', title: 'Fast Pickup', desc: 'Volunteers pick up within hours of your listing.' },
                { icon: '❤️', title: 'Track Impact', desc: 'See exactly how many families your donation helped.' },
                { icon: '🌱', title: 'Zero Waste', desc: 'Reduce food waste and carbon footprint together.' },
              ].map(card => (
                <div className="dd-about-card" key={card.title}>
                  <span className="dd-about-card-icon">{card.icon}</span>
                  <p className="dd-about-card-title">{card.title}</p>
                  <p className="dd-about-card-desc">{card.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="dd-footer">
          <div className="dd-footer-inner">
            <div className="dd-footer-grid">
              <div>
                <Link to="/" className="dd-footer-logo">
                  <div className="dd-footer-logo-icon">🍽️</div>
                  <span className="dd-footer-logo-text">Donate<span>Dish</span></span>
                </Link>
                <p className="dd-footer-desc">
                  Reducing food waste and hunger across India —
                  one meal at a time. Join us in making a difference.
                </p>
                <div className="dd-social-row">
                  <a href="https://instagram.com" target="_blank" rel="noreferrer" className="dd-social-btn">📸</a>
                  <a href="https://twitter.com" target="_blank" rel="noreferrer" className="dd-social-btn">🐦</a>
                  <a href="https://facebook.com" target="_blank" rel="noreferrer" className="dd-social-btn">👥</a>
                  <a href="https://youtube.com" target="_blank" rel="noreferrer" className="dd-social-btn">▶️</a>
                  <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="dd-social-btn">💼</a>
                </div>
              </div>

              <div>
                <p className="dd-footer-col-title">Quick Links</p>
                <Link to="/" className="dd-footer-link">Home</Link>
                <Link to="/donor-form" className="dd-footer-link">Donate Food</Link>
                <Link to="/receiver-form" className="dd-footer-link">Food Requests</Link>
                <Link to="/about" className="dd-footer-link">About Us</Link>
                <Link to="/login" className="dd-footer-link">Sign In</Link>
              </div>

              <div>
                <p className="dd-footer-col-title">Contact Us</p>
                <a href="mailto:hello@donatedish.org" className="dd-contact-btn">
                  ✉️ Get in Touch
                </a>
                <p className="dd-footer-email">hello@donatedish.org</p>
                <p className="dd-footer-email" style={{ marginTop: 6 }}>+91 98765 43210</p>
              </div>
            </div>

            <div className="dd-footer-bottom">
              <p className="dd-footer-copy">© 2026 DonateDish. All rights reserved.</p>
              <div className="dd-footer-links">
                <a href="#">Privacy Policy</a>
                <a href="#">Terms of Use</a>
                <a href="#">Cookies</a>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </>
  )
}