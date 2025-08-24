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

const Metric = ({ label, value, goal, color }) => (
    <div className="p-4 rounded-xl border border-white/20 bg-white/40 dark:bg-black/30 backdrop-blur-md shadow-md hover:shadow-xl hover-scale transition-transform duration-300 ripple relative text-center">
        <div className="text-sm opacity-70 mb-2">{label}</div>
        <div className="relative w-24 h-24 mx-auto">
            <svg className="w-full h-full" viewBox="0 0 36 36">
                <path
                    d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
                    className="text-gray-200 dark:text-gray-600"
                    fill="none"
                    strokeWidth="2"
                />
                <path
                    className={color}
                    strokeDasharray={`${(value / goal) * 100}, 100`}
                    d="M18 2.0845
              a 15.9155 15.9155 0 0 1 0 31.831
              a 15.9155 15.9155 0 0 1 0 -31.831"
                    fill="none"
                    strokeWidth="2"
                    strokeLinecap="round"
                />
            </svg>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-lg font-semibold">{value}</div>
        </div>
    </div>
);


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
          {icons[risk] || ""} Today's Risk: {risk}
        </h2>
        <span className="px-3 py-1 text-xs rounded-full bg-black/20 backdrop-blur-sm">
          {record.date}
        </span>
      </div>

      {/* Metrics */}
      <div className="mt-5 grid grid-cols-2 md:grid-cols-4 gap-4">
        <Metric label="Sleep" value={`${record.sleep}h`} goal={8} color="stroke-blue-500" />
        <Metric label="Steps" value={`${record.steps}`} goal={10000} color="stroke-emerald-500" />
        <Metric label="Water" value={`${record.water} cups`} goal={8} color="stroke-cyan-500" />
        <Metric label="Stress" value={`${record.stress}/5`} goal={5} color="stroke-rose-500" />
      </div>
    </div>
  );
}