export default function CoachChat({ risk, tips = [], locale = "en" }) {
    const headers = {
        en: "Your AI Health Coach Says...",
        hi: "आपके लिए सुझाव",
        or: "ଆପଣଙ୍କ ପାଇଁ ପରାମର୍ଶ",
    };

    if (tips.length === 0) return null;

    return (
        <div className="glass-card p-6 max-w-2xl mx-auto w-full hover-scale transition-all duration-500">
            <div className="flex items-start gap-4">
                <div className="text-3xl">🤖</div>
                <div>
                    <h2 className="text-xl font-bold mb-3 text-gray-800 dark:text-white pulse">
                        {headers[locale] || headers.en}
                    </h2>
                    <div className="space-y-3">
                        {tips.map((tip, i) => (
                            <div key={i} className="bg-emerald-100 dark:bg-emerald-900/50 p-3 rounded-lg rounded-tl-none shadow-sm">
                                <p className="text-sm text-emerald-800 dark:text-emerald-200">{tip}</p>
                            </div>
                        ))}
                    </div>
                    <p className="mt-4 text-xs opacity-70 italic">⚠️ Risk level: {risk}</p>
                </div>
            </div>
        </div>
    );
}