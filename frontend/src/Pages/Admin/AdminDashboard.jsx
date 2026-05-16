import { useState } from "react";

// ── Mock Data ─────────────────────────────────────────────
const mockDonors = [
  { id: "D001", fullName: "Priya Sharma", email: "priya@gmail.com", phone: "9876543210", address: "12, MG Road, Hyderabad", foodCategory: "Cooked Meals", foodDescription: "Freshly cooked biryani", quantity: "10", unit: "kg", expiryDate: "2026-05-18", pickupDate: "2026-05-17", pickupTime: "10:00", anonymous: false, status: "Pending" },
  { id: "D002", fullName: "Anonymous", email: "anon@gmail.com", phone: "9123456780", address: "45, Banjara Hills, Hyderabad", foodCategory: "Baked Goods", foodDescription: "Sealed biscuit packets", quantity: "20", unit: "packets", expiryDate: "2026-06-01", pickupDate: "2026-05-17", pickupTime: "14:00", anonymous: true, status: "Confirmed" },
  { id: "D003", fullName: "Arjun Reddy", email: "arjun@gmail.com", phone: "9988776655", address: "78, Jubilee Hills, Hyderabad", foodCategory: "Fruits", foodDescription: "Fresh bananas and apples", quantity: "15", unit: "kg", expiryDate: "2026-05-19", pickupDate: "2026-05-18", pickupTime: "09:00", anonymous: false, status: "Completed" },
  { id: "D004", fullName: "Sunita Rao", email: "sunita@gmail.com", phone: "9001122334", address: "22, Kukatpally, Hyderabad", foodCategory: "Dairy Products", foodDescription: "Milk and curd packets", quantity: "8", unit: "liters", expiryDate: "2026-05-17", pickupDate: "2026-05-17", pickupTime: "08:00", anonymous: false, status: "Cancelled" },
];

const mockReceivers = [
  { id: "R001", fullName: "Ravi Kumar", email: "ravi@gmail.com", phone: "9001234567", address: "Hope Orphanage, Secunderabad", receiverType: "Orphanage", orgName: "Hope Orphanage Trust", foodNeeds: ["Cooked Meals", "Fruits"], numberOfPeople: "45", urgency: "urgent", deliveryDate: "2026-05-17", deliveryTime: "12:00", status: "Pending" },
  { id: "R002", fullName: "Meena Das", email: "meena@gmail.com", phone: "9876012345", address: "Old Age Home, Ameerpet", receiverType: "Old Age Home", orgName: "Sunrise Old Age Home", foodNeeds: ["Dairy Products", "Baked Goods"], numberOfPeople: "30", urgency: "normal", deliveryDate: "2026-05-18", deliveryTime: "11:00", status: "Confirmed" },
  { id: "R003", fullName: "Vikram Singh", email: "vikram@gmail.com", phone: "9123000456", address: "Relief Camp, Uppal", receiverType: "Shelter / Relief Camp", orgName: "", foodNeeds: ["Cooked Meals", "Beverages"], numberOfPeople: "100", urgency: "critical", deliveryDate: "2026-05-17", deliveryTime: "09:00", status: "Completed" },
  { id: "R004", fullName: "Lakshmi Nair", email: "lakshmi@gmail.com", phone: "9000111222", address: "Govt School, LB Nagar", receiverType: "School / Anganwadi", orgName: "ZP High School", foodNeeds: ["Cooked Meals"], numberOfPeople: "60", urgency: "normal", deliveryDate: "2026-05-19", deliveryTime: "13:00", status: "Pending" },
];

// ── Status Badge ───────────────────────────────────────────
const statusColors = {
  Pending:   { bg: "#eab30822", color: "#eab308", border: "#eab308" },
  Confirmed: { bg: "#3b82f622", color: "#3b82f6", border: "#3b82f6" },
  Completed: { bg: "#22c55e22", color: "#22c55e", border: "#22c55e" },
  Cancelled: { bg: "#ef444422", color: "#ef4444", border: "#ef4444" },
};

const urgencyColors = {
  normal:   { color: "#22c55e", label: "🟢 Normal" },
  urgent:   { color: "#eab308", label: "🟡 Urgent" },
  critical: { color: "#ef4444", label: "🔴 Critical" },
};

function StatusBadge({ status }) {
  const c = statusColors[status] || statusColors.Pending;
  return (
    <span style={{ background: c.bg, color: c.color, border: `1px solid ${c.border}`, borderRadius: 20, padding: "3px 12px", fontSize: 11, fontWeight: 700, letterSpacing: 0.5 }}>
      {status}
    </span>
  );
}

