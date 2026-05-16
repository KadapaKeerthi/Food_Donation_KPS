import { useState } from "react";

const roleOptions = [
  { icon: "🚗", label: "Food Pickup & Delivery", desc: "Collect from donors, deliver to receivers" },
  { icon: "📦", label: "Sorting & Packaging", desc: "Organise and pack food at collection centres" },
];

export default function VolunteerForm() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [logoUrl, setLogoUrl] = useState(null);
  const [form, setForm] = useState({
    city: "",
    roles: [], availability: "", hasVehicle: null,
    experience: "", motivation: "",
    agreeTerms: false,
  });
  const [errors, setErrors] = useState({});

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setLogoUrl(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const update = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: "" }));
  };

  const toggle = (field, item) => {
    setForm(f => ({
      ...f,
      [field]: f[field].includes(item) ? f[field].filter(x => x !== item) : [...f[field], item]
    }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: "" }));
  };

  const validateStep = (s) => {
    const e = {};
    if (s === 1) {
      if (!form.city.trim()) e.city = "City is required";
      if (form.roles.length === 0) e.roles = "Select at least one role";
    }
    if (s === 2) {
      if (!form.availability) e.availability = "Please select a date";
      if (form.hasVehicle === null) e.hasVehicle = "Please select an option";
      if (!form.agreeTerms) e.agreeTerms = "Please agree to continue";
    }
    return e;
  };

  const next = () => {
    const e = validateStep(1);
    if (Object.keys(e).length) { setErrors(e); return; }
    setStep(2);
  };

  const submit = () => {
    const e = validateStep(2);
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitted(true);
  };

  const reset = () => {
    setSubmitted(false); setStep(1);
    setForm({ city: "", roles: [], availability: "", hasVehicle: null, experience: "", motivation: "", agreeTerms: false });
    setErrors({});
  };

  // ── Success Screen ─────────────────────────────────────
  if (submitted) return (
    <div style={s.page}>
      <Navbar logoUrl={logoUrl} onLogoUpload={handleLogoUpload} />
      <div style={s.successWrap}>
        <div style={s.successGlow} />
        <div style={s.successCard}>
          <div style={s.successIconWrap}>
            <span style={s.successIcon}>🌟</span>
          </div>
          <h2 style={s.successTitle}>Welcome Aboard!</h2>
          <p style={s.successText}>
            You've joined the <span style={{ color: "#f97316" }}>DonateDish</span> volunteer family.
            Our team will reach out to you soon to get you started.
          </p>
          <div style={s.successTags}>
            {form.roles.map(r => (
              <span key={r} style={s.successTag}>{roleOptions.find(x => x.label === r)?.icon} {r}</span>
            ))}
          </div>
          <p style={s.successSub}>Every meal delivered is a life touched. Thank you. 🍱</p>
          <button style={s.resetBtn} onClick={reset}>Register Another Volunteer</button>
        </div>
      </div>
    </div>
  );

  return (
    <div style={s.page}>
      <Navbar logoUrl={logoUrl} onLogoUpload={handleLogoUpload} />

      {/* Hero strip */}
      <div style={s.hero}>
        <div style={s.heroAccent} />
        <h1 style={s.heroTitle}>Become a Volunteer</h1>
        <p style={s.heroSub}>Join hands with us to fight hunger — one delivery at a time.</p>
      </div>

      {/* Progress */}
      <div style={s.progressWrap}>
        {["Your Info & Roles", "Availability & Submit"].map((label, i) => (
          <div key={i} style={s.stepRow}>
            <div style={{ ...s.stepCircle, background: step > i + 1 ? "#22c55e" : step === i + 1 ? "#f97316" : "#1e293b", border: step === i + 1 ? "2px solid #f97316" : step > i + 1 ? "2px solid #22c55e" : "2px solid #334155", color: step >= i + 1 ? "#fff" : "#475569" }}>
              {step > i + 1 ? "✓" : i + 1}
            </div>
            <span style={{ ...s.stepLabel, color: step === i + 1 ? "#f97316" : step > i + 1 ? "#22c55e" : "#475569", fontWeight: step === i + 1 ? 700 : 400 }}>{label}</span>
            {i < 1 && <div style={{ ...s.stepLine, background: step > 1 ? "#22c55e" : "#334155" }} />}
          </div>
        ))}
      </div>

      {/* Card */}
      <div style={s.card}>

        {/* ── STEP 1 ── */}
        {step === 1 && (
          <div style={s.fields}>
            <SectionHead icon="👤" title="Personal Details" />

            <Field label="City / Area *" error={errors.city}>
              <input style={{ ...s.input, ...(errors.city ? s.inputErr : {}) }} placeholder="e.g. Hyderabad, Banjara Hills" value={form.city} onChange={e => update("city", e.target.value)} />
            </Field>

            <SectionHead icon="🎯" title="Volunteer Roles" />
            <p style={s.hint}>Pick the roles you'd like to take on — you can choose multiple.</p>

            {errors.roles && <span style={s.err}>{errors.roles}</span>}
            <div style={s.roleGrid}>
              {roleOptions.map(({ icon, label, desc }) => {
                const active = form.roles.includes(label);
                return (
                  <button key={label} type="button" onClick={() => toggle("roles", label)}
                    style={{ ...s.roleCard, background: active ? "#f9731610" : "#0f172a", border: active ? "1.5px solid #f97316" : "1.5px solid #334155" }}>
                    <span style={s.roleIcon}>{icon}</span>
                    <span style={{ ...s.roleLabel, color: active ? "#f97316" : "#cbd5e1" }}>{label}</span>
                    <span style={s.roleDesc}>{desc}</span>
                    {active && <span style={s.roleTick}>✓</span>}
                  </button>
                );
              })}
            </div>

            <div style={s.btnRow}>
              <button style={s.nextBtn} onClick={next}>Next →</button>
            </div>
          </div>
        )}

        {/* ── STEP 2 ── */}
        {step === 2 && (
          <div style={s.fields}>
            <SectionHead icon="🗓️" title="Availability" />
            <Field label="Available Date *" error={errors.availability}>
              <input
                style={{ ...s.input, ...(errors.availability ? s.inputErr : {}) }}
                type="date"
                min={new Date().toISOString().split("T")[0]}
                value={form.availability}
                onChange={e => update("availability", e.target.value)}
              />
            </Field>

            <SectionHead icon="🚗" title="Do you have a vehicle?" />
            {errors.hasVehicle && <span style={s.err}>{errors.hasVehicle}</span>}
            <div style={s.yesNoWrap}>
              {[["yes", "Yes, I do 🚗"], ["no", "No, I don't"]].map(([val, label]) => (
                <button key={val} type="button" onClick={() => update("hasVehicle", val)}
                  style={{ ...s.yesNoBtn, background: form.hasVehicle === val ? "#f9731615" : "#0f172a", border: form.hasVehicle === val ? "1.5px solid #f97316" : "1.5px solid #334155", color: form.hasVehicle === val ? "#f97316" : "#475569" }}>
                  {label}
                </button>
              ))}
            </div>

            <SectionHead icon="💬" title="A bit about you" />

            <Field label="Previous experience (optional)">
              <textarea style={{ ...s.input, ...s.textarea }} placeholder="Have you volunteered before? Any relevant skills?" value={form.experience} onChange={e => update("experience", e.target.value)} />
            </Field>

            <Field label="Why do you want to volunteer? (optional)">
              <textarea style={{ ...s.input, ...s.textarea }} placeholder="Share your motivation — even a sentence helps!" value={form.motivation} onChange={e => update("motivation", e.target.value)} />
            </Field>

            {/* Summary */}
            <div style={s.summary}>
              <p style={s.summaryTitle}>📋 Registration Summary</p>
              <SummaryRow label="City" value={form.city} />
              <SummaryRow label="Roles" value={form.roles.join(", ")} />
              <SummaryRow label="Availability" value={form.availability} />
              <SummaryRow label="Has Vehicle" value={form.hasVehicle === "yes" ? "Yes" : form.hasVehicle === "no" ? "No" : "—"} />
            </div>

            <label style={s.checkRow}>
              <input type="checkbox" checked={form.agreeTerms} onChange={e => update("agreeTerms", e.target.checked)} style={s.checkbox} />
              <span style={s.checkLabel}>I agree to volunteer in good faith and follow DonateDish's code of conduct.</span>
            </label>
            {errors.agreeTerms && <span style={s.err}>{errors.agreeTerms}</span>}

            <div style={s.btnRow}>
              <button style={s.backBtn} onClick={() => setStep(1)}>← Back</button>
              <button style={s.submitBtn} onClick={submit}>Register as Volunteer 🌟</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// ── Sub-components ─────────────────────────────────────────
function Navbar({ logoUrl, onLogoUpload }) {
  return (
    <div style={s.navbar}>
      <div style={s.navLeft}>
        <label style={s.logoWrap} title="Upload logo">
          {logoUrl ? <img src={logoUrl} alt="logo" style={s.logoImg} /> : <span style={{ fontSize: 22, filter: "brightness(10)" }}>🍽️</span>}
          <input type="file" accept="image/*" style={{ display: "none" }} onChange={onLogoUpload} />
        </label>
        <div>
          <div style={s.brandName}><span style={{ color: "#fff", fontWeight: 400 }}>Donate</span><span style={{ color: "#f97316" }}>Dish</span></div>
          <div style={s.brandSub}>FEED THE NEED</div>
        </div>
      </div>
      <div style={s.volBadge}>🌟 Volunteer Portal</div>
    </div>
  );
}

function SectionHead({ icon, title }) {
  return (
    <div style={s.sectionHead}>
      <span style={s.sectionIcon}>{icon}</span>
      <span style={s.sectionTitle}>{title}</span>
    </div>
  );
}

function Field({ label, error, children }) {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
      <label style={s.label}>{label}</label>
      {children}
      {error && <span style={s.err}>{error}</span>}
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div style={s.summaryRow}>
      <span>{label}</span>
      <span style={{ textAlign: "right", maxWidth: 220 }}>{value || "—"}</span>
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────
const s = {
  page: { minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", display: "flex", flexDirection: "column", alignItems: "center", fontFamily: "'Georgia', serif", color: "#f1f5f9", paddingBottom: 48 },

  // Navbar
  navbar: { width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 32px", borderBottom: "1px solid #1e293b", boxSizing: "border-box" },
  navLeft: { display: "flex", alignItems: "center", gap: 14 },
  logoWrap: { width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, #f97316, #ea580c)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden", flexShrink: 0, boxShadow: "0 2px 12px rgba(249,115,22,0.4)" },
  logoImg: { width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" },
  brandName: { fontSize: 20, fontWeight: 800, letterSpacing: -0.5 },
  brandSub: { fontSize: 9, color: "#ea580c", fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase" },
  volBadge: { background: "#f9731618", border: "1px solid #f97316", color: "#fb923c", fontSize: 12, fontWeight: 700, padding: "6px 16px", borderRadius: 20 },

  // Hero
  hero: { width: "100%", maxWidth: 580, textAlign: "center", padding: "40px 24px 24px", position: "relative" },
  heroAccent: { position: "absolute", top: 20, left: "50%", transform: "translateX(-50%)", width: 120, height: 3, background: "linear-gradient(90deg, transparent, #f97316, transparent)", borderRadius: 2 },
  heroTitle: { fontSize: 32, fontWeight: 900, margin: "12px 0 8px", letterSpacing: -1, background: "linear-gradient(135deg, #f97316, #fbbf24)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" },
  heroSub: { fontSize: 15, color: "#64748b", margin: 0, fontStyle: "italic" },

  // Progress
  progressWrap: { display: "flex", alignItems: "center", gap: 0, margin: "20px 0 28px" },
  stepRow: { display: "flex", alignItems: "center", gap: 8 },
  stepCircle: { width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, transition: "all 0.3s", flexShrink: 0 },
  stepLabel: { fontSize: 12, whiteSpace: "nowrap", transition: "all 0.3s" },
  stepLine: { width: 48, height: 2, margin: "0 8px", transition: "all 0.3s", borderRadius: 1 },

  // Card
  card: { background: "#1e293b", borderRadius: 20, padding: "32px 28px", width: "100%", maxWidth: 560, boxShadow: "0 8px 40px rgba(0,0,0,0.5)", border: "1px solid #334155", boxSizing: "border-box", margin: "0 16px" },
  fields: { display: "flex", flexDirection: "column", gap: 16 },

  // Section header
  sectionHead: { display: "flex", alignItems: "center", gap: 10, borderBottom: "1px solid #334155", paddingBottom: 10, marginTop: 4 },
  sectionIcon: { fontSize: 18 },
  sectionTitle: { fontSize: 15, fontWeight: 800, color: "#f1f5f9", letterSpacing: 0.3 },

  hint: { fontSize: 12, color: "#475569", margin: "-8px 0 0", fontStyle: "italic" },

  label: { fontSize: 13, fontWeight: 700, color: "#cbd5e1", letterSpacing: 0.3 },
  input: { width: "100%", padding: "11px 14px", border: "1.5px solid #334155", borderRadius: 10, fontSize: 14, color: "#f1f5f9", background: "#0f172a", outline: "none", boxSizing: "border-box", fontFamily: "inherit" },
  inputErr: { borderColor: "#f87171" },
  textarea: { resize: "vertical", minHeight: 80 },
  err: { fontSize: 12, color: "#ef4444" },

  // Role cards
  roleGrid: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 },
  roleCard: { padding: "14px 12px", borderRadius: 12, cursor: "pointer", textAlign: "left", position: "relative", transition: "all 0.2s", display: "flex", flexDirection: "column", gap: 3 },
  roleIcon: { fontSize: 20 },
  roleLabel: { fontSize: 13, fontWeight: 700, transition: "color 0.2s" },
  roleDesc: { fontSize: 11, color: "#475569", lineHeight: 1.4 },
  roleTick: { position: "absolute", top: 10, right: 12, color: "#f97316", fontWeight: 900, fontSize: 14 },

  // Chips
  chipWrap: { display: "flex", flexWrap: "wrap", gap: 8 },
  chip: { padding: "8px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" },

  // Yes/No
  yesNoWrap: { display: "flex", gap: 12 },
  yesNoBtn: { flex: 1, padding: "12px", borderRadius: 10, fontSize: 14, fontWeight: 700, cursor: "pointer", transition: "all 0.2s" },

  // Summary
  summary: { background: "#0f172a", border: "1.5px solid #334155", borderRadius: 12, padding: "16px 18px" },
  summaryTitle: { fontWeight: 700, color: "#f97316", margin: "0 0 10px", fontSize: 14 },
  summaryRow: { display: "flex", justifyContent: "space-between", fontSize: 13, color: "#cbd5e1", padding: "5px 0", borderBottom: "1px solid #1e293b", gap: 12 },

  // Checkbox
  checkRow: { display: "flex", alignItems: "flex-start", gap: 10, cursor: "pointer" },
  checkbox: { marginTop: 2, accentColor: "#f97316", width: 16, height: 16, flexShrink: 0 },
  checkLabel: { fontSize: 13, color: "#94a3b8", lineHeight: 1.5 },

  // Buttons
  btnRow: { display: "flex", justifyContent: "space-between", gap: 12, marginTop: 8 },
  backBtn: { padding: "11px 22px", borderRadius: 10, border: "1.5px solid #334155", background: "#0f172a", color: "#94a3b8", fontWeight: 600, fontSize: 14, cursor: "pointer" },
  nextBtn: { marginLeft: "auto", padding: "11px 28px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #f97316, #ea580c)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 15px rgba(249,115,22,0.3)" },
  submitBtn: { padding: "11px 24px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 15px rgba(34,197,94,0.3)" },

  // Success
  successWrap: { display: "flex", alignItems: "center", justifyContent: "center", flex: 1, padding: "40px 16px", position: "relative", width: "100%" },
  successGlow: { position: "absolute", width: 300, height: 300, borderRadius: "50%", background: "radial-gradient(circle, rgba(249,115,22,0.08) 0%, transparent 70%)", pointerEvents: "none" },
  successCard: { background: "#1e293b", borderRadius: 24, padding: "48px 36px", maxWidth: 480, width: "100%", textAlign: "center", boxShadow: "0 8px 40px rgba(0,0,0,0.5)", border: "1px solid #334155", position: "relative" },
  successIconWrap: { width: 72, height: 72, borderRadius: "50%", background: "linear-gradient(135deg, #f97316, #fbbf24)", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 20px", boxShadow: "0 4px 20px rgba(249,115,22,0.4)" },
  successIcon: { fontSize: 36 },
  successTitle: { fontSize: 28, fontWeight: 900, color: "#f1f5f9", margin: "0 0 4px" },
  successName: { fontSize: 18, color: "#f97316", fontWeight: 700, margin: "0 0 16px" },
  successText: { fontSize: 14, color: "#94a3b8", lineHeight: 1.7, margin: "0 0 20px" },
  successTags: { display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", margin: "0 0 20px" },
  successTag: { background: "#f9731618", border: "1px solid #f97316", color: "#fb923c", fontSize: 12, fontWeight: 600, padding: "4px 12px", borderRadius: 20 },
  successSub: { fontSize: 13, color: "#475569", fontStyle: "italic", marginBottom: 28 },
  resetBtn: { padding: "12px 28px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #f97316, #ea580c)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer" },
};