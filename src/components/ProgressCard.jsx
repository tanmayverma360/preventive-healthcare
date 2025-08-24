const colors = {
  Low: "from-emerald-400/80 to-emerald-600/80 text-white shadow-lg shadow-emerald-500/30",
  Medium:
    "from-amber-400/80 to-amber-600/80 text-white shadow-lg shadow-amber-500/30",
  High: "from-rose-400/80 to-rose-600/80 text-white shadow-lg shadow-rose-500/30",
};

const icons = {
  Low: "✅",
  Medium: "⚠️",
  High: "🚨",
};

export default function ProgressCard({ record, risk }) {
  if (!record) return null;

  return (
    <div className="glass-card p-6 max-w-2xl mx-auto w-full hover-scale transition-all duration-500">
      {/* Header */}
      <div
        className={`p-4 rounded-xl bg-gradient-to-r ${
          colors[risk] || ""
        } flex justify-between items-center glow-hover gradient-animate`}
      >
        <h2 className="text-lg font-bold tracking-wide flex items-center gap-2 pulse">
          {icons[risk] || ""} Today&apos;s Risk: {risk}
        </h2>
        <span className="px-3 py-1 text-xs rounded-full bg-black/20 backdrop-blur-sm">
          {record.date}
        </span>
      </div>

      {/* Metrics */}
      <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Metric label="Sleep" value={`${record.sleep}h`} />
        <Metric label="Steps" value={`${record.steps}`} />
        <Metric label="Water" value={`${record.water} cups`} />
        <Metric label="Stress" value={`${record.stress}/5`} />
      </div>
    </div>
  );
}

function Metric({ label, value }) {
  return (
    <div className="p-4 rounded-xl border border-white/20 bg-white/40 dark:bg-black/30 backdrop-blur-md shadow-md hover:shadow-xl hover-scale transition-transform duration-300 ripple relative">
      <div className="text-sm opacity-70">{label}</div>
      <div className="text-lg font-semibold">{value}</div>
    </div>
  );
}
