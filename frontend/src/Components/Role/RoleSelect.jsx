import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useSelector } from 'react-redux'

import Service from '../../utils/http'

const service = new Service()

const css = `
  * { box-sizing: border-box; margin: 0; padding: 0; }

  .rs-page {
    min-height: 100vh;
    font-family: 'Segoe UI', sans-serif;
    background: linear-gradient(145deg, #0f0f1a 0%, #16213e 60%, #1e2a45 100%);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 2rem;
    position: relative;
    overflow: hidden;
  }

  .rs-bg {
    position: absolute;
    inset: 0;
    background:
      radial-gradient(ellipse at 15% 50%, rgba(249,115,22,0.1) 0%, transparent 55%),
      radial-gradient(ellipse at 85% 20%, rgba(99,102,241,0.08) 0%, transparent 50%),
      radial-gradient(ellipse at 50% 90%, rgba(249,115,22,0.06) 0%, transparent 50%);
    pointer-events: none;
    z-index: 0;
  }

  .rs-hero-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    opacity: 0.08;
    pointer-events: none;
    z-index: 0;
  }

  .rs-content {
    position: relative;
    z-index: 10;
    width: 100%;
    max-width: 700px;
    text-align: center;
  }

  .rs-badge {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background: rgba(249,115,22,0.15);
    border: 1px solid rgba(249,115,22,0.35);
    border-radius: 20px;
    padding: 5px 18px;
    font-size: 11px;
    color: #fdba74;
    font-weight: 600;
    letter-spacing: 1.5px;
    margin-bottom: 1.5rem;
  }

  .rs-title {
    font-size: clamp(28px, 5vw, 46px);
    font-weight: 800;
    color: white;
    line-height: 1.2;
    margin-bottom: 0.75rem;
  }

  .rs-title span { color: #f97316; }

  .rs-subtitle {
    font-size: 15px;
    color: rgba(255,255,255,0.55);
    line-height: 1.7;
    margin-bottom: 3rem;
    max-width: 480px;
    margin-left: auto;
    margin-right: auto;
  }

  /* ── CARDS ── */
  .rs-cards {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1.25rem;
    margin-bottom: 2rem;
  }

  .rs-card {
    background: rgba(255,255,255,0.04);
    border: 2px solid rgba(255,255,255,0.1);
    border-radius: 20px;
    padding: 2.25rem 1.75rem;
    cursor: pointer;
    transition: all 0.25s ease;
    text-align: left;
    position: relative;
    overflow: hidden;
  }

  .rs-card::before {
    content: '';
    position: absolute;
    inset: 0;
    border-radius: 18px;
    opacity: 0;
    transition: opacity 0.25s;
  }

  .rs-card.donor::before {
    background: radial-gradient(ellipse at top left, rgba(249,115,22,0.12), transparent 70%);
  }

  .rs-card.receiver::before {
    background: radial-gradient(ellipse at top left, rgba(99,102,241,0.12), transparent 70%);
  }

  .rs-card:hover {
    border-color: rgba(255,255,255,0.25);
    background: rgba(255,255,255,0.07);
    transform: translateY(-3px);
  }

  .rs-card:hover::before { opacity: 1; }

  .rs-card.selected.donor {
    border-color: #f97316;
    background: rgba(249,115,22,0.1);
    transform: translateY(-3px);
    box-shadow: 0 0 0 4px rgba(249,115,22,0.15), 0 20px 40px rgba(249,115,22,0.2);
  }

  .rs-card.selected.receiver {
    border-color: #818cf8;
    background: rgba(99,102,241,0.1);
    transform: translateY(-3px);
    box-shadow: 0 0 0 4px rgba(99,102,241,0.15), 0 20px 40px rgba(99,102,241,0.2);
  }

  .rs-card-check {
    position: absolute;
    top: 1rem;
    right: 1rem;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    border: 2px solid rgba(255,255,255,0.2);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 12px;
    transition: all 0.2s;
  }

  .rs-card.selected.donor .rs-card-check {
    background: #f97316;
    border-color: #f97316;
  }

  .rs-card.selected.receiver .rs-card-check {
    background: #818cf8;
    border-color: #818cf8;
  }

  .rs-card-icon {
    font-size: 48px;
    margin-bottom: 1.25rem;
    display: block;
    line-height: 1;
  }

  .rs-card-title {
    font-size: 20px;
    font-weight: 800;
    color: white;
    margin-bottom: 0.5rem;
  }

  .rs-card-desc {
    font-size: 13px;
    color: rgba(255,255,255,0.5);
    line-height: 1.65;
    margin-bottom: 1.25rem;
  }

  .rs-card-perks {
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .rs-card-perk {
    display: flex;
    align-items: center;
    gap: 8px;
    font-size: 12px;
    color: rgba(255,255,255,0.6);
  }

  .rs-perk-dot {
    width: 6px;
    height: 6px;
    border-radius: 50%;
    flex-shrink: 0;
  }

  .donor .rs-perk-dot  { background: #f97316; }
  .receiver .rs-perk-dot { background: #818cf8; }

  /* ── CONFIRM BUTTON ── */
  .rs-btn {
    width: 100%;
    max-width: 320px;
    padding: 14px;
    border: none;
    border-radius: 28px;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    font-family: inherit;
    transition: opacity 0.2s, transform 0.15s;
    margin: 0 auto;
    display: block;
  }

  .rs-btn-inactive {
    background: rgba(255,255,255,0.08);
    color: rgba(255,255,255,0.3);
    cursor: not-allowed;
    border: 1px solid rgba(255,255,255,0.1);
  }

  .rs-btn-donor {
    background: linear-gradient(135deg, #f97316, #ea580c);
    color: white;
    box-shadow: 0 6px 20px rgba(249,115,22,0.45);
  }

  .rs-btn-donor:hover { opacity: 0.92; transform: translateY(-2px); }

  .rs-btn-receiver {
    background: linear-gradient(135deg, #818cf8, #6366f1);
    color: white;
    box-shadow: 0 6px 20px rgba(99,102,241,0.45);
  }

  .rs-btn-receiver:hover { opacity: 0.92; transform: translateY(-2px); }

  .rs-btn:disabled { opacity: 0.6 !important; cursor: not-allowed !important; transform: none !important; }

  .rs-skip {
    margin-top: 1.25rem;
    font-size: 13px;
    color: rgba(255,255,255,0.3);
    cursor: pointer;
    transition: color 0.2s;
    background: none;
    border: none;
    font-family: inherit;
  }

  .rs-skip:hover { color: rgba(255,255,255,0.6); }

  .rs-error {
    background: rgba(220,38,38,0.15);
    border: 1px solid rgba(220,38,38,0.3);
    border-radius: 10px;
    padding: 10px 14px;
    font-size: 13px;
    color: #fca5a5;
    margin-bottom: 1.25rem;
    text-align: center;
  }

  .rs-user-greeting {
    font-size: 14px;
    color: rgba(255,255,255,0.4);
    margin-bottom: 0.5rem;
  }

  @media (max-width: 560px) {
    .rs-cards { grid-template-columns: 1fr; }
    .rs-card { padding: 1.75rem 1.25rem; }
  }
`

