import { useState, useEffect } from "react";
import ProgressCard from "./components/ProgressCard.jsx";
import CheckInForm from "./components/CheckInForm.jsx";
import CoachChat from "./components/CoachChat.jsx";
import MoodTracker from "./components/MoodTracker.jsx";
import { computeRisk } from "./lib/risk.js"; // ✅ fixed path
import { useRiskModel } from "./ml/useRiskModel.js"; // ✅ ML hook

// Small helper to create consistent tips based on the final risk & record
function getTips(record, risk) {
  if (!record) return [];
  const base = [
    "Drink a glass of water every 2 hours today.",
    "Take a 10-minute walk after meals.",
    "Aim for 7–8 hours of sleep; reduce screens 1 hour before bed.",
    "Do 4-7-8 breathing for 2 minutes to lower stress.",
    "Choose fiber-rich foods and avoid sugary snacks today.",
  ];

  const out = [];
  if (record.sleep < 7)
    out.push("Try to get at least 7–8 hours of sleep tonight.");
  if (record.water < 8) out.push("Drink more water to stay hydrated.");
  if (record.steps < 5000) out.push("Aim for a short walk or stretch break.");
  if (record.stress > 3)
    out.push("Practice deep breathing or a 5-min meditation.");

  // Add at least 3 tips total
  while (out.length < 3) {
    const pick = base[Math.floor(Math.random() * base.length)];
    if (!out.includes(pick)) out.push(pick);
  }

  // Optionally nudge more if risk is high
  if (risk === "High" && !out.some((t) => t.includes("breathing"))) {
    out.push("Schedule a short relaxation break this afternoon.");
  }

  return out.slice(0, 4);
}

export default function App() {
  const [record, setRecord] = useState(null);
  const [risk, setRisk] = useState("Low");
  const [tips, setTips] = useState([]);

  // ML model (trains in-browser, then predicts)
  const { ready, status, predictRisk } = useRiskModel();

  // 1) Decide risk: prefer ML when ready; otherwise fallback to rules
  useEffect(() => {
    if (!record) return;
    if (ready) {
      const mlRisk = predictRisk(record);
      if (mlRisk) {
        setRisk(mlRisk);
        return;
      }
    }
    // fallback while model is training
    setRisk(computeRisk(record));
  }, [record, ready, predictRisk]);

  // 2) Generate tips after risk is finalized
  useEffect(() => {
    if (!record) return;
    setTips(getTips(record, risk));
  }, [record, risk]);

  // 3) Handle form submit (just store today's record)
  const handleCheckIn = (data) => {
    setRecord(data);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6e8ef] to-white dark:from-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-500">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <h1 className="text-3xl font-extrabold text-center text-[#1c5284] dark:text-[#39e240] animate-fade-in">
          🌱 Preventive Health Tracker
        </h1>

        {/* Tiny status while the ML model trains */}
        {status !== "ready" && (
          <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
            Training mini health model…
          </p>
        )}

        {/* Check-in Form */}
        <CheckInForm onSubmit={handleCheckIn} />

        {/* Mood Tracker */}
        <MoodTracker />

        {/* Progress Card */}
        {record && <ProgressCard record={record} risk={risk} />}

        {/* Coach Chat */}
        {tips.length > 0 && <CoachChat risk={risk} tips={tips} />}
      </div>
    </div>
  );
}
