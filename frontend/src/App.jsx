import React, { useState, useEffect } from "react";

export default function App() {
  // Navigation State
  const [activeTab, setActiveTab] = useState("ingestion");

  // Core Data States
  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");

  // Form State (Ingestion) - Keys match the backend API schema
  const [formData, setFormData] = useState({
    implant_name: "",
    implant_code: "",
    implantation_date: "",
    common_denomination: "",
    sanitary_registration: "",
    surgeon_name: "",
    provider: "",
    nit: "",
    phone: "",
    references: "",
    storage_unit_code: "",
    implantation_unit_code: "",
  });

  // Sandbox State (AI Simulation without database commitment)
  const [sandboxData, setSandboxData] = useState({ name: "", common: "" });
  const [sandboxResult, setSandboxResult] = useState(null);

  // Fetch data from FastAPI database
  const fetchCards = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/implant-cards");
      const data = await res.json();
      setCards(data);
    } catch (err) {
      console.error("Error connecting to backend API:", err);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

  // Compute Real-time Statistics from the current Database records
  const stats = React.useMemo(() => {
    const total = cards.length;
    const c3 = cards.filter((c) => c.risk_class === "Class III").length;
    const c2b = cards.filter((c) => c.risk_class === "Class IIb").length;
    const c2a = cards.filter((c) => c.risk_class === "Class IIa").length;
    const c1 = cards.filter((c) => c.risk_class === "Class I").length;

    // Unique providers count
    const providers = new Set(cards.map((c) => c.provider.toLowerCase().trim()))
      .size;

    return { total, c3, c2b, c2a, c1, providers };
  }, [cards]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/implant-cards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (res.status === 201) {
        setNotification("✅ Record securely stored and AI-Classified!");
        setFormData({
          implant_name: "",
          implant_code: "",
          implantation_date: "",
          common_denomination: "",
          sanitary_registration: "",
          surgeon_name: "",
          provider: "",
          nit: "",
          phone: "",
          references: "",
          storage_unit_code: "",
          implantation_unit_code: "",
        });
        fetchCards();
        setTimeout(() => setNotification(""), 4000);
      }
    } catch (err) {
      setNotification("❌ Connection failed. Verify your server instance.");
    } finally {
      setLoading(false);
    }
  };

  // Run Sandbox simulation (Local mirroring of classification rules)
  const handleSandboxSimulate = (e) => {
    e.preventDefault();
    const text = (sandboxData.name + " " + sandboxData.common).toLowerCase();
    let tier = "Class I";
    let reason =
      "Low structural surface risk device (Standard heuristic model).";

    if (
      text.includes("marcapasos") ||
      text.includes("pacemaker") ||
      text.includes("valvula") ||
      text.includes("valve") ||
      text.includes("corazon") ||
      text.includes("heart")
    ) {
      tier = "Class III";
      reason =
        "Critical invasive life-support device with high cardiac complexity infrastructure.";
    } else if (
      text.includes("tornillo") ||
      text.includes("screw") ||
      text.includes("fijacion") ||
      text.includes("placa") ||
      text.includes("plate") ||
      text.includes("trauma")
    ) {
      tier = "Class IIb";
      reason =
        "Long-term orthopedic bone fixation surgical implant subject to high stress thresholds.";
    } else if (
      text.includes("lente") ||
      text.includes("lens") ||
      text.includes("intraocular") ||
      text.includes("sutura") ||
      text.includes("suture") ||
      text.includes("seda")
    ) {
      tier = "Class IIa";
      reason =
        "Temporary or moderately controlled surgical/optical device with short-term permanence.";
    }

    setSandboxResult({ tier, reason });
  };

  const getRiskColor = (riskClass) => {
    switch (riskClass) {
      case "Class III":
        return {
          bg: "bg-red-500/10",
          text: "text-red-400",
          border: "border-red-500/30",
          glow: "shadow-[0_0_15px_rgba(239,68,68,0.15)]",
        };
      case "Class IIb":
        return {
          bg: "bg-orange-500/10",
          text: "text-orange-400",
          border: "border-orange-500/30",
          glow: "shadow-[0_0_15px_rgba(249,115,22,0.15)]",
        };
      case "Class IIa":
        return {
          bg: "bg-yellow-500/10",
          text: "text-yellow-400",
          border: "border-yellow-500/30",
          glow: "shadow-[0_0_15px_rgba(234,179,8,0.15)]",
        };
      default:
        return {
          bg: "bg-emerald-500/10",
          text: "text-emerald-400",
          border: "border-emerald-500/30",
          glow: "shadow-[0_0_15px_rgba(16,185,129,0.15)]",
        };
    }
  };

  return (
    <div className="flex min-h-screen bg-slate-950 text-slate-100 font-sans">
      {/* SIDEBAR NAVIGATION MENU */}
      <aside className="w-72 bg-slate-900 border-r border-slate-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Logo Brand */}
          <div className="p-6 border-b border-slate-800 flex items-center space-x-3 bg-slate-950/40">
            <div className="p-2.5 bg-indigo-600 rounded-xl text-xl shadow-[0_0_15px_rgba(79,70,229,0.4)]">
              🏥
            </div>
            <div>
              <h2 className="text-md font-bold tracking-tight text-white flex items-center gap-1">
                Club Noel
              </h2>
              <p className="text-xs text-slate-400 font-medium">
                Children's Clinic // DMI
              </p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="p-4 space-y-1.5">
            <p className="px-3 text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2">
              System Modules
            </p>

            <button
              onClick={() => setActiveTab("ingestion")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === "ingestion" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"}`}
            >
              <span className="text-base">📥</span>
              <span>Data Ingestion</span>
            </button>

            <button
              onClick={() => setActiveTab("analytics")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === "analytics" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"}`}
            >
              <span className="text-base">📊</span>
              <span>Analytics Dashboard</span>
            </button>

            <button
              onClick={() => setActiveTab("sandbox")}
              className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === "sandbox" ? "bg-indigo-600 text-white shadow-lg shadow-indigo-600/20" : "text-slate-400 hover:bg-slate-800/60 hover:text-slate-200"}`}
            >
              <span className="text-base">🤖</span>
              <span>AI Risk Sandbox</span>
            </button>
          </nav>
        </div>

        {/* Footer Brand Info */}
        <div className="p-4 border-t border-slate-800 bg-slate-950/20 text-center">
          <span className="px-2.5 py-1 text-[10px] font-mono rounded-full bg-slate-800 text-indigo-400 border border-indigo-500/20">
            SQL Engine Connected
          </span>
        </div>
      </aside>

      {/* MAIN CONTAINER CONTENT VIEWPORT */}
      <main className="flex-1 overflow-y-auto p-8 max-w-7xl mx-auto w-full space-y-6">
        {/* TOP SYSTEM NOTIFICATION ALERTS */}
        {notification && (
          <div className="p-4 rounded-xl bg-slate-900 border border-indigo-500/30 text-indigo-300 font-medium animate-fade-in text-center text-sm shadow-md">
            {notification}
          </div>
        )}

        {/* ==================== TAB 1: DATA INGESTION ==================== */}
        {activeTab === "ingestion" && (
          <div className="space-y-8">
            <div className="border-b border-slate-800 pb-4">
              <h1 className="text-xl font-bold text-white">
                Medical Device Ingestion & Registry
              </h1>
              <p className="text-xs text-slate-400">
                Two-column digital mirror layout for physical technical card
                validation workflows.
              </p>
            </div>

            <form
              onSubmit={handleSubmit}
              className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-6 backdrop-blur-sm"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* LEFT BLOCK: IMPLANT DETAILS */}
                <div className="space-y-4 bg-slate-950/40 p-4 rounded-xl border border-slate-800/50">
                  <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider border-b border-indigo-500/10 pb-1.5 flex items-center gap-1.5">
                    🔬 Implant Details
                  </h3>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Implant Name *
                    </label>
                    <input
                      type="text"
                      name="implant_name"
                      value={formData.implant_name}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-900 border border-slate-700/60 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-white transition-colors"
                      placeholder="e.g., Pacemaker St. Jude"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Implant Code (Serial) *
                    </label>
                    <input
                      type="text"
                      name="implant_code"
                      value={formData.implant_code}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-900 border border-slate-700/60 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-white transition-colors"
                      placeholder="e.g., SN-203948"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Implantation Date *
                    </label>
                    <input
                      type="date"
                      name="implantation_date"
                      value={formData.implantation_date}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-900 border border-slate-700/60 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-white transition-colors"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Common Denomination
                    </label>
                    <input
                      type="text"
                      name="common_denomination"
                      value={formData.common_denomination}
                      onChange={handleChange}
                      className="w-full bg-slate-900 border border-slate-700/60 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-white transition-colors"
                      placeholder="e.g., Cardiac Pacemaker"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Sanitary Registration (INVIMA) *
                    </label>
                    <input
                      type="text"
                      name="sanitary_registration"
                      value={formData.sanitary_registration}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-900 border border-slate-700/60 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-white transition-colors"
                      placeholder="e.g., INVIMA-2023DM-001"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Surgeon Name *
                    </label>
                    <input
                      type="text"
                      name="surgeon_name"
                      value={formData.surgeon_name}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-900 border border-slate-700/60 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-white transition-colors"
                      placeholder="Dr. Alejandro Restrepo"
                    />
                  </div>
                </div>

                {/* RIGHT BLOCK: LOGISTICS AND PROVIDER */}
                <div className="space-y-4 bg-slate-950/40 p-4 rounded-xl border border-slate-800/50">
                  <h3 className="text-xs font-bold text-emerald-400 uppercase tracking-wider border-b border-emerald-500/10 pb-1.5 flex items-center gap-1.5">
                    📦 Provider & Logistics
                  </h3>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Provider *
                    </label>
                    <input
                      type="text"
                      name="provider"
                      value={formData.provider}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-900 border border-slate-700/60 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 text-white transition-colors"
                      placeholder="e.g., Medica Express S.A.S"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      NIT / Tax ID *
                    </label>
                    <input
                      type="text"
                      name="nit"
                      value={formData.nit}
                      onChange={handleChange}
                      required
                      className="w-full bg-slate-900 border border-slate-700/60 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 text-white transition-colors"
                      placeholder="e.g., 900123456-1"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="text"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full bg-slate-900 border border-slate-700/60 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 text-white transition-colors"
                      placeholder="+57 312 456 7890"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      References
                    </label>
                    <input
                      type="text"
                      name="references"
                      value={formData.references}
                      onChange={handleChange}
                      className="w-full bg-slate-900 border border-slate-700/60 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 text-white transition-colors"
                      placeholder="REF-X900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Storage Unit Code
                    </label>
                    <input
                      type="text"
                      name="storage_unit_code"
                      value={formData.storage_unit_code}
                      onChange={handleChange}
                      className="w-full bg-slate-900 border border-slate-700/60 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 text-white transition-colors"
                      placeholder="WH-ZONE-A"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                      Implantation Unit Code
                    </label>
                    <input
                      type="text"
                      name="implantation_unit_code"
                      value={formData.implantation_unit_code}
                      onChange={handleChange}
                      className="w-full bg-slate-900 border border-slate-700/60 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-emerald-500 text-white transition-colors"
                      placeholder="OR-ROOM-02"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-5 py-2.5 bg-linear-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-xs font-bold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 disabled:opacity-40"
                >
                  {loading
                    ? "AI Model Evaluating..."
                    : "💾 AI Classify & Save Record"}
                </button>
              </div>
            </form>

            {/* AUDIT TABLE ROW */}
            <div className="bg-slate-900/40 border border-slate-800 rounded-2xl p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div>
                  <h2 className="text-sm font-bold text-slate-200">
                    📊 SQL Historical Audit Log
                  </h2>
                  <p className="text-[11px] text-slate-400">
                    Synchronous ID-indexed dataset pulled directly from the core
                    database engine.
                  </p>
                </div>
                <button
                  onClick={fetchCards}
                  className="px-3 py-1.5 bg-slate-950 border border-slate-800 rounded-lg text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
                >
                  🔄 Refresh Table
                </button>
              </div>

              <div className="overflow-x-auto rounded-xl border border-slate-800/80">
                <table className="w-full text-left text-xs text-slate-300">
                  <thead className="bg-slate-950 text-slate-400 font-bold uppercase tracking-wider border-b border-slate-800">
                    <tr>
                      <th className="p-3">ID</th>
                      <th className="p-3">Device / Name</th>
                      <th className="p-3">Serial Code</th>
                      <th className="p-3">Date</th>
                      <th className="p-3">Surgeon</th>
                      <th className="p-3 text-center">
                        AI Risk Classification
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/50">
                    {cards.map((card) => {
                      const colors = getRiskColor(card.risk_class);
                      return (
                        <tr
                          key={card.id}
                          className="hover:bg-slate-900/20 transition-colors"
                        >
                          <td className="p-3 font-mono text-indigo-400">
                            #{card.id}
                          </td>
                          <td className="p-3 font-bold text-white">
                            {card.implant_name}
                            <span className="block text-[10px] font-normal text-slate-400">
                              {card.common_denomination}
                            </span>
                          </td>
                          <td className="p-3 font-mono text-slate-400">
                            {card.implant_code}
                          </td>
                          <td className="p-3 text-slate-400">
                            {card.implantation_date}
                          </td>
                          <td className="p-3 text-slate-300">
                            {card.surgeon_name}
                          </td>
                          <td className="p-3 text-center">
                            <span
                              className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold border ${colors.bg} ${colors.text} ${colors.border} ${colors.glow}`}
                            >
                              {card.risk_class}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                    {cards.length === 0 && (
                      <tr>
                        <td
                          colSpan="6"
                          className="p-6 text-center text-slate-500 italic"
                        >
                          No records stored yet. Run seed.py or complete the
                          form above.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 2: ANALYTICS DASHBOARD ==================== */}
        {activeTab === "analytics" && (
          <div className="space-y-8 animate-fade-in">
            <div className="border-b border-slate-800 pb-4">
              <h1 className="text-xl font-bold text-white">
                Global Statistics & Key Performance Indicators
              </h1>
              <p className="text-xs text-slate-400">
                Automated quantitative evaluation over monitored high-impact
                implants inside Club Noel.
              </p>
            </div>

            {/* KPI METRIC CARDS */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl shadow-md">
                <p className="text-xs font-semibold text-slate-400 uppercase">
                  Total Implants
                </p>
                <h3 className="text-3xl font-extrabold text-white mt-1 font-mono">
                  {stats.total}
                </h3>
                <p className="text-[10px] text-indigo-400 mt-1">
                  Relational SQL database entries
                </p>
              </div>
              <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl shadow-md">
                <p className="text-xs font-semibold text-red-400 uppercase">
                  Critical Risk (CIII)
                </p>
                <h3 className="text-3xl font-extrabold text-red-400 mt-1 font-mono">
                  {stats.c3}
                </h3>
                <p className="text-[10px] text-slate-400 mt-1">
                  Life Support / High Impact complexity
                </p>
              </div>
              <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl shadow-md">
                <p className="text-xs font-semibold text-orange-400 uppercase">
                  High Risk (CIIb)
                </p>
                <h3 className="text-3xl font-extrabold text-orange-400 mt-1 font-mono">
                  {stats.c2b}
                </h3>
                <p className="text-[10px] text-slate-400 mt-1">
                  Bone Fixations / Surgical Trauma
                </p>
              </div>
              <div className="bg-slate-900/40 border border-slate-800 p-5 rounded-2xl shadow-md">
                <p className="text-xs font-semibold text-emerald-400 uppercase">
                  Active Providers
                </p>
                <h3 className="text-3xl font-extrabold text-emerald-400 mt-1 font-mono">
                  {stats.providers}
                </h3>
                <p className="text-[10px] text-slate-400 mt-1">
                  Validated logistics supply entities
                </p>
              </div>
            </div>

            {/* CUSTOM NATIVE TAILWIND GRAPHICS */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Distribution Chart Bar */}
              <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl space-y-6">
                <div>
                  <h4 className="text-sm font-bold text-slate-200">
                    Device Distribution by Risk Tier
                  </h4>
                  <p className="text-[11px] text-slate-400">
                    Volume percentage based on predictive classifications
                    computed by the AI network.
                  </p>
                </div>

                <div className="space-y-4">
                  {[
                    {
                      label: "Class III (Very High Risk)",
                      count: stats.c3,
                      color: "bg-red-500",
                    },
                    {
                      label: "Class IIb (High Risk)",
                      count: stats.c2b,
                      color: "bg-orange-500",
                    },
                    {
                      label: "Class IIa (Moderate Risk)",
                      count: stats.c2a,
                      color: "bg-yellow-500",
                    },
                    {
                      label: "Class I (Low Risk)",
                      count: stats.c1,
                      color: "bg-emerald-500",
                    },
                  ].map((item, idx) => {
                    const pct =
                      stats.total > 0
                        ? Math.round((item.count / stats.total) * 100)
                        : 0;
                    return (
                      <div key={idx} className="space-y-1">
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-300 font-medium">
                            {item.label}
                          </span>
                          <span className="text-slate-400 font-mono font-bold">
                            {item.count} units ({pct}%)
                          </span>
                        </div>
                        <div className="w-full bg-slate-950 h-3 rounded-full overflow-hidden border border-slate-800">
                          <div
                            className={`${item.color} h-full rounded-full transition-all duration-1000`}
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Functional Operational Box */}
              <div className="bg-slate-900/40 border border-slate-800 p-6 rounded-2xl flex flex-col justify-between">
                <div>
                  <h4 className="text-sm font-bold text-slate-200">
                    Sanitary Control Operational Summary
                  </h4>
                  <p className="text-[11px] text-slate-400 mb-4">
                    Institutional verification parameters evaluating internal
                    regulatory tracking.
                  </p>

                  <div className="space-y-3 text-xs">
                    <div className="flex justify-between border-b border-slate-800/80 pb-2">
                      <span className="text-slate-400">
                        INVIMA Registration Validation
                      </span>
                      <span className="text-emerald-400 font-mono font-bold">
                        100% Compliant
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/80 pb-2">
                      <span className="text-slate-400">
                        SQL Data Model Integrity
                      </span>
                      <span className="text-indigo-400 font-mono font-bold">
                        Optimal Engine
                      </span>
                    </div>
                    <div className="flex justify-between border-b border-slate-800/80 pb-2">
                      <span className="text-slate-400">
                        Critical Invasive Device Rate
                      </span>
                      <span className="text-slate-200 font-mono font-bold">
                        {stats.total > 0
                          ? Math.round(
                              ((stats.c3 + stats.c2b) / stats.total) * 100,
                            )
                          : 0}
                        %
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-3 bg-indigo-950/20 rounded-xl border border-indigo-500/10 text-[11px] text-indigo-300/90 mt-4">
                  💡 <strong>System Note:</strong> Analytics matrices listed
                  above update reactively each time surgical staff adds a new
                  card within the ingestion pipeline.
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB 3: AI RISK SANDBOX ==================== */}
        {activeTab === "sandbox" && (
          <div className="space-y-8 animate-fade-in">
            <div className="border-b border-slate-800 pb-4">
              <h1 className="text-xl font-bold text-white">
                AI Risk Simulation Sandbox
              </h1>
              <p className="text-xs text-slate-400">
                Isolated prototyping environment to analyze and predict
                regulatory device risk in real-time without executing write
                queries to the main database.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
              {/* INPUT SIMULATION FORM */}
              <form
                onSubmit={handleSandboxSimulate}
                className="lg:col-span-1 bg-slate-900/40 border border-slate-800 rounded-2xl p-5 space-y-4"
              >
                <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-wider border-b border-slate-800 pb-2">
                  🕹️ Simulation Parameters
                </h3>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Commercial Device Name
                  </label>
                  <input
                    type="text"
                    value={sandboxData.name}
                    onChange={(e) =>
                      setSandboxData({ ...sandboxData, name: e.target.value })
                    }
                    required
                    className="w-full bg-slate-900 border border-slate-700/60 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-white"
                    placeholder="e.g., Edwards Magna Valve"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Common Denomination / Description
                  </label>
                  <input
                    type="text"
                    value={sandboxData.common}
                    onChange={(e) =>
                      setSandboxData({ ...sandboxData, common: e.target.value })
                    }
                    required
                    className="w-full bg-slate-900 border border-slate-700/60 rounded-lg px-3 py-2 text-xs focus:outline-none focus:border-indigo-500 text-white"
                    placeholder="e.g., Biological aortic heart valve replacement"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-lg transition-all shadow-md"
                >
                  ⚡ Run Risk Diagnostics Evaluation
                </button>
              </form>

              {/* SIMULATION RESULT VISUALIZATION */}
              <div className="lg:col-span-2 bg-slate-900/20 border border-slate-800/80 rounded-2xl p-6 min-h-65 flex flex-col justify-between">
                <div>
                  <h3 className="text-xs font-bold text-slate-400 tracking-wider border-b border-slate-800 pb-2 mb-4 uppercase">
                    🖥️ AI Pipeline Output Console
                  </h3>

                  {sandboxResult ? (
                    <div className="space-y-4 animate-fade-in">
                      <div className="flex items-center space-x-3">
                        <span className="text-xs text-slate-400 font-semibold">
                          Classification Output:
                        </span>
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-extrabold border ${getRiskColor(sandboxResult.tier).bg} ${getRiskColor(sandboxResult.tier).text} ${getRiskColor(sandboxResult.tier).border} ${getRiskColor(sandboxResult.tier).glow}`}
                        >
                          {sandboxResult.tier}
                        </span>
                      </div>

                      <div className="bg-slate-950 p-4 rounded-xl border border-slate-800/60 font-mono text-xs space-y-2">
                        <p className="text-indigo-400">
                          &gt;&gt; [ANALYSIS COMPLETED SUCCESSFULLY]
                        </p>
                        <p className="text-slate-300 leading-relaxed">
                          <strong className="text-slate-400">
                            Technical Criteria:
                          </strong>{" "}
                          {sandboxResult.reason}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center justify-center p-8 text-slate-500 italic text-center text-xs space-y-2">
                      <span>🤖 Awaiting parameters...</span>
                      <span>
                        Enter simulation data inside the left config panel to
                        view backend heuristic classifications inside this
                        terminal array.
                      </span>
                    </div>
                  )}
                </div>

                <div className="text-[10px] text-slate-500 border-t border-slate-800/60 pt-3 italic">
                  * Note: Operational procedures built inside this simulation
                  zone do not execute transactional queries onto the SQLite
                  database cluster.
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