// ── Detail Modal ───────────────────────────────────────────
function Modal({ item, type, onClose, onStatusChange }) {
  if (!item) return null;
  const isDonor = type === "donor";
  return (
    <div style={s.overlay} onClick={onClose}>
      <div style={s.modal} onClick={e => e.stopPropagation()}>
        <div style={s.modalHeader}>
          <div>
            <span style={{ fontSize: 11, color: isDonor ? "#f97316" : "#3b82f6", fontWeight: 700, letterSpacing: 1, textTransform: "uppercase" }}>{isDonor ? "🍱 Donor" : "🤝 Receiver"}</span>
            <h3 style={s.modalTitle}>{item.anonymous ? "Anonymous Donor" : item.fullName}</h3>
            <span style={{ fontSize: 12, color: "#475569" }}>ID: {item.id}</span>
          </div>
          <button onClick={onClose} style={s.closeBtn}>✕</button>
        </div>

        <div style={s.modalGrid}>
          <DetailRow label="Email" value={item.email} />
          <DetailRow label="Phone" value={item.phone} />
          <DetailRow label="Address" value={item.address} />
          {isDonor ? (<>
            <DetailRow label="Food Category" value={item.foodCategory} />
            <DetailRow label="Description" value={item.foodDescription} />
            <DetailRow label="Quantity" value={`${item.quantity} ${item.unit}`} />
            <DetailRow label="Expiry Date" value={item.expiryDate} />
            <DetailRow label="Pickup Date" value={`${item.pickupDate} at ${item.pickupTime}`} />
            <DetailRow label="Anonymous" value={item.anonymous ? "Yes" : "No"} />
          </>) : (<>
            <DetailRow label="Receiver Type" value={item.receiverType} />
            {item.orgName && <DetailRow label="Organisation" value={item.orgName} />}
            <DetailRow label="Food Needs" value={item.foodNeeds.join(", ")} />
            <DetailRow label="People to Feed" value={item.numberOfPeople} />
            <DetailRow label="Urgency" value={urgencyColors[item.urgency]?.label || item.urgency} />
            <DetailRow label="Delivery" value={`${item.deliveryDate} at ${item.deliveryTime}`} />
          </>)}
        </div>

        <div style={{ marginTop: 20 }}>
          <p style={{ fontSize: 12, color: "#475569", marginBottom: 8, fontWeight: 700 }}>UPDATE STATUS</p>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            {["Pending", "Confirmed", "Completed", "Cancelled"].map(st => (
              <button key={st} onClick={() => onStatusChange(item.id, st, type)}
                style={{ ...s.statusBtn, background: item.status === st ? statusColors[st].bg : "#0f172a", color: item.status === st ? statusColors[st].color : "#475569", border: `1px solid ${item.status === st ? statusColors[st].border : "#334155"}` }}>
                {st}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div style={s.detailRow}>
      <span style={s.detailLabel}>{label}</span>
      <span style={s.detailValue}>{value}</span>
    </div>
  );
}

// ── Main Admin Dashboard ───────────────────────────────────
export default function AdminDashboard() {
  const [tab, setTab] = useState("overview");
  const [donors, setDonors] = useState(mockDonors);
  const [receivers, setReceivers] = useState(mockReceivers);
  const [selected, setSelected] = useState(null);
  const [selectedType, setSelectedType] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("All");
  const [logoUrl, setLogoUrl] = useState(null);

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith("image/")) {
      const reader = new FileReader();
      reader.onload = (ev) => setLogoUrl(ev.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleStatusChange = (id, newStatus, type) => {
    if (type === "donor") setDonors(d => d.map(x => x.id === id ? { ...x, status: newStatus } : x));
    else setReceivers(r => r.map(x => x.id === id ? { ...x, status: newStatus } : x));
    setSelected(prev => prev ? { ...prev, status: newStatus } : prev);
  };

  const filterList = (list) => list.filter(item => {
    const name = (item.anonymous ? "Anonymous" : item.fullName).toLowerCase();
    const matchSearch = name.includes(search.toLowerCase()) || item.id.toLowerCase().includes(search.toLowerCase()) || item.email.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "All" || item.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const stats = [
    { label: "Total Donors", value: donors.length, color: "#f97316", icon: "🍱" },
    { label: "Total Receivers", value: receivers.length, color: "#3b82f6", icon: "🤝" },
    { label: "Completed", value: [...donors, ...receivers].filter(x => x.status === "Completed").length, color: "#22c55e", icon: "✅" },
    { label: "Pending", value: [...donors, ...receivers].filter(x => x.status === "Pending").length, color: "#eab308", icon: "⏳" },
  ];

  const filteredDonors = filterList(donors);
  const filteredReceivers = filterList(receivers);

  return (
    <div style={s.page}>
      {/* Navbar */}
      <div style={s.navbar}>
        <div style={s.navLeft}>
          <label style={s.logoWrap} title="Click to upload logo">
            {logoUrl ? <img src={logoUrl} alt="logo" style={s.logoImg} /> : <span style={{ fontSize: 22, filter: "brightness(10)" }}>🍽️</span>}
            <input type="file" accept="image/*" style={{ display: "none" }} onChange={handleLogoUpload} />
          </label>
          <div>
            <div style={s.brandName}><span style={{ color: "#fff", fontWeight: 400 }}>Donate</span><span style={{ color: "#f97316" }}>Dish</span></div>
            <div style={s.brandSub}>FEED THE NEED</div>
          </div>
        </div>
        <div style={s.adminBadge}>🛡️ Admin Panel</div>
      </div>

      {/* Tabs */}
      <div style={s.tabs}>
        {[["overview", "📊 Overview"], ["donors", "🍱 Donors"], ["receivers", "🤝 Receivers"]].map(([key, label]) => (
          <button key={key} onClick={() => setTab(key)} style={{ ...s.tab, background: tab === key ? "#1e293b" : "transparent", color: tab === key ? "#f1f5f9" : "#475569", borderBottom: tab === key ? "2px solid #f97316" : "2px solid transparent" }}>
            {label}
          </button>
        ))}
      </div>

      {/* Overview */}
      {tab === "overview" && (
        <div style={s.content}>
          <div style={s.statsGrid}>
            {stats.map(st => (
              <div key={st.label} style={s.statCard}>
                <span style={s.statIcon}>{st.icon}</span>
                <span style={{ ...s.statValue, color: st.color }}>{st.value}</span>
                <span style={s.statLabel}>{st.label}</span>
              </div>
            ))}
          </div>

          <div style={s.twoCol}>
            {/* Recent Donors */}
            <div style={s.miniCard}>
              <h3 style={s.miniTitle}>🍱 Recent Donors</h3>
              {donors.slice(0, 3).map(d => (
                <div key={d.id} style={s.miniRow} onClick={() => { setSelected(d); setSelectedType("donor"); }}>
                  <div style={s.miniAvatar("#f97316")}>{(d.anonymous ? "A" : d.fullName[0]).toUpperCase()}</div>
                  <div style={{ flex: 1 }}>
                    <div style={s.miniName}>{d.anonymous ? "Anonymous" : d.fullName}</div>
                    <div style={s.miniSub}>{d.foodCategory} · {d.quantity} {d.unit}</div>
                  </div>
                  <StatusBadge status={d.status} />
                </div>
              ))}
            </div>

            {/* Recent Receivers */}
            <div style={s.miniCard}>
              <h3 style={s.miniTitle}>🤝 Recent Receivers</h3>
              {receivers.slice(0, 3).map(r => (
                <div key={r.id} style={s.miniRow} onClick={() => { setSelected(r); setSelectedType("receiver"); }}>
                  <div style={s.miniAvatar("#3b82f6")}>{r.fullName[0].toUpperCase()}</div>
                  <div style={{ flex: 1 }}>
                    <div style={s.miniName}>{r.fullName}</div>
                    <div style={s.miniSub}>{r.receiverType} · {r.numberOfPeople} people</div>
                  </div>
                  <StatusBadge status={r.status} />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Donors Tab */}
      {tab === "donors" && (
        <div style={s.content}>
          <div style={s.toolbar}>
            <input style={s.search} placeholder="🔍  Search by name, ID or email..." value={search} onChange={e => setSearch(e.target.value)} />
            <select style={s.filter} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              {["All", "Pending", "Confirmed", "Completed", "Cancelled"].map(st => <option key={st}>{st}</option>)}
            </select>
          </div>
          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr>
                  {["ID", "Name", "Food Category", "Qty", "Pickup Date", "Status", "Action"].map(h => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredDonors.length === 0 && (
                  <tr><td colSpan={7} style={s.empty}>No donors found</td></tr>
                )}
                {filteredDonors.map(d => (
                  <tr key={d.id} style={s.tr}>
                    <td style={s.td}><span style={s.idBadge}>{d.id}</span></td>
                    <td style={s.td}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={s.miniAvatar("#f97316")}>{(d.anonymous ? "A" : d.fullName[0]).toUpperCase()}</div>
                        <div>
                          <div style={{ color: "#f1f5f9", fontWeight: 600, fontSize: 13 }}>{d.anonymous ? "Anonymous" : d.fullName}</div>
                          <div style={{ color: "#475569", fontSize: 11 }}>{d.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={s.td}><span style={{ color: "#cbd5e1", fontSize: 13 }}>{d.foodCategory}</span></td>
                    <td style={s.td}><span style={{ color: "#f97316", fontWeight: 700, fontSize: 13 }}>{d.quantity} {d.unit}</span></td>
                    <td style={s.td}><span style={{ color: "#94a3b8", fontSize: 12 }}>{d.pickupDate}</span></td>
                    <td style={s.td}><StatusBadge status={d.status} /></td>
                    <td style={s.td}>
                      <button style={s.viewBtn} onClick={() => { setSelected(d); setSelectedType("donor"); }}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Receivers Tab */}
      {tab === "receivers" && (
        <div style={s.content}>
          <div style={s.toolbar}>
            <input style={s.search} placeholder="🔍  Search by name, ID or email..." value={search} onChange={e => setSearch(e.target.value)} />
            <select style={s.filter} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              {["All", "Pending", "Confirmed", "Completed", "Cancelled"].map(st => <option key={st}>{st}</option>)}
            </select>
          </div>
          <div style={s.tableWrap}>
            <table style={s.table}>
              <thead>
                <tr>
                  {["ID", "Name", "Type", "People", "Urgency", "Delivery Date", "Status", "Action"].map(h => (
                    <th key={h} style={s.th}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filteredReceivers.length === 0 && (
                  <tr><td colSpan={8} style={s.empty}>No receivers found</td></tr>
                )}
                {filteredReceivers.map(r => (
                  <tr key={r.id} style={s.tr}>
                    <td style={s.td}><span style={s.idBadge}>{r.id}</span></td>
                    <td style={s.td}>
                      <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={s.miniAvatar("#3b82f6")}>{r.fullName[0].toUpperCase()}</div>
                        <div>
                          <div style={{ color: "#f1f5f9", fontWeight: 600, fontSize: 13 }}>{r.fullName}</div>
                          <div style={{ color: "#475569", fontSize: 11 }}>{r.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={s.td}><span style={{ color: "#cbd5e1", fontSize: 12 }}>{r.receiverType}</span></td>
                    <td style={s.td}><span style={{ color: "#3b82f6", fontWeight: 700 }}>{r.numberOfPeople}</span></td>
                    <td style={s.td}><span style={{ color: urgencyColors[r.urgency]?.color, fontSize: 12, fontWeight: 600 }}>{urgencyColors[r.urgency]?.label}</span></td>
                    <td style={s.td}><span style={{ color: "#94a3b8", fontSize: 12 }}>{r.deliveryDate}</span></td>
                    <td style={s.td}><StatusBadge status={r.status} /></td>
                    <td style={s.td}>
                      <button style={{ ...s.viewBtn, background: "#3b82f622", color: "#3b82f6", border: "1px solid #3b82f6" }} onClick={() => { setSelected(r); setSelectedType("receiver"); }}>View</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Detail Modal */}
      <Modal item={selected} type={selectedType} onClose={() => setSelected(null)} onStatusChange={handleStatusChange} />
    </div>
  );
}

// ── Styles ─────────────────────────────────────────────────
const s = {
  page: { minHeight: "100vh", background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)", fontFamily: "'Georgia', serif", color: "#f1f5f9" },
  navbar: { display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 32px", borderBottom: "1px solid #1e293b" },
  navLeft: { display: "flex", alignItems: "center", gap: 14 },
  logoWrap: { width: 48, height: 48, borderRadius: "50%", background: "linear-gradient(135deg, #f97316, #ea580c)", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", overflow: "hidden", flexShrink: 0, boxShadow: "0 2px 12px rgba(249,115,22,0.4)" },
  logoImg: { width: "100%", height: "100%", objectFit: "cover", borderRadius: "50%" },
  brandName: { fontSize: 20, fontWeight: 800, letterSpacing: -0.5 },
  brandSub: { fontSize: 9, color: "#ea580c", fontWeight: 700, letterSpacing: 2.5, textTransform: "uppercase" },
  adminBadge: { background: "#1e293b", border: "1px solid #334155", color: "#94a3b8", fontSize: 13, fontWeight: 700, padding: "6px 16px", borderRadius: 20 },
  tabs: { display: "flex", gap: 0, padding: "0 32px", borderBottom: "1px solid #1e293b" },
  tab: { padding: "14px 24px", fontSize: 14, fontWeight: 600, cursor: "pointer", border: "none", transition: "all 0.2s", letterSpacing: 0.3 },
  content: { padding: "28px 32px" },
  statsGrid: { display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16, marginBottom: 28 },
  statCard: { background: "#1e293b", borderRadius: 16, padding: "24px 20px", border: "1px solid #334155", display: "flex", flexDirection: "column", alignItems: "center", gap: 6, boxShadow: "0 4px 20px rgba(0,0,0,0.2)" },
  statIcon: { fontSize: 28 },
  statValue: { fontSize: 36, fontWeight: 800, lineHeight: 1 },
  statLabel: { fontSize: 12, color: "#475569", fontWeight: 600, letterSpacing: 0.5, textTransform: "uppercase" },
  twoCol: { display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 },
  miniCard: { background: "#1e293b", borderRadius: 16, padding: "20px", border: "1px solid #334155" },
  miniTitle: { fontSize: 14, fontWeight: 700, color: "#f1f5f9", margin: "0 0 16px", letterSpacing: 0.3 },
  miniRow: { display: "flex", alignItems: "center", gap: 12, padding: "10px 0", borderBottom: "1px solid #0f172a", cursor: "pointer" },
  miniAvatar: (color) => ({ width: 34, height: 34, borderRadius: "50%", background: color + "22", border: `1.5px solid ${color}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13, fontWeight: 700, color, flexShrink: 0 }),
  miniName: { fontSize: 13, fontWeight: 600, color: "#f1f5f9" },
  miniSub: { fontSize: 11, color: "#475569", marginTop: 2 },
  toolbar: { display: "flex", gap: 12, marginBottom: 20 },
  search: { flex: 1, padding: "10px 16px", background: "#1e293b", border: "1.5px solid #334155", borderRadius: 10, color: "#f1f5f9", fontSize: 14, outline: "none", fontFamily: "inherit" },
  filter: { padding: "10px 14px", background: "#1e293b", border: "1.5px solid #334155", borderRadius: 10, color: "#f1f5f9", fontSize: 13, outline: "none", cursor: "pointer", fontFamily: "inherit" },
  tableWrap: { overflowX: "auto", borderRadius: 16, border: "1px solid #334155" },
  table: { width: "100%", borderCollapse: "collapse", background: "#1e293b" },
  th: { padding: "14px 16px", textAlign: "left", fontSize: 11, fontWeight: 700, color: "#475569", letterSpacing: 0.8, textTransform: "uppercase", borderBottom: "1px solid #334155", whiteSpace: "nowrap", background: "#0f172a" },
  tr: { borderBottom: "1px solid #0f172a", cursor: "default" },
  td: { padding: "14px 16px", verticalAlign: "middle" },
  idBadge: { fontSize: 11, fontWeight: 700, color: "#475569", background: "#0f172a", border: "1px solid #334155", borderRadius: 6, padding: "2px 8px" },
  empty: { textAlign: "center", color: "#475569", padding: "40px", fontSize: 14 },
  viewBtn: { padding: "5px 14px", borderRadius: 8, background: "#f9731622", color: "#f97316", border: "1px solid #f97316", fontSize: 12, fontWeight: 700, cursor: "pointer" },
  overlay: { position: "fixed", inset: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16 },
  modal: { background: "#1e293b", borderRadius: 20, padding: "28px", width: "100%", maxWidth: 520, border: "1px solid #334155", boxShadow: "0 20px 60px rgba(0,0,0,0.6)", maxHeight: "90vh", overflowY: "auto" },
  modalHeader: { display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 20, paddingBottom: 16, borderBottom: "1px solid #334155" },
  modalTitle: { fontSize: 20, fontWeight: 800, color: "#f1f5f9", margin: "4px 0" },
  closeBtn: { background: "#0f172a", border: "1px solid #334155", color: "#94a3b8", width: 32, height: 32, borderRadius: 8, cursor: "pointer", fontSize: 14, flexShrink: 0 },
  modalGrid: { display: "flex", flexDirection: "column", gap: 0 },
  detailRow: { display: "flex", justifyContent: "space-between", padding: "10px 0", borderBottom: "1px solid #0f172a", gap: 16 },
  detailLabel: { fontSize: 12, color: "#475569", fontWeight: 700, textTransform: "uppercase", letterSpacing: 0.5, flexShrink: 0 },
  detailValue: { fontSize: 13, color: "#cbd5e1", textAlign: "right" },
  statusBtn: { padding: "6px 14px", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer", transition: "all 0.2s" },
};