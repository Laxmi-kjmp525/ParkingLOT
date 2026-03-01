import { useEffect, useMemo, useState } from "react";

const API_BASE = "/api/Parking";

// helpers (backend returns numbers)
const vehicleTypeLabel = (v) => (v === 0 ? "Bike" : v === 1 ? "Car" : "Truck");
const spotTypeLabel = (s) => (s === 0 ? "Small" : s === 1 ? "Medium" : "Large");
const statusLabel = (st) => (st === 0 ? "Free" : "Occupied");

export default function App() {
  const [numberPlate, setNumberPlate] = useState("");
  const [vehicleType, setVehicleType] = useState(1); // default Car
  const [ticketId, setTicketId] = useState("");

  const [status, setStatus] = useState([]);
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState(null); // { type: "success"|"error", message: "" }

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3200);
  };

  const loadStatus = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/status`);
      const data = await res.json();
      setStatus(Array.isArray(data) ? data : []);
    } catch {
      showToast("error", "Failed to load status. Is backend running on :5056?");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStatus();
  }, []);

  const stats = useMemo(() => {
    const total = status.length;
    const free = status.filter((s) => s.status === 0).length;
    const occupied = total - free;
    return { total, free, occupied };
  }, [status]);

  const handlePark = async () => {
    if (!numberPlate.trim()) {
      showToast("error", "Please enter a number plate.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/park`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          numberPlate: numberPlate.trim(),
          vehicleType: Number(vehicleType),
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        showToast("error", data?.message || "Parking failed.");
        return;
      }

      if (data?.ticketId) setTicketId(data.ticketId);

      showToast(
        "success",
        `Parked ${vehicleTypeLabel(Number(vehicleType))}! Ticket ID copied below.`
      );

      setNumberPlate("");
      await loadStatus();
    } catch {
      showToast("error", "Parking failed. Check backend/CORS.");
    } finally {
      setLoading(false);
    }
  };

  const handleUnpark = async () => {
    if (!ticketId.trim()) {
      showToast("error", "Please paste Ticket ID.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/unpark/${ticketId.trim()}`, {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok) {
        showToast("error", data?.message || "Unpark failed. Invalid ticket?");
        return;
      }

      showToast(
        "success",
        `Unparked! ₹${data.amount} • ${data.durationMinutes} mins • Spot freed: ${data.freedSpotId}`
      );
      await loadStatus();
    } catch {
      showToast("error", "Unpark failed. Check backend/CORS.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      {/* simple CSS for responsiveness */}
      <style>{responsiveCss}</style>

      {/* Header */}
      <div style={styles.header}>
        <div>
          <div style={styles.titleRow}>
            <span style={styles.logo}>🚗</span>
            <div>
              <div style={styles.title}>Parking Lot System</div>
              <div style={styles.subtitle}>React UI • ASP.NET Core REST API</div>
            </div>
          </div>
        </div>

        <div style={styles.headerActions}>
          <button
            onClick={loadStatus}
            style={{ ...styles.secondaryBtn, opacity: loading ? 0.7 : 1 }}
            disabled={loading}
          >
            {loading ? "Refreshing..." : "Refresh"}
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-3" style={styles.statsRow}>
        <StatCard label="Total Spots" value={stats.total} accent="blue" />
        <StatCard label="Free" value={stats.free} accent="green" />
        <StatCard label="Occupied" value={stats.occupied} accent="orange" />
      </div>

      {/* Forms */}
      <div className="grid-2" style={styles.grid}>
        <div style={styles.card}>
          <div style={styles.cardTitle}>Park Vehicle</div>

          <label style={styles.label}>Number Plate</label>
          <input
            style={styles.input}
            placeholder="e.g. KA01AB1234"
            value={numberPlate}
            onChange={(e) => setNumberPlate(e.target.value)}
          />

          <label style={styles.label}>Vehicle Type</label>
          <select
            style={styles.input}
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
          >
            <option value={0}>Bike</option>
            <option value={1}>Car</option>
            <option value={2}>Truck</option>
          </select>

          <button onClick={handlePark} style={styles.primaryBtn} disabled={loading}>
            {loading ? "Please wait..." : "Park"}
          </button>

          <div style={styles.helpText}>
            After parking, Ticket ID auto-fills in Unpark.
          </div>

          {ticketId && (
            <div style={styles.ticketBox}>
              <div style={styles.ticketLabel}>Latest Ticket ID</div>
              <div style={styles.ticketRow}>
                <span style={styles.mono}>{ticketId}</span>
                <button
                  style={styles.copyBtn}
                  onClick={() => {
                    navigator.clipboard?.writeText(ticketId);
                    showToast("success", "Ticket ID copied!");
                  }}
                >
                  Copy
                </button>
              </div>
            </div>
          )}
        </div>

        <div style={styles.card}>
          <div style={styles.cardTitle}>Unpark Vehicle</div>

          <label style={styles.label}>Ticket ID</label>
          <input
            style={styles.input}
            placeholder="Paste ticket id here"
            value={ticketId}
            onChange={(e) => setTicketId(e.target.value)}
          />

          <button onClick={handleUnpark} style={styles.dangerBtn} disabled={loading}>
            {loading ? "Please wait..." : "Unpark"}
          </button>

          <div style={styles.helpText}>
            Returns: duration + amount + freed spot.
          </div>
        </div>
      </div>

      {/* Table */}
      <div style={styles.card}>
        <div style={styles.cardHeaderRow}>
          <div style={styles.cardTitle}>Parking Status</div>
          <div style={styles.smallMuted}>
            {loading ? "Loading..." : `Showing ${status.length} spots`}
          </div>
        </div>

        <div style={styles.tableWrap}>
          <table style={styles.table}>
            <thead>
              <tr>
                <th style={styles.th}>Spot</th>
                <th style={styles.th}>Floor</th>
                <th style={styles.th}>Spot Type</th>
                <th style={styles.th}>Status</th>
                <th style={styles.th}>Vehicle</th>
              </tr>
            </thead>
            <tbody>
              {status.map((s) => (
                <tr key={s.id} style={s.status === 1 ? styles.rowOccupied : null}>
                  <td style={styles.td}>{s.id}</td>
                  <td style={styles.td}>{s.floor}</td>
                  <td style={styles.td}>{spotTypeLabel(s.spotType)}</td>
                  <td style={styles.td}>
                    <Badge type={s.status === 0 ? "success" : "warning"}>
                      {statusLabel(s.status)}
                    </Badge>
                  </td>
                  <td style={styles.td}>
                    {s.currentVehicle?.numberPlate ? (
                      <span style={styles.mono}>{s.currentVehicle.numberPlate}</span>
                    ) : (
                      <span style={styles.smallMuted}>—</span>
                    )}
                  </td>
                </tr>
              ))}

              {status.length === 0 && !loading && (
                <tr>
                  <td style={styles.td} colSpan={5}>
                    No data. Check backend swagger: http://localhost:5056/swagger
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div
          style={{
            ...styles.toast,
            ...(toast.type === "success" ? styles.toastSuccess : styles.toastError),
          }}
        >
          {toast.message}
        </div>
      )}
    </div>
  );
}

function StatCard({ label, value, accent }) {
  const accentMap = {
    blue: { bg: "rgba(59,130,246,0.10)", border: "rgba(59,130,246,0.35)", dot: "#3B82F6" },
    green: { bg: "rgba(16,185,129,0.10)", border: "rgba(16,185,129,0.35)", dot: "#10B981" },
    orange: { bg: "rgba(245,158,11,0.12)", border: "rgba(245,158,11,0.35)", dot: "#F59E0B" },
  };
  const a = accentMap[accent] || accentMap.blue;

  return (
    <div style={{ ...styles.statCard, background: a.bg, borderColor: a.border }}>
      <div style={styles.statTop}>
        <span style={{ ...styles.dot, background: a.dot }} />
        <div style={styles.statLabel}>{label}</div>
      </div>
      <div style={styles.statValue}>{value}</div>
    </div>
  );
}

function Badge({ type = "success", children }) {
  const base = {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: 999,
    fontSize: 12,
    fontWeight: 800,
    letterSpacing: 0.2,
  };

  const theme =
    type === "success"
      ? { background: "rgba(16,185,129,0.12)", color: "#0F766E", border: "1px solid rgba(16,185,129,0.35)" }
      : type === "warning"
      ? { background: "rgba(245,158,11,0.12)", color: "#92400E", border: "1px solid rgba(245,158,11,0.35)" }
      : { background: "#F3F4F6", color: "#111827", border: "1px solid #E5E7EB" };

  return <span style={{ ...base, ...theme }}>{children}</span>;
}

const styles = {
  page: {
    minHeight: "100vh",
    padding: "22px 18px 40px",
    background:
      "radial-gradient(1200px 600px at 10% 0%, rgba(59,130,246,0.15), transparent 50%), " +
      "radial-gradient(900px 500px at 90% 10%, rgba(16,185,129,0.15), transparent 45%), " +
      "#0B1220",
    fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Arial",
    color: "#E5E7EB",
    width: "100%",
    boxSizing: "border-box",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-end",
    gap: 12,
    maxWidth: 1400,
    margin: "0 auto 18px",
  },
  titleRow: { display: "flex", gap: 12, alignItems: "center" },
  logo: {
    width: 44,
    height: 44,
    borderRadius: 14,
    display: "grid",
    placeItems: "center",
    background: "rgba(255,255,255,0.08)",
    border: "1px solid rgba(255,255,255,0.12)",
    fontSize: 22,
  },
  title: { fontSize: 34, fontWeight: 900, letterSpacing: -0.6, color: "white" },
  subtitle: { marginTop: 4, color: "rgba(229,231,235,0.75)", fontSize: 14 },

  headerActions: { display: "flex", gap: 10 },

  statsRow: {
    maxWidth: 1400,
    margin: "0 auto 14px",
    display: "grid",
    gap: 12,
  },
  statCard: {
    borderRadius: 16,
    padding: "14px 16px",
    border: "1px solid rgba(255,255,255,0.12)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.22)",
    backdropFilter: "blur(8px)",
  },
  statTop: { display: "flex", alignItems: "center", gap: 8 },
  dot: { width: 10, height: 10, borderRadius: 999 },
  statLabel: { color: "rgba(229,231,235,0.85)", fontSize: 13, fontWeight: 700 },
  statValue: { marginTop: 8, fontSize: 28, fontWeight: 900, color: "white" },

  grid: {
    maxWidth: 1400,
    margin: "0 auto 14px",
    display: "grid",
    gap: 12,
  },

  card: {
    background: "rgba(255,255,255,0.06)",
    borderRadius: 16,
    border: "1px solid rgba(255,255,255,0.12)",
    padding: 16,
    boxShadow: "0 10px 30px rgba(0,0,0,0.22)",
    backdropFilter: "blur(10px)",
  },
  cardTitle: { fontSize: 18, fontWeight: 900, marginBottom: 10, color: "white" },
  cardHeaderRow: { display: "flex", justifyContent: "space-between", alignItems: "center" },

  label: {
    display: "block",
    fontSize: 13,
    fontWeight: 800,
    marginTop: 10,
    marginBottom: 6,
    color: "rgba(229,231,235,0.9)",
  },

  input: {
    width: "100%",
    padding: "11px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.18)",
    background: "rgba(17,24,39,0.65)",
    color: "white",
    outline: "none",
    fontSize: 14,
    boxSizing: "border-box",
  },

  primaryBtn: {
    width: "100%",
    marginTop: 12,
    padding: "11px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "linear-gradient(135deg, #2563EB, #7C3AED)",
    color: "white",
    fontWeight: 900,
    cursor: "pointer",
  },
  dangerBtn: {
    width: "100%",
    marginTop: 12,
    padding: "11px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.12)",
    background: "linear-gradient(135deg, #EF4444, #B91C1C)",
    color: "white",
    fontWeight: 900,
    cursor: "pointer",
  },
  secondaryBtn: {
    padding: "10px 12px",
    borderRadius: 12,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.06)",
    color: "white",
    fontWeight: 800,
    cursor: "pointer",
  },

  helpText: { marginTop: 10, fontSize: 12, color: "rgba(229,231,235,0.70)" },

  ticketBox: {
    marginTop: 12,
    padding: 12,
    borderRadius: 14,
    border: "1px dashed rgba(255,255,255,0.22)",
    background: "rgba(0,0,0,0.18)",
  },
  ticketLabel: { fontSize: 12, fontWeight: 800, color: "rgba(229,231,235,0.75)", marginBottom: 8 },
  ticketRow: { display: "flex", justifyContent: "space-between", alignItems: "center", gap: 10 },
  copyBtn: {
    padding: "8px 10px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.14)",
    background: "rgba(255,255,255,0.06)",
    color: "white",
    fontWeight: 800,
    cursor: "pointer",
    whiteSpace: "nowrap",
  },

  tableWrap: { overflowX: "auto", marginTop: 10 },
  table: { width: "100%", borderCollapse: "collapse", minWidth: 720 },
  th: {
    textAlign: "left",
    fontSize: 12,
    color: "rgba(229,231,235,0.75)",
    fontWeight: 900,
    padding: "12px 10px",
    borderBottom: "1px solid rgba(255,255,255,0.12)",
    whiteSpace: "nowrap",
  },
  td: {
    padding: "12px 10px",
    borderBottom: "1px solid rgba(255,255,255,0.08)",
    fontSize: 14,
    color: "rgba(255,255,255,0.92)",
  },
  rowOccupied: { background: "rgba(245,158,11,0.06)" },

  mono: { fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace" },
  smallMuted: { color: "rgba(229,231,235,0.70)", fontSize: 12 },

  toast: {
    position: "fixed",
    right: 18,
    bottom: 18,
    maxWidth: 520,
    padding: "12px 14px",
    borderRadius: 14,
    fontWeight: 900,
    boxShadow: "0 18px 40px rgba(0,0,0,0.35)",
    border: "1px solid rgba(255,255,255,0.14)",
  },
  toastSuccess: { background: "rgba(16,185,129,0.18)", color: "white" },
  toastError: { background: "rgba(239,68,68,0.20)", color: "white" },
};

const responsiveCss = `
  /* 2 columns on desktop, 1 on mobile */
  .grid-2 { grid-template-columns: 1fr 1fr; }
  .grid-3 { grid-template-columns: repeat(3, 1fr); }

  @media (max-width: 980px) {
    .grid-2 { grid-template-columns: 1fr; }
    .grid-3 { grid-template-columns: 1fr; }
  }
`;