export default function RoleSelectPage() {
  const [selected, setSelected] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const dispatch = useDispatch()

  // Get user name from Redux store if available
  const user = useSelector((state) => state.auth?.user || state.user?.user || null)
  const firstName = user?.name?.split(' ')[0] || user?.firstName || ''

  const handleConfirm = async () => {
    if (!selected) return
    setError('')
    setLoading(true)
    try {
      const res = await service.put('users/profile', { role: selected })
      // Update Redux store with new role if you have an action
      // dispatch(updateUserRole(selected))
      if (selected === 'donor') {
        navigate('/donor-form')
      } else {
        navigate('/receiver-form')
      }
    } catch (err) {
      setError(
        err?.response?.data?.message ||
        'Failed to save your choice. Please try again.'
      )
    } finally {
      setLoading(false)
    }
  }

  const btnClass = () => {
    if (!selected) return 'rs-btn rs-btn-inactive'
    if (selected === 'donor') return 'rs-btn rs-btn-donor'
    return 'rs-btn rs-btn-receiver'
  }

  const btnLabel = () => {
    if (loading) return 'Saving...'
    if (!selected) return 'Select an option above'
    if (selected === 'donor') return 'Continue as Donor →'
    return 'Continue as Receiver →'
  }

  return (
    <>
      <style>{css}</style>
      <div className="rs-page">
        <div className="rs-bg" />
        <img
          className="rs-hero-img"
          src="https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1400&q=80"
          alt=""
          aria-hidden="true"
        />

        <div className="rs-content">
          <div className="rs-badge">🍽️ WELCOME TO DONATEDISH</div>

          {firstName && (
            <p className="rs-user-greeting">Hey {firstName}, one quick question —</p>
          )}

          <h1 className="rs-title">
            How would you like<br />to <span>get started?</span>
          </h1>
          <p className="rs-subtitle">
            Choose your role — you can always change this later from your profile settings.
          </p>

          {error && <div className="rs-error">⚠️ {error}</div>}

          {/* Role Cards */}
          <div className="rs-cards">

            {/* DONOR */}
            <div
              className={`rs-card donor ${selected === 'donor' ? 'selected' : ''}`}
              onClick={() => { setSelected('donor'); setError('') }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setSelected('donor')}
              aria-pressed={selected === 'donor'}
            >
              <div className="rs-card-check">
                {selected === 'donor' && '✓'}
              </div>
              <span className="rs-card-icon">🍱</span>
              <h2 className="rs-card-title">I want to Donate</h2>
              <p className="rs-card-desc">
                Share surplus food from your home, restaurant, or event and help
                families in need — it takes just 2 minutes.
              </p>
              <div className="rs-card-perks">
                {[
                  'List food in under 2 minutes',
                  'Volunteers handle pickup',
                  'Track your impact live',
                  'Free for individuals & businesses',
                ].map((p) => (
                  <div className="rs-card-perk" key={p}>
                    <div className="rs-perk-dot" />
                    {p}
                  </div>
                ))}
              </div>
            </div>

            {/* RECEIVER */}
            <div
              className={`rs-card receiver ${selected === 'receiver' ? 'selected' : ''}`}
              onClick={() => { setSelected('receiver'); setError('') }}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => e.key === 'Enter' && setSelected('receiver')}
              aria-pressed={selected === 'receiver'}
            >
              <div className="rs-card-check">
                {selected === 'receiver' && '✓'}
              </div>
              <span className="rs-card-icon">🤲</span>
              <h2 className="rs-card-title">I want to Receive</h2>
              <p className="rs-card-desc">
                Request food for yourself, your family, or your community.
                We connect you with nearby donors quickly and discreetly.
              </p>
              <div className="rs-card-perks">
                {[
                  'Request food near you',
                  'Fast, discreet delivery',
                  'No questions asked',
                  'Always free of charge',
                ].map((p) => (
                  <div className="rs-card-perk" key={p}>
                    <div className="rs-perk-dot" />
                    {p}
                  </div>
                ))}
              </div>
            </div>

          </div>

          {/* Confirm Button */}
          <button
            className={btnClass()}
            onClick={handleConfirm}
            disabled={!selected || loading}
          >
            {btnLabel()}
          </button>

          <button
            className="rs-skip"
            onClick={() => navigate('/')}
          >
            Skip for now, I'll decide later
          </button>
        </div>
      </div>
    </>
  )
}
