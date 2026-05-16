import { useState } from "react";

const foodCategories = [
  "Cooked Meals", "Raw Vegetables", "Fruits", "Dairy Products",
  "Baked Goods", "Canned/Packaged Food", "Beverages", "Other"
];

const quantityUnits = ["kg", "liters", "packets", "boxes", "servings", "items"];

export default function DonorForm() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [logoUrl, setLogoUrl] = useState(null);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setLogoUrl(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const [form, setForm] = useState({
    address: "",
    foodCategory: "", foodDescription: "", quantity: "", unit: "kg",
    expiryDate: "", pickupDate: "", pickupTime: "", specialNotes: "",
    anonymous: false, agreeTerms: false,
  });
  const [errors, setErrors] = useState({});

  const update = (field, value) => {
    setForm(f => ({ ...f, [field]: value }));
    if (errors[field]) setErrors(e => ({ ...e, [field]: "" }));
  };

  const validateStep = (s) => {
    const e = {};
    if (s === 1) {
      if (!form.address.trim()) e.address = "Address is required";
      if (!form.foodCategory) e.foodCategory = "Select a category";
      if (!form.foodDescription.trim()) e.foodDescription = "Describe the food";
      if (!form.quantity || isNaN(form.quantity) || Number(form.quantity) <= 0) e.quantity = "Enter valid quantity";
      if (!form.expiryDate) e.expiryDate = "Expiry date required";
    }
    if (s === 2) {
      if (!form.pickupDate) e.pickupDate = "Pickup date required";
      if (!form.pickupTime) e.pickupTime = "Pickup time required";
      if (!form.agreeTerms) e.agreeTerms = "Please agree to continue";
    }
    return e;
  };

  const next = () => {
    const e = validateStep(step);
    if (Object.keys(e).length) { setErrors(e); return; }
    setStep(s => s + 1);
  };

  const back = () => setStep(s => s - 1);

  const submit = () => {
    const e = validateStep(2);
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitted(true);
  };

  const today = new Date().toISOString().split("T")[0];
  const steps = ["Food Details", "Pickup & Submit"];

  if (submitted) return (
    <div style={styles.page}>
      <div style={styles.successCard}>
        <div style={styles.successIcon}>🌱</div>
        <h2 style={styles.successTitle}>Thank You!</h2>
        <p style={styles.successText}>
          Your donation of <strong>{form.quantity} {form.unit}</strong> of <strong>{form.foodCategory}</strong> has been registered.
          We'll confirm your pickup on <strong>{form.pickupDate}</strong> at <strong>{form.pickupTime}</strong>.
        </p>
        <p style={styles.successSub}>Together, we fight hunger one meal at a time. 🍱</p>
        <button style={styles.resetBtn} onClick={() => {
          setSubmitted(false); setStep(1);
          setForm({ address:"",foodCategory:"",foodDescription:"",quantity:"",unit:"kg",expiryDate:"",pickupDate:"",pickupTime:"",specialNotes:"",anonymous:false,agreeTerms:false });
        }}>
          Donate Again
        </button>
      </div>
    </div>
  );

  return (
    <div style={styles.page}>
      {/* Header */}
      <div style={styles.header}>
        <div style={styles.navbar}>
          <label style={styles.logoUploadWrap} title="Click to upload your logo">
            {logoUrl
              ? <img src={logoUrl} alt="Logo" style={styles.logoImg} />
              : <span style={styles.logoPlaceholderIcon}>🍽️</span>
            }
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleLogoUpload} />
          </label>
          <div style={styles.brandBlock}>
            <span style={styles.logo}>
              <span style={{ color: "#fff", fontWeight: 400 }}>Donate</span>
              <span style={{ color: "#f97316" }}>Dish</span>
            </span>
            <span style={styles.tagline}>FEED THE NEED</span>
          </div>
        </div>
      </div>

      {/* Progress — 2 steps */}
      <div style={styles.progressWrap}>
        {steps.map((label, i) => (
          <div key={i} style={styles.stepItem}>
            <div style={{ ...styles.stepCircle, background: step > i + 1 ? "#22c55e" : step === i + 1 ? "#f97316" : "#e2e8f0", color: step >= i + 1 ? "#fff" : "#94a3b8" }}>
              {step > i + 1 ? "✓" : i + 1}
            </div>
            <span style={{ ...styles.stepLabel, color: step === i + 1 ? "#f97316" : "#94a3b8", fontWeight: step === i + 1 ? 700 : 400 }}>{label}</span>
            {i < 1 && <div style={{ ...styles.stepLine, background: step > i + 1 ? "#22c55e" : "#e2e8f0" }} />}
          </div>
        ))}
      </div>

      {/* Card */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>{steps[step - 1]}</h2>

        {/* Step 1 — Food Details + Address */}
        {step === 1 && (
          <div style={styles.fields}>
            <label style={styles.label}>Pickup Address *</label>
            <textarea style={{ ...styles.input, ...styles.textarea, ...(errors.address ? styles.inputErr : {}) }} placeholder="Full address for food pickup" value={form.address} onChange={e => update("address", e.target.value)} />
            {errors.address && <span style={styles.err}>{errors.address}</span>}

            <label style={styles.label}>Food Category *</label>
            <select style={{ ...styles.input, ...(errors.foodCategory ? styles.inputErr : {}) }} value={form.foodCategory} onChange={e => update("foodCategory", e.target.value)}>
              <option value="">-- Select category --</option>
              {foodCategories.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
            {errors.foodCategory && <span style={styles.err}>{errors.foodCategory}</span>}

            <label style={styles.label}>Food Description *</label>
            <textarea style={{ ...styles.input, ...styles.textarea, ...(errors.foodDescription ? styles.inputErr : {}) }} placeholder="Describe what you're donating (e.g. freshly cooked biryani, sealed biscuit packets...)" value={form.foodDescription} onChange={e => update("foodDescription", e.target.value)} />
            {errors.foodDescription && <span style={styles.err}>{errors.foodDescription}</span>}

            <label style={styles.label}>Quantity *</label>
            <div style={styles.row}>
              <input style={{ ...styles.input, flex: 1, ...(errors.quantity ? styles.inputErr : {}) }} type="number" min="1" placeholder="Amount" value={form.quantity} onChange={e => update("quantity", e.target.value)} />
              <select style={{ ...styles.input, width: 110 }} value={form.unit} onChange={e => update("unit", e.target.value)}>
                {quantityUnits.map(u => <option key={u} value={u}>{u}</option>)}
              </select>
            </div>
            {errors.quantity && <span style={styles.err}>{errors.quantity}</span>}

            <label style={styles.label}>Expiry / Best Before Date *</label>
            <input style={{ ...styles.input, ...(errors.expiryDate ? styles.inputErr : {}) }} type="date" min={today} value={form.expiryDate} onChange={e => update("expiryDate", e.target.value)} />
            {errors.expiryDate && <span style={styles.err}>{errors.expiryDate}</span>}

            <label style={styles.checkRow}>
              <input type="checkbox" checked={form.anonymous} onChange={e => update("anonymous", e.target.checked)} style={styles.checkbox} />
              <span style={styles.checkLabel}>Donate anonymously</span>
            </label>
          </div>
        )}

        {/* Step 2 — Pickup & Submit */}
        {step === 2 && (
          <div style={styles.fields}>
            <label style={styles.label}>Preferred Pickup Date *</label>
            <input style={{ ...styles.input, ...(errors.pickupDate ? styles.inputErr : {}) }} type="date" min={today} value={form.pickupDate} onChange={e => update("pickupDate", e.target.value)} />
            {errors.pickupDate && <span style={styles.err}>{errors.pickupDate}</span>}

            <label style={styles.label}>Preferred Pickup Time *</label>
            <input style={{ ...styles.input, ...(errors.pickupTime ? styles.inputErr : {}) }} type="time" value={form.pickupTime} onChange={e => update("pickupTime", e.target.value)} />
            {errors.pickupTime && <span style={styles.err}>{errors.pickupTime}</span>}

            <label style={styles.label}>Special Notes <span style={{ color: "#94a3b8", fontWeight: 400 }}>(optional)</span></label>
            <textarea style={{ ...styles.input, ...styles.textarea }} placeholder="Any handling instructions, allergies, packaging info..." value={form.specialNotes} onChange={e => update("specialNotes", e.target.value)} />

            {/* Summary */}
            <div style={styles.summary}>
              <p style={styles.summaryTitle}>📋 Donation Summary</p>
              <div style={styles.summaryRow}><span>Donor</span><span>{form.anonymous ? "Anonymous" : "You"}</span></div>
              <div style={styles.summaryRow}><span>Address</span><span style={{ maxWidth: 200, textAlign: "right" }}>{form.address}</span></div>
              <div style={styles.summaryRow}><span>Food</span><span>{form.foodCategory}</span></div>
              <div style={styles.summaryRow}><span>Quantity</span><span>{form.quantity} {form.unit}</span></div>
              <div style={styles.summaryRow}><span>Expires</span><span>{form.expiryDate}</span></div>
              {form.pickupDate && <div style={styles.summaryRow}><span>Pickup</span><span>{form.pickupDate} at {form.pickupTime}</span></div>}
            </div>

            <label style={styles.checkRow}>
              <input type="checkbox" checked={form.agreeTerms} onChange={e => update("agreeTerms", e.target.checked)} style={styles.checkbox} />
              <span style={styles.checkLabel}>I confirm the food is safe for consumption and agree to the donation terms.</span>
            </label>
            {errors.agreeTerms && <span style={styles.err}>{errors.agreeTerms}</span>}
          </div>
        )}

        {/* Buttons */}
        <div style={styles.btnRow}>
          {step > 1 && <button style={styles.backBtn} onClick={back}>← Back</button>}
          {step < 2
            ? <button style={styles.nextBtn} onClick={next}>Next →</button>
            : <button style={styles.submitBtn} onClick={submit}>Submit Donation 🍱</button>
          }
        </div>
      </div>
    </div>
  );
}

const styles = {
  page: { minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", display: "flex", flexDirection: "column", alignItems: "center", padding: "32px 16px", fontFamily: "'Georgia', serif" },
  header: { width: "100%", maxWidth: 700, marginBottom: 28 },
  navbar: { background: "transparent", borderRadius: 14, padding: "14px 24px", display: "flex", alignItems: "center", gap: 16 },
  logoUploadWrap: { width: 52, height: 52, borderRadius: "50%", background: "linear-gradient(135deg, #f97316, #ea580c)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden", flexShrink: 0, boxShadow: "0 2px 12px rgba(249,115,22,0.4)", border: "2px solid rgba(255,255,255,0.15)" },
  logoImg: { width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" },
  logoPlaceholderIcon: { fontSize: 26, filter: "brightness(10)" },
  brandBlock: { display: "flex", flexDirection: "column", gap: 1 },
  logo: { fontSize: 22, fontWeight: 800, letterSpacing: -0.5, lineHeight: 1.1 },
  tagline: { color: "#ea580c", fontSize: 10, fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase" },
  progressWrap: { display: "flex", alignItems: "center", gap: 0, marginBottom: 28 },
  stepItem: { display: "flex", alignItems: "center", gap: 6 },
  stepCircle: { width: 32, height: 32, borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 13, transition: "all 0.3s" },
  stepLabel: { fontSize: 12, transition: "all 0.3s", whiteSpace: "nowrap" },
  stepLine: { width: 40, height: 2, margin: "0 6px", transition: "all 0.3s" },
  card: { background: "#1e293b", borderRadius: 20, padding: "32px 28px", width: "100%", maxWidth: 520, boxShadow: "0 8px 40px rgba(0,0,0,0.40)", border: "1px solid #334155" },
  cardTitle: { fontSize: 22, fontWeight: 800, color: "#f1f5f9", marginBottom: 24, marginTop: 0 },
  fields: { display: "flex", flexDirection: "column", gap: 4 },
  label: { fontSize: 13, fontWeight: 700, color: "#cbd5e1", marginTop: 12, marginBottom: 4, letterSpacing: 0.3 },
  input: { width: "100%", padding: "11px 14px", border: "1.5px solid #334155", borderRadius: 10, fontSize: 14, color: "#f1f5f9", background: "#0f172a", outline: "none", boxSizing: "border-box", fontFamily: "inherit", transition: "border 0.2s" },
  inputErr: { borderColor: "#f87171" },
  textarea: { resize: "vertical", minHeight: 80 },
  row: { display: "flex", gap: 10 },
  err: { fontSize: 12, color: "#ef4444", marginTop: 2 },
  checkRow: { display: "flex", alignItems: "flex-start", gap: 10, marginTop: 14, cursor: "pointer" },
  checkbox: { marginTop: 2, accentColor: "#f97316", width: 16, height: 16 },
  checkLabel: { fontSize: 13, color: "#94a3b8", lineHeight: 1.5 },
  summary: { background: "#0f172a", border: "1.5px solid #334155", borderRadius: 12, padding: "16px 18px", marginTop: 12 },
  summaryTitle: { fontWeight: 700, color: "#f97316", margin: "0 0 10px", fontSize: 14 },
  summaryRow: { display: "flex", justifyContent: "space-between", fontSize: 13, color: "#cbd5e1", padding: "4px 0", borderBottom: "1px solid #1e293b" },
  btnRow: { display: "flex", justifyContent: "space-between", marginTop: 28, gap: 12 },
  backBtn: { padding: "11px 22px", borderRadius: 10, border: "1.5px solid #334155", background: "#0f172a", color: "#94a3b8", fontWeight: 600, fontSize: 14, cursor: "pointer" },
  nextBtn: { marginLeft: "auto", padding: "11px 28px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #f97316, #ea580c)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 15px rgba(249,115,22,0.3)" },
  submitBtn: { marginLeft: "auto", padding: "11px 24px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 15px rgba(34,197,94,0.3)" },
  successCard: { background: "#1e293b", borderRadius: 20, padding: "48px 36px", maxWidth: 480, width: "100%", textAlign: "center", boxShadow: "0 8px 40px rgba(0,0,0,0.40)", border: "1px solid #334155" },
  successIcon: { fontSize: 56, marginBottom: 16 },
  successTitle: { fontSize: 26, fontWeight: 800, color: "#22c55e", margin: "0 0 12px" },
  successText: { fontSize: 15, color: "#cbd5e1", lineHeight: 1.6, margin: "0 0 10px" },
  successSub: { fontSize: 14, color: "#64748b", fontStyle: "italic", marginBottom: 28 },
  resetBtn: { padding: "12px 28px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #f97316, #ea580c)", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer" },
};