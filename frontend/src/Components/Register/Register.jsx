import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Service from '../../utils/http'
import logo from '../../assets/logo.png'
import { useGoogleLogin } from '@react-oauth/google'

const service = new Service()

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .rg-page {
    min-height: 100vh;
    font-family: 'Segoe UI', sans-serif;
    background: #f3f4f6;
  }

  /* ── HERO ── */
  .rg-hero {
    position: relative;
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;
    background: linear-gradient(145deg, #0f0f1a 0%, #16213e 60%, #1e2a45 100%);
  }

  .rg-hero-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 20% 50%, rgba(249,115,22,0.12) 0%, transparent 55%),
      radial-gradient(ellipse at 80% 20%, rgba(99,102,241,0.1) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  .rg-hero-overlay {
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

  .rg-hero-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.3;
    pointer-events: none;
    z-index: 0;
  }

  .rg-hero-content {
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

  /* ── LEFT TEXT ── */
  .rg-hero-text {
    flex: 1;
    max-width: 480px;
  }

  .rg-badge {
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

  .rg-hero h1 {
    font-size: clamp(26px, 3.5vw, 44px);
    font-weight: 800;
    color: white;
    line-height: 1.2;
    margin-bottom: 1rem;
  }

  .rg-hero h1 span { color: #f97316; }

  .rg-hero p {
    font-size: 15px;
    color: rgba(255,255,255,0.6);
    line-height: 1.7;
    margin-bottom: 2rem;
    max-width: 400px;
  }

  .rg-steps {
    display: flex;
    flex-direction: column;
    gap: 14px;
  }

  .rg-step {
    display: flex;
    align-items: flex-start;
    gap: 12px;
  }

  .rg-step-num {
    width: 28px;
    height: 28px;
    border-radius: 50%;
    background: linear-gradient(135deg, #f97316, #ea580c);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    font-weight: 800;
    color: white;
    flex-shrink: 0;
    margin-top: 1px;
  }

  .rg-step-text strong {
    display: block;
    font-size: 13px;
    font-weight: 700;
    color: white;
    margin-bottom: 2px;
  }

  .rg-step-text span {
    font-size: 12px;
    color: rgba(255,255,255,0.45);
  }

  /* ── REGISTER CARD ── */
  .rg-card {
    background: white;
    border-radius: 20px;
    padding: 2rem 1.75rem;
    width: 100%;
    max-width: 400px;
    box-shadow: 0 20px 60px rgba(0,0,0,0.35);
    border: 1px solid rgba(255,255,255,0.1);
    flex-shrink: 0;
    position: relative;
    z-index: 20;
  }

  .rg-card-top {
    text-align: center;
    margin-bottom: 1.5rem;
  }

  .rg-card-title {
    font-size: 21px;
    font-weight: 800;
    color: #111827;
    margin-bottom: 4px;
  }

  .rg-card-sub { font-size: 13px; color: #6b7280; }

  /* ── MESSAGES ── */
  .rg-error {
    background: #fef2f2;
    border: 1px solid #fecaca;
    border-radius: 10px;
    padding: 10px 14px;
    font-size: 13px;
    color: #dc2626;
    margin-bottom: 1rem;
  }

  .rg-success {
    background: #f0fdf4;
    border: 1px solid #bbf7d0;
    border-radius: 10px;
    padding: 10px 14px;
    font-size: 13px;
    color: #16a34a;
    margin-bottom: 1rem;
  }

  /* ── FORM ── */
  .rg-form { display: flex; flex-direction: column; gap: 12px; }

  .rg-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
  }

  .rg-form-group { display: flex; flex-direction: column; gap: 5px; }

  .rg-label {
    font-size: 11px;
    font-weight: 700;
    color: #6b7280;
    letter-spacing: 0.8px;
    text-transform: uppercase;
  }

  .rg-input-wrap {
    position: relative;
    z-index: 21;
  }

  .rg-input {
    padding: 10px 14px;
    border-radius: 10px;
    border: 1.5px solid #e5e7eb;
    background: #f9fafb;
    font-size: 14px;
    color: #111827;
    outline: none;
    transition: border-color 0.2s, background 0.2s, box-shadow 0.2s;
    font-family: inherit;
    width: 100%;
    position: relative;
    z-index: 21;
    pointer-events: auto;
  }

  .rg-input:focus {
    border-color: #f97316;
    background: white;
    box-shadow: 0 0 0 3px rgba(249,115,22,0.08);
  }

  .rg-input::placeholder { color: #d1d5db; }

  .rg-input.rg-invalid {
    border-color: #fca5a5;
    background: #fff7f7;
  }

  .rg-input.rg-valid {
    border-color: #86efac;
    background: #f0fdf4;
  }

  .rg-input-with-icon { padding-right: 38px; }

  .rg-input-icon {
    position: absolute;
    right: 11px;
    top: 50%;
    transform: translateY(-50%);
    cursor: pointer;
    font-size: 15px;
    color: #9ca3af;
    user-select: none;
    z-index: 22;
  }

  .rg-field-hint {
    font-size: 11px;
    color: #9ca3af;
    margin-top: 2px;
  }

  .rg-field-error {
    font-size: 11px;
    color: #dc2626;
    margin-top: 2px;
  }

  /* Password strength */
  .rg-strength-bar {
    display: flex;
    gap: 4px;
    margin-top: 6px;
  }

  .rg-strength-seg {
    height: 3px;
    flex: 1;
    border-radius: 2px;
    background: #e5e7eb;
    transition: background 0.3s;
  }

  .rg-strength-seg.active-weak   { background: #ef4444; }
  .rg-strength-seg.active-fair   { background: #f97316; }
  .rg-strength-seg.active-good   { background: #eab308; }
  .rg-strength-seg.active-strong { background: #22c55e; }

  .rg-strength-label {
    font-size: 11px;
    margin-top: 3px;
    font-weight: 600;
  }

  .rg-strength-label.weak   { color: #ef4444; }
  .rg-strength-label.fair   { color: #f97316; }
  .rg-strength-label.good   { color: #eab308; }
  .rg-strength-label.strong { color: #22c55e; }

  /* Terms */
  .rg-terms {
    display: flex;
    align-items: flex-start;
    gap: 8px;
    font-size: 12px;
    color: #6b7280;
    line-height: 1.5;
    margin-top: 2px;
  }

  .rg-terms input[type="checkbox"] {
    margin-top: 2px;
    accent-color: #f97316;
    cursor: pointer;
    flex-shrink: 0;
  }

  .rg-terms a { color: #f97316; text-decoration: none; }
  .rg-terms a:hover { text-decoration: underline; }

  /* Buttons */
  .rg-btn-register {
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

  .rg-btn-register:hover { opacity: 0.92; transform: translateY(-1px); }
  .rg-btn-register:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .rg-divider {
    display: flex;
    align-items: center;
    gap: 10px;
    margin: 14px 0;
    font-size: 12px;
    color: #9ca3af;
  }

  .rg-divider::before,
  .rg-divider::after {
    content: '';
    flex: 1;
    height: 1px;
    background: #e5e7eb;
  }

  .rg-btn-google {
    width: 100%;
    padding: 10px;
    background: white;
    border: 1.5px solid #e5e7eb;
    border-radius: 24px;
    font-size: 14px;
    font-family: inherit;
    color: #111827;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    transition: border-color 0.2s, background 0.2s;
    position: relative;
    z-index: 21;
    font-weight: 600;
  }

  .rg-btn-google:hover { border-color: #cbd5e1; background: #f9fafb; }
  .rg-btn-google:disabled { opacity: 0.6; cursor: not-allowed; }

  .rg-login-link {
    text-align: center;
    font-size: 13px;
    color: #6b7280;
    margin-top: 14px;
  }

  .rg-login-anchor {
    color: #f97316;
    text-decoration: none;
    font-weight: 700;
  }

  .rg-login-anchor:hover { text-decoration: underline; }

  /* ── FOOTER ── */
  .rg-footer { background: #0f0f1a; padding: 2rem; text-align: center; }
  .rg-footer-copy { font-size: 12px; color: rgba(255,255,255,0.2); }

  @media (max-width: 768px) {
    .rg-hero-content { flex-direction: column; align-items: center; text-align: center; padding: 2rem 1rem; }
    .rg-card { max-width: 100%; }
    .rg-steps { align-items: flex-start; }
    .rg-hero-text { max-width: 100%; }
  }

  @media (max-width: 400px) {
    .rg-row { grid-template-columns: 1fr; }
  }
`

// ── Password strength checker ─────────────────
function getStrength(pw) {
  if (!pw) return { score: 0, label: '', cls: '' }
  let score = 0
  if (pw.length >= 8) score++
  if (/[A-Z]/.test(pw)) score++
  if (/[0-9]/.test(pw)) score++
  if (/[^A-Za-z0-9]/.test(pw)) score++
  const map = [
    { label: '', cls: '' },
    { label: 'Weak', cls: 'weak' },
    { label: 'Fair', cls: 'fair' },
    { label: 'Good', cls: 'good' },
    { label: 'Strong', cls: 'strong' },
  ]
  return { score, ...map[score] }
}

const GoogleIcon = () => (
  <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
    <path fill="#4285F4" d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z"/>
    <path fill="#34A853" d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.258c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 0 0 9 18z"/>
    <path fill="#FBBC05" d="M3.964 10.707A5.41 5.41 0 0 1 3.682 9c0-.593.102-1.17.282-1.707V4.961H.957A8.996 8.996 0 0 0 0 9c0 1.452.348 2.827.957 4.039l3.007-2.332z"/>
    <path fill="#EA4335" d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 0 0 .957 4.961L3.964 7.293C4.672 5.163 6.656 3.58 9 3.58z"/>
  </svg>
)

export default function RegisterPage() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  })
  const [touched, setTouched] = useState({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const navigate = useNavigate()

  const update = (key) => (e) => {
    setForm({ ...form, [key]: e.target.value })
    setError('')
  }

  const blur = (key) => () => setTouched({ ...touched, [key]: true })

  // ── Validation ────────────────────────────────
  const errors = {
    firstName: !form.firstName.trim() ? 'First name is required' : '',
    lastName: !form.lastName.trim() ? 'Last name is required' : '',
    email: !form.email
      ? 'Email is required'
      : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)
      ? 'Enter a valid email'
      : '',
    password: !form.password
      ? 'Password is required'
      : form.password.length < 8
      ? 'Minimum 8 characters'
      : '',
    confirmPassword: !form.confirmPassword
      ? 'Please confirm your password'
      : form.confirmPassword !== form.password
      ? 'Passwords do not match'
      : '',
  }

  const isFormValid =
    Object.values(errors).every((e) => !e) && agreed

  const strength = getStrength(form.password)
  const strengthClasses = ['weak', 'fair', 'good', 'strong']

  // ── Email Register ────────────────────────────
  const handleRegister = async (e) => {
    e.preventDefault()
    // Touch all fields to show errors
    setTouched({ firstName: true, lastName: true, email: true, password: true, confirmPassword: true })
    if (!isFormValid) {
      setError('Please fix the errors above before continuing.')
      return
    }
    setError('')
    setLoading(true)
    try {
      await service.post('auth/register', {
        firstName: form.firstName.trim(),
        lastName: form.lastName.trim(),
        email: form.email,
        password: form.password,
      })
      setSuccess('Account created! Redirecting to login...')
      setTimeout(() => navigate('/login'), 1800)
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        'Registration failed. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  // ── Google Register ───────────────────────────
  const handleGoogleRegister = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setGoogleLoading(true)
      setError('')
      try {
        const userInfo = await fetch(
          'https://www.googleapis.com/oauth2/v3/userinfo',
          { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } }
        ).then((res) => res.json())

        await service.post('auth/google', {
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
          googleId: userInfo.sub,
        })

        navigate('/')
      } catch (err) {
        setError('Google sign-up failed. Please try again.')
      } finally {
        setGoogleLoading(false)
      }
    },
    onError: () => {
      setError('Google sign-up was cancelled or failed.')
      setGoogleLoading(false)
    },
  })

  const inputClass = (key) => {
    if (!touched[key]) return 'rg-input'
    return `rg-input ${errors[key] ? 'rg-invalid' : 'rg-valid'}`
  }

  return (
    <>
      <style>{css}</style>
      <div className="rg-page">

        <section className="rg-hero">
          <div className="rg-hero-bg" />
          <img
            className="rg-hero-img"
            src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1400&q=80"
            alt="Children in need of food"
          />
          <div className="rg-hero-overlay" />

          <div className="rg-hero-content">

            {/* Left — Text */}
            <div className="rg-hero-text">
              <div className="rg-badge">🍽️ JOIN THE MOVEMENT</div>
              <h1>
                Be the reason<br />someone eats<br /><span>tonight</span>
              </h1>
              <p>
                Create your free DonateDish account and start making
                a difference in your community — one meal at a time.
              </p>
              <div className="rg-steps">
                {[
                  { num: '1', title: 'Create your account', sub: 'Takes less than 2 minutes' },
                  { num: '2', title: 'List surplus food', sub: 'Add details, photo & pickup time' },
                  { num: '3', title: 'We handle the rest', sub: 'Volunteers collect & deliver' },
                ].map((s) => (
                  <div className="rg-step" key={s.num}>
                    <div className="rg-step-num">{s.num}</div>
                    <div className="rg-step-text">
                      <strong>{s.title}</strong>
                      <span>{s.sub}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right — Register Card */}
            <div className="rg-card">
              <div className="rg-card-top">
                <img
                  src={logo}
                  alt="DonateDish"
                  style={{ width: 72, height: 72, objectFit: 'contain', marginBottom: '0.6rem' }}
                />
                <h2 className="rg-card-title">Create your account</h2>
                <p className="rg-card-sub">Free forever · No credit card needed</p>
              </div>

              {error && <div className="rg-error">⚠️ {error}</div>}
              {success && <div className="rg-success">✅ {success}</div>}

              {/* Google Sign-Up */}
              <button
                type="button"
                className="rg-btn-google"
                onClick={() => handleGoogleRegister()}
                disabled={googleLoading || loading}
              >
                {googleLoading ? 'Connecting...' : <><GoogleIcon /> Sign up with Google</>}
              </button>

              <div className="rg-divider"><span>or fill in your details</span></div>

              <form className="rg-form" onSubmit={handleRegister} noValidate>

                {/* First Name + Last Name */}
                <div className="rg-row">
                  <div className="rg-form-group">
                    <label className="rg-label" htmlFor="rg-firstName">First name</label>
                    <input
                      id="rg-firstName"
                      type="text"
                      className={inputClass('firstName')}
                      placeholder="Priya"
                      value={form.firstName}
                      onChange={update('firstName')}
                      onBlur={blur('firstName')}
                      autoComplete="given-name"
                    />
                    {touched.firstName && errors.firstName && (
                      <span className="rg-field-error">{errors.firstName}</span>
                    )}
                  </div>
                  <div className="rg-form-group">
                    <label className="rg-label" htmlFor="rg-lastName">Last name</label>
                    <input
                      id="rg-lastName"
                      type="text"
                      className={inputClass('lastName')}
                      placeholder="Sharma"
                      value={form.lastName}
                      onChange={update('lastName')}
                      onBlur={blur('lastName')}
                      autoComplete="family-name"
                    />
                    {touched.lastName && errors.lastName && (
                      <span className="rg-field-error">{errors.lastName}</span>
                    )}
                  </div>
                </div>

                {/* Email */}
                <div className="rg-form-group">
                  <label className="rg-label" htmlFor="rg-email">Email address</label>
                  <input
                    id="rg-email"
                    type="email"
                    className={inputClass('email')}
                    placeholder="priya@example.com"
                    value={form.email}
                    onChange={update('email')}
                    onBlur={blur('email')}
                    autoComplete="email"
                  />
                  {touched.email && errors.email && (
                    <span className="rg-field-error">{errors.email}</span>
                  )}
                </div>

                {/* Password */}
                <div className="rg-form-group">
                  <label className="rg-label" htmlFor="rg-password">Password</label>
                  <div className="rg-input-wrap">
                    <input
                      id="rg-password"
                      type={showPassword ? 'text' : 'password'}
                      className={`${inputClass('password')} rg-input-with-icon`}
                      placeholder="Min. 8 characters"
                      value={form.password}
                      onChange={update('password')}
                      onBlur={blur('password')}
                      autoComplete="new-password"
                    />
                    <span
                      className="rg-input-icon"
                      onClick={() => setShowPassword(!showPassword)}
                      title={showPassword ? 'Hide' : 'Show'}
                    >
                      {showPassword ? '🙈' : '👁️'}
                    </span>
                  </div>
                  {form.password && (
                    <>
                      <div className="rg-strength-bar">
                        {[1, 2, 3, 4].map((i) => (
                          <div
                            key={i}
                            className={`rg-strength-seg ${
                              strength.score >= i ? `active-${strengthClasses[strength.score - 1]}` : ''
                            }`}
                          />
                        ))}
                      </div>
                      {strength.label && (
                        <span className={`rg-strength-label ${strength.cls}`}>
                          {strength.label} password
                        </span>
                      )}
                    </>
                  )}
                  {touched.password && errors.password && (
                    <span className="rg-field-error">{errors.password}</span>
                  )}
                </div>

                {/* Confirm Password */}
                <div className="rg-form-group">
                  <label className="rg-label" htmlFor="rg-confirm">Confirm password</label>
                  <div className="rg-input-wrap">
                    <input
                      id="rg-confirm"
                      type={showConfirm ? 'text' : 'password'}
                      className={`${inputClass('confirmPassword')} rg-input-with-icon`}
                      placeholder="Re-enter password"
                      value={form.confirmPassword}
                      onChange={update('confirmPassword')}
                      onBlur={blur('confirmPassword')}
                      autoComplete="new-password"
                    />
                    <span
                      className="rg-input-icon"
                      onClick={() => setShowConfirm(!showConfirm)}
                      title={showConfirm ? 'Hide' : 'Show'}
                    >
                      {showConfirm ? '🙈' : '👁️'}
                    </span>
                  </div>
                  {touched.confirmPassword && errors.confirmPassword && (
                    <span className="rg-field-error">{errors.confirmPassword}</span>
                  )}
                </div>

                {/* Terms */}
                <label className="rg-terms">
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={(e) => setAgreed(e.target.checked)}
                  />
                  I agree to the{' '}
                  <a href="#" onClick={(e) => e.preventDefault()}>Terms of Service</a>
                  {' '}&amp;{' '}
                  <a href="#" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
                </label>

                <button
                  type="submit"
                  className="rg-btn-register"
                  disabled={loading || googleLoading}
                >
                  {loading ? 'Creating account...' : 'Create Account →'}
                </button>
              </form>

              <p className="rg-login-link">
                Already have an account?{' '}
                <Link to="/login" className="rg-login-anchor">Sign in →</Link>
              </p>
            </div>

          </div>
        </section>

        <footer className="rg-footer">
          <div className="rg-footer-inner">
            <p className="rg-footer-copy">© 2026 DonateDish. All rights reserved.</p>
          </div>
        </footer>

      </div>
    </>
  )
}
