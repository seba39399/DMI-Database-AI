import React, { useState, useEffect } from "react";

export default function App() {
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

  const [cards, setCards] = useState([]);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState("");

  // Fetch historical data from FastAPI SQL backend
  const fetchCards = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/api/v1/implant-cards");
      const data = await res.json();
      setCards(data);
    } catch (err) {
      console.error("Error fetching database records:", err);
    }
  };

  useEffect(() => {
    fetchCards();
  }, []);

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
        setNotification("✅ Card stored and AI-Classified successfully!");
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
      setNotification("❌ Connection failed. Is backend running?");
    } finally {
      setLoading(false);
    }
  };

  // Helper to style AI Risk Badge dynamically
  const getRiskBadgeStyles = (riskClass) => {
    switch (riskClass) {
      case "Class III":
        return "bg-red-500/20 text-red-400 border-red-500/50 shadow-[0_0_12px_rgba(239,68,68,0.2)]";
      case "Class IIb":
        return "bg-orange-500/20 text-orange-400 border-orange-500/50 shadow-[0_0_12px_rgba(249,115,22,0.2)]";
      case "Class IIa":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/50 shadow-[0_0_12px_rgba(234,179,8,0.2)]";
      default:
        return "bg-emerald-500/20 text-emerald-400 border-emerald-500/50 shadow-[0_0_12px_rgba(16,185,129,0.2)]";
    }
  };

  return (
    <div className="container mx-auto p-6 max-w-7xl space-y-10">
      {/* HEADER SECTION */}
      <div className="flex flex-col md:flex-row items-center justify-between border-b border-slate-800 pb-6 bg-slate-900/50 p-4 rounded-xl backdrop-blur-sm">
        <div className="flex items-center space-x-4">
          <div className="p-3 bg-indigo-600 rounded-xl text-2xl shadow-[0_0_20px_rgba(79,70,229,0.4)]">
            🏥
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">
              Club Noel{" "}
              <span className="text-indigo-400 font-medium">
                Clínica Infantil
              </span>
            </h1>
            <p className="text-sm text-slate-400">
              IMD Secure Tracking & Intelligent Risk Tiering Engine
            </p>
          </div>
        </div>
        <div className="mt-4 md:mt-0 text-right">
          <span className="px-3 py-1 text-xs font-mono rounded-full bg-slate-800 text-indigo-400 border border-indigo-500/30">
            v1.0.0 // Connected to SQL
          </span>
        </div>
      </div>

      {notification && (
        <div className="p-4 rounded-lg bg-slate-800 border border-indigo-500/30 text-indigo-300 font-medium animate-pulse text-center">
          {notification}
        </div>
      )}

      {/* DUAL COLUMN FORM DESIGN (IMAGING INPUT MIRROR) */}
      <form
        onSubmit={handleSubmit}
        className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-8"
      >
        <div className="border-b border-slate-800 pb-3">
          <h2 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
            📝 Interactive Implant Card Form
          </h2>
          <p className="text-xs text-slate-400">
            Fill in details matching the physical validation layout
            requirements.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* LEFT SIDE: IMPLANT TECHNICAL DATA */}
          <div className="space-y-4 bg-slate-900/30 p-4 rounded-xl border border-slate-800/60">
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-wider mb-2 border-b border-indigo-500/20 pb-1">
              🔬 Implant Details
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Nombre del Implante *
              </label>
              <input
                type="text"
                name="implant_name"
                value={formData.implant_name}
                onChange={handleChange}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white transition-colors"
                placeholder="e.g., St. Jude Medical Pacemaker"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Código de Implante (Serial) *
              </label>
              <input
                type="text"
                name="implant_code"
                value={formData.implant_code}
                onChange={handleChange}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white transition-colors"
                placeholder="e.g., SN-8921312"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Fecha de Implantación *
              </label>
              <input
                type="date"
                name="implantation_date"
                value={formData.implantation_date}
                onChange={handleChange}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white transition-colors"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Denominación Común
              </label>
              <input
                type="text"
                name="common_denomination"
                value={formData.common_denomination}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white transition-colors"
                placeholder="e.g., Marcapasos Cardiaco"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Registro Sanitario (INVIMA) *
              </label>
              <input
                type="text"
                name="sanitary_registration"
                value={formData.sanitary_registration}
                onChange={handleChange}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white transition-colors"
                placeholder="e.g., INVIMA-2023DM-001"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Nombre del Cirujano *
              </label>
              <input
                type="text"
                name="surgeon_name"
                value={formData.surgeon_name}
                onChange={handleChange}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-indigo-500 text-white transition-colors"
                placeholder="Dr. Alejandro Restrepo"
              />
            </div>
          </div>

          {/* RIGHT SIDE: PROVIDER & OPERATIONAL LOGISTICS */}
          <div className="space-y-4 bg-slate-900/30 p-4 rounded-xl border border-slate-800/60">
            <h3 className="text-sm font-bold text-emerald-400 uppercase tracking-wider mb-2 border-b border-emerald-500/20 pb-1">
              📦 Provider & Logistics
            </h3>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Proveedor *
              </label>
              <input
                type="text"
                name="provider"
                value={formData.provider}
                onChange={handleChange}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-white transition-colors"
                placeholder="e.g., Medica Express S.A.S"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                NIT *
              </label>
              <input
                type="text"
                name="nit"
                value={formData.nit}
                onChange={handleChange}
                required
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-white transition-colors"
                placeholder="e.g., 901223445-1"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Teléfono
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-white transition-colors"
                placeholder="+57 312 456 7890"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Referencias
              </label>
              <input
                type="text"
                name="references"
                value={formData.references}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-white transition-colors"
                placeholder="REF-X900-T"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Código de Unidad de Almacenamiento
              </label>
              <input
                type="text"
                name="storage_unit_code"
                value={formData.storage_unit_code}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-white transition-colors"
                placeholder="WH-ZONE-A"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-400 mb-1">
                Código de Unidad de Implantación
              </label>
              <input
                type="text"
                name="implantation_unit_code"
                value={formData.implantation_unit_code}
                onChange={handleChange}
                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 text-white transition-colors"
                placeholder="OR-ROOM-02"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end pt-4">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-500 hover:to-indigo-600 text-white text-sm font-semibold rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50"
          >
            {loading
              ? "Processing through AI..."
              : "💾 Save & AI Classify Record"}
          </button>
        </div>
      </form>

      {/* REVOLUTIONARY INTERACTIVE HISTORICAL DATA TABLE */}
      <div className="bg-slate-950 border border-slate-800 rounded-2xl p-6 shadow-2xl space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-3">
          <div>
            <h2 className="text-lg font-semibold text-slate-200">
              📊 Tracked IMD Historical Audit Records
            </h2>
            <p className="text-xs text-slate-400">
              Real-time indexed dataset pulling directly from SQL database
              model.
            </p>
          </div>
          <button
            onClick={fetchCards}
            className="p-2 bg-slate-900 border border-slate-700 rounded-lg text-xs font-medium text-slate-300 hover:bg-slate-800 transition-colors"
          >
            🔄 Refresh Table
          </button>
        </div>

        <div className="overflow-x-auto rounded-xl border border-slate-800">
          <table className="w-full text-left text-sm text-slate-300">
            <thead className="bg-slate-900 text-slate-400 text-xs uppercase tracking-wider border-b border-slate-800">
              <tr>
                <th className="p-4">ID</th>
                <th className="p-4">Device / Name</th>
                <th className="p-4">Serial Code</th>
                <th className="p-4">Date</th>
                <th className="p-4">INVIMA Reg</th>
                <th className="p-4">Surgeon</th>
                <th className="p-4 text-center">AI Risk Classification</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {cards.map((card) => (
                <tr
                  key={card.id}
                  className="hover:bg-slate-900/40 transition-colors"
                >
                  <td className="p-4 font-mono text-indigo-400">#{card.id}</td>
                  <td className="p-4 font-semibold text-white">
                    {card.implant_name}
                    <span className="block text-xs font-normal text-slate-400">
                      {card.common_denomination}
                    </span>
                  </td>
                  <td className="p-4 font-mono text-xs text-slate-400">
                    {card.implant_code}
                  </td>
                  <td className="p-4 text-xs">{card.implantation_date}</td>
                  <td className="p-4 text-xs font-mono text-slate-300">
                    {card.sanitary_registration}
                  </td>
                  <td className="p-4 text-xs text-slate-300">
                    {card.surgeon_name}
                  </td>
                  <td className="p-4 text-center">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${getRiskBadgeStyles(card.risk_class)}`}
                    >
                      {card.risk_class}
                    </span>
                  </td>
                </tr>
              ))}
              {cards.length === 0 && (
                <tr>
                  <td
                    colSpan="7"
                    className="p-8 text-center text-slate-500 italic"
                  >
                    No records stored yet. Seed data or complete the form above.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
