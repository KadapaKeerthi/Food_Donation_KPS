import { useState } from "react";



const foodNeeds = [
  "Cooked Meals", "Raw Vegetables", "Fruits", "Dairy Products",
  "Baked Goods", "Canned/Packaged Food", "Beverages", "Any / No Preference"
];

const receiverTypes = [
  "Individual / Family", "NGO / Charity", "Orphanage", "Old Age Home",
  "Shelter / Relief Camp", "School / Anganwadi", "Other"
];

export default function ReceiverForm() {
  const [step, setStep] = useState(1);
  const [submitted, setSubmitted] = useState(false);
  const [logoUrl, setLogoUrl] = useState(null);
  const [form, setForm] = useState({
    fullName: "", email: "", phone: "", address: "",
    receiverType: "", orgName: "",
    foodNeeds: [], numberOfPeople: "", urgency: "normal",
    deliveryDate: "", deliveryTime: "", deliveryNotes: "",
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

  const toggleFoodNeed = (item) => {
    setForm(f => ({
      ...f,
      foodNeeds: f.foodNeeds.includes(item)
        ? f.foodNeeds.filter(x => x !== item)
        : [...f.foodNeeds, item]
    }));
    if (errors.foodNeeds) setErrors(e => ({ ...e, foodNeeds: "" }));
  };

  const validateStep = (s) => {
    const e = {};
    if (s === 1) {
      if (!form.fullName.trim()) e.fullName = "Name is required";
      if (!form.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) e.email = "Valid email required";
      if (!form.phone.match(/^\d{10}$/)) e.phone = "10-digit phone required";
      if (!form.address.trim()) e.address = "Delivery address is required";
      if (!form.receiverType) e.receiverType = "Please select receiver type";
    }
    if (s === 2) {
      if (form.foodNeeds.length === 0) e.foodNeeds = "Select at least one food need";
      if (!form.numberOfPeople || isNaN(form.numberOfPeople) || Number(form.numberOfPeople) <= 0)
        e.numberOfPeople = "Enter number of people";
    }
    if (s === 3) {
      if (!form.deliveryDate) e.deliveryDate = "Delivery date required";
      if (!form.deliveryTime) e.deliveryTime = "Delivery time required";
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
    const e = validateStep(3);
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitted(true);
  };

  const resetForm = () => {
    setSubmitted(false);
    setStep(1);
    setForm({
      fullName: "", email: "", phone: "", address: "",
      receiverType: "", orgName: "",
      foodNeeds: [], numberOfPeople: "", urgency: "normal",
      deliveryDate: "", deliveryTime: "", deliveryNotes: "",
      agreeTerms: false,
    });
  };

  const today = new Date().toISOString().split("T")[0];
  const steps = ["Receiver Info", "Food Request", "Delivery & Submit"];

  if (submitted) return (
    <div style={styles.page}>
      <div style={styles.successCard}>
        <div style={styles.successIcon}>🤝</div>
        <h2 style={styles.successTitle}>Request Received, {form.fullName.split(" ")[0]}!</h2>
        <p style={styles.successText}>
          Your food request for <strong>{form.numberOfPeople} people</strong> has been submitted.
          We'll arrange delivery on <strong>{form.deliveryDate}</strong> at <strong>{form.deliveryTime}</strong>.
        </p>
        <p style={styles.successSub}>Help is on the way. You are not alone. 🍱</p>
        <button style={styles.resetBtn} onClick={resetForm}>Submit Another Request</button>
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
          <div style={styles.formBadge}>Receiver Form</div>
        </div>
      </div>

      {/* Progress */}
      <div style={styles.progressWrap}>
        {steps.map((label, i) => (
          <div key={i} style={styles.stepItem}>
            <div style={{ ...styles.stepCircle, background: step > i + 1 ? "#22c55e" : step === i + 1 ? "#3b82f6" : "#1e293b", color: step >= i + 1 ? "#fff" : "#475569", border: step === i + 1 ? "2px solid #3b82f6" : "2px solid transparent" }}>
              {step > i + 1 ? "✓" : i + 1}
            </div>
            <span style={{ ...styles.stepLabel, color: step === i + 1 ? "#3b82f6" : "#475569", fontWeight: step === i + 1 ? 700 : 400 }}>{label}</span>
            {i < 2 && <div style={{ ...styles.stepLine, background: step > i + 1 ? "#22c55e" : "#1e293b" }} />}
          </div>
        ))}
      </div>

      {/* Card */}
      <div style={styles.card}>
        <h2 style={styles.cardTitle}>{steps[step - 1]}</h2>

        {/* Step 1 - Receiver Info */}
        {step === 1 && (
          <div style={styles.fields}>
            <label style={styles.label}>Full Name / Contact Person *</label>
            <input style={{ ...styles.input, ...(errors.fullName ? styles.inputErr : {}) }} placeholder="e.g. Ravi Kumar" value={form.fullName} onChange={e => update("fullName", e.target.value)} />
            {errors.fullName && <span style={styles.err}>{errors.fullName}</span>}

            <label style={styles.label}>Email Address *</label>
            <input style={{ ...styles.input, ...(errors.email ? styles.inputErr : {}) }} type="email" placeholder="you@example.com" value={form.email} onChange={e => update("email", e.target.value)} />
            {errors.email && <span style={styles.err}>{errors.email}</span>}

            <label style={styles.label}>Phone Number *</label>
            <input style={{ ...styles.input, ...(errors.phone ? styles.inputErr : {}) }} placeholder="10-digit mobile number" maxLength={10} value={form.phone} onChange={e => update("phone", e.target.value.replace(/\D/, ""))} />
            {errors.phone && <span style={styles.err}>{errors.phone}</span>}

            <label style={styles.label}>Receiver Type *</label>
            <select style={{ ...styles.input, ...(errors.receiverType ? styles.inputErr : {}) }} value={form.receiverType} onChange={e => update("receiverType", e.target.value)}>
              <option value="">-- Select type --</option>
              {receiverTypes.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            {errors.receiverType && <span style={styles.err}>{errors.receiverType}</span>}

            {form.receiverType && form.receiverType !== "Individual / Family" && (
              <>
                <label style={styles.label}>Organisation Name <span style={{ color: "#475569", fontWeight: 400 }}>(optional)</span></label>
                <input style={styles.input} placeholder="e.g. Hope Orphanage Trust" value={form.orgName} onChange={e => update("orgName", e.target.value)} />
              </>
            )}

            <label style={styles.label}>Delivery Address *</label>
            <textarea style={{ ...styles.input, ...styles.textarea, ...(errors.address ? styles.inputErr : {}) }} placeholder="Full address for food delivery" value={form.address} onChange={e => update("address", e.target.value)} />
            {errors.address && <span style={styles.err}>{errors.address}</span>}
          </div>
        )}

        {/* Step 2 - Food Request */}
        {step === 2 && (
          <div style={styles.fields}>
            <label style={styles.label}>Food Needed * <span style={{ color: "#475569", fontWeight: 400 }}>(select all that apply)</span></label>
            <div style={styles.chipWrap}>
              {foodNeeds.map(item => (
                <button
                  key={item}
                  type="button"
                  onClick={() => toggleFoodNeed(item)}
                  style={{
                    ...styles.chip,
                    background: form.foodNeeds.includes(item) ? "#3b82f6" : "#0f172a",
                    color: form.foodNeeds.includes(item) ? "#fff" : "#94a3b8",
                    border: form.foodNeeds.includes(item) ? "1.5px solid #3b82f6" : "1.5px solid #334155",
                  }}
                >
                  {item}
                </button>
              ))}
            </div>
            {errors.foodNeeds && <span style={styles.err}>{errors.foodNeeds}</span>}

            <label style={styles.label}>Number of People to Feed *</label>
            <input style={{ ...styles.input, ...(errors.numberOfPeople ? styles.inputErr : {}) }} type="number" min="1" placeholder="e.g. 25" value={form.numberOfPeople} onChange={e => update("numberOfPeople", e.target.value)} />
            {errors.numberOfPeople && <span style={styles.err}>{errors.numberOfPeople}</span>}

            <label style={styles.label}>Urgency Level</label>
            <div style={styles.urgencyWrap}>
              {[["normal", "🟢 Normal", "#22c55e"], ["urgent", "🟡 Urgent", "#eab308"], ["critical", "🔴 Critical", "#ef4444"]].map(([val, label, color]) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => update("urgency", val)}
                  style={{
                    ...styles.urgencyBtn,
                    background: form.urgency === val ? color + "22" : "#0f172a",
                    border: form.urgency === val ? `1.5px solid ${color}` : "1.5px solid #334155",
                    color: form.urgency === val ? color : "#475569",
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3 - Delivery & Submit */}
        {step === 3 && (
          <div style={styles.fields}>
            <label style={styles.label}>Preferred Delivery Date *</label>
            <input style={{ ...styles.input, ...(errors.deliveryDate ? styles.inputErr : {}) }} type="date" min={today} value={form.deliveryDate} onChange={e => update("deliveryDate", e.target.value)} />
            {errors.deliveryDate && <span style={styles.err}>{errors.deliveryDate}</span>}

            <label style={styles.label}>Preferred Delivery Time *</label>
            <input style={{ ...styles.input, ...(errors.deliveryTime ? styles.inputErr : {}) }} type="time" value={form.deliveryTime} onChange={e => update("deliveryTime", e.target.value)} />
            {errors.deliveryTime && <span style={styles.err}>{errors.deliveryTime}</span>}

            <label style={styles.label}>Additional Notes <span style={{ color: "#475569", fontWeight: 400 }}>(optional)</span></label>
            <textarea style={{ ...styles.input, ...styles.textarea }} placeholder="Dietary restrictions, allergies, access instructions..." value={form.deliveryNotes} onChange={e => update("deliveryNotes", e.target.value)} />

            {/* Summary */}
            <div style={styles.summary}>
              <p style={styles.summaryTitle}>📋 Request Summary</p>
              <div style={styles.summaryRow}><span>Name</span><span>{form.fullName}</span></div>
              <div style={styles.summaryRow}><span>Type</span><span>{form.receiverType}</span></div>
              <div style={styles.summaryRow}><span>People</span><span>{form.numberOfPeople}</span></div>
              <div style={styles.summaryRow}><span>Food Needs</span><span style={{ textAlign: "right", maxWidth: 200 }}>{form.foodNeeds.join(", ")}</span></div>
              <div style={styles.summaryRow}><span>Urgency</span><span style={{ textTransform: "capitalize" }}>{form.urgency}</span></div>
              <div style={styles.summaryRow}><span>Delivery</span><span>{form.deliveryDate} at {form.deliveryTime}</span></div>
            </div>

            <label style={styles.checkRow}>
              <input type="checkbox" checked={form.agreeTerms} onChange={e => update("agreeTerms", e.target.checked)} style={styles.checkbox} />
              <span style={styles.checkLabel}>I confirm the information provided is accurate and I genuinely need this food assistance.</span>
            </label>
            {errors.agreeTerms && <span style={styles.err}>{errors.agreeTerms}</span>}
          </div>
        )}

        {/* Buttons */}
        <div style={styles.btnRow}>
          {step > 1 && <button style={styles.backBtn} onClick={back}>← Back</button>}
          {step < 3
            ? <button style={styles.nextBtn} onClick={next}>Next →</button>
            : <button style={styles.submitBtn} onClick={submit}>Submit Request 🤝</button>
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
  tagline: { color: "#ea580c", fontSize: 10, fontWeight: 700, letterSpacing: 2.5, margin: 0, textTransform: "uppercase" },
  formBadge: { marginLeft: "auto", background: "#3b82f622", border: "1px solid #3b82f6", color: "#60a5fa", fontSize: 12, fontWeight: 700, padding: "4px 14px", borderRadius: 20, letterSpacing: 0.5 },
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
  chipWrap: { display: "flex", flexWrap: "wrap", gap: 8, marginTop: 4 },
  chip: { padding: "7px 14px", borderRadius: 20, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" },
  urgencyWrap: { display: "flex", gap: 10, marginTop: 4 },
  urgencyBtn: { flex: 1, padding: "10px 8px", borderRadius: 10, fontSize: 13, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" },
  err: { fontSize: 12, color: "#ef4444", marginTop: 2 },
  checkRow: { display: "flex", alignItems: "flex-start", gap: 10, marginTop: 14, cursor: "pointer" },
  checkbox: { marginTop: 2, accentColor: "#3b82f6", width: 16, height: 16 },
  checkLabel: { fontSize: 13, color: "#94a3b8", lineHeight: 1.5 },
  summary: { background: "#0f172a", border: "1.5px solid #334155", borderRadius: 12, padding: "16px 18px", marginTop: 12 },
  summaryTitle: { fontWeight: 700, color: "#3b82f6", margin: "0 0 10px", fontSize: 14 },
  summaryRow: { display: "flex", justifyContent: "space-between", fontSize: 13, color: "#cbd5e1", padding: "4px 0", borderBottom: "1px solid #1e293b" },
  btnRow: { display: "flex", justifyContent: "space-between", marginTop: 28, gap: 12 },
  backBtn: { padding: "11px 22px", borderRadius: 10, border: "1.5px solid #334155", background: "#0f172a", color: "#94a3b8", fontWeight: 600, fontSize: 14, cursor: "pointer" },
  nextBtn: { marginLeft: "auto", padding: "11px 28px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #3b82f6, #2563eb)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 15px rgba(59,130,246,0.3)" },
  submitBtn: { marginLeft: "auto", padding: "11px 24px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #22c55e, #16a34a)", color: "#fff", fontWeight: 700, fontSize: 14, cursor: "pointer", boxShadow: "0 4px 15px rgba(34,197,94,0.3)" },
  successCard: { background: "#1e293b", borderRadius: 20, padding: "48px 36px", maxWidth: 480, width: "100%", textAlign: "center", boxShadow: "0 8px 40px rgba(0,0,0,0.40)", border: "1px solid #334155" },
  successIcon: { fontSize: 56, marginBottom: 16 },
  successTitle: { fontSize: 26, fontWeight: 800, color: "#3b82f6", margin: "0 0 12px" },
  successText: { fontSize: 15, color: "#cbd5e1", lineHeight: 1.6, margin: "0 0 10px" },
  successSub: { fontSize: 14, color: "#64748b", fontStyle: "italic", marginBottom: 28 },
  resetBtn: { padding: "12px 28px", borderRadius: 10, border: "none", background: "linear-gradient(135deg, #3b82f6, #2563eb)", color: "#fff", fontWeight: 700, fontSize: 15, cursor: "pointer" },
};