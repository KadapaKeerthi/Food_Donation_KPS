export default function Home() {
  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #0f0f1a, #16213e)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column',
      gap: '1rem',
      padding: '2rem'
    }}>
      <div style={{
        background: 'rgba(249,115,22,0.15)',
        border: '1px solid rgba(249,115,22,0.3)',
        borderRadius: '20px',
        padding: '5px 16px',
        fontSize: '12px',
        color: '#fdba74',
        fontWeight: 600,
        letterSpacing: '1px',
        marginBottom: '0.5rem'
      }}>
        🍽️ SHARE TODAY · NOURISH TOMORROW
      </div>

      <h1 style={{
        fontFamily: 'Georgia, serif',
        fontSize: 'clamp(32px, 5vw, 56px)',
        color: 'white',
        textAlign: 'center',
        lineHeight: 1.2,
        maxWidth: 600
      }}>
        Every meal shared is a <span style={{ color: '#f97316' }}>life changed</span>
      </h1>

      <p style={{
        fontSize: 16,
        color: 'rgba(255,255,255,0.55)',
        textAlign: 'center',
        maxWidth: 480,
        lineHeight: 1.7
      }}>
        Join thousands of donors reducing food waste and
        feeding those in need across your community.
      </p>

      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginTop: '0.5rem' }}>
        <button style={{
          padding: '12px 28px',
          background: '#f97316',
          border: 'none',
          borderRadius: 28,
          color: 'white',
          fontSize: 15,
          fontWeight: 700,
          cursor: 'pointer',
          boxShadow: '0 4px 20px rgba(249,115,22,0.4)'
        }}>
          Start Donating →
        </button>
        <button style={{
          padding: '12px 28px',
          background: 'transparent',
          border: '1.5px solid rgba(255,255,255,0.3)',
          borderRadius: 28,
          color: 'white',
          fontSize: 15,
          cursor: 'pointer'
        }}>
          Learn More
        </button>
      </div>

      <div style={{
        display: 'flex',
        gap: '3rem',
        marginTop: '2.5rem',
        flexWrap: 'wrap',
        justifyContent: 'center'
      }}>
        {[
          { num: '12,400+', label: 'Meals Donated' },
          { num: '3,200+', label: 'Families Helped' },
          { num: '98', label: 'Cities' },
        ].map(s => (
          <div key={s.label} style={{ textAlign: 'center' }}>
            <p style={{ fontSize: 26, fontWeight: 800, color: '#f97316', margin: 0 }}>{s.num}</p>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', margin: '4px 0 0' }}>{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  )
}