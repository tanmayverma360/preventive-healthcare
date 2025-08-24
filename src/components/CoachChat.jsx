export default function CoachChat({ risk, tips = [], locale = "en" }) {
  const headers = {
    en: "Your Personalized Tips",
    hi: "आपके लिए सुझाव",
    or: "ଆପଣଙ୍କ ପାଇଁ ପରାମର୍ଶ",
  };

  if (tips.length === 0) return null;

  return (
    <div className="glass-card p-6 max-w-2xl mx-auto w-full hover-scale transition-all duration-500">
      <h2 className="text-xl font-bold mb-3 text-[#1c5284] pulse">
        {headers[locale] || headers.en}
      </h2>
      <ul className="list-disc pl-6 space-y-2 text-sm leading-relaxed">
        {tips.map((t, i) => (
          <li key={i} className="glow-hover">
            {t}
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs opacity-70 italic">⚠️ Risk level: {risk}</p>
    </div>
  );
}
