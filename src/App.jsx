import { useState, useEffect } from "react";
import axios from 'axios';
import ProgressCard from "./components/ProgressCard.jsx";
import CheckInForm from "./components/CheckInForm.jsx";
import CoachChat from "./components/CoachChat.jsx";
import MoodTracker from "./components/MoodTracker.jsx";
import LoginForm from "./components/LoginForm.jsx";
import { computeRisk } from "./lib/risk.js";
import { useRiskModel } from "./ml/useRiskModel.js";

// Helper function to generate tips based on the user's data
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

  while (out.length < 3) {
    const pick = base[Math.floor(Math.random() * base.length)];
    if (!out.includes(pick)) out.push(pick);
  }

  if (risk === "High" && !out.some((t) => t.includes("breathing"))) {
    out.push("Schedule a short relaxation break this afternoon.");
  }

  return out.slice(0, 4);
}

export default function App() {
  const [record, setRecord] = useState(null);
  const [risk, setRisk] = useState("Low");
  const [tips, setTips] = useState([]);
  const [user, setUser] = useState(null);
  const [error, setError] = useState("");

  const { ready, status, predictRisk } = useRiskModel();

  // This useEffect is now only for generating tips when the risk changes
  useEffect(() => {
    if (!record) return;
    setTips(getTips(record, risk));
  }, [record, risk]);

  const handleLogin = (credentials) => {
    axios.post('http://localhost:5000/api/login', credentials)
      .then(res => {
        setUser(res.data);
        setError("");
      })
      .catch(() => {
        setError("Invalid credentials. Please try again.");
      });
  };

  const handleCheckIn = (data) => {
    const newRecord = { ...data, date: new Date().toLocaleDateString() };

    // --- FIX IS HERE ---
    // 1. Calculate the risk immediately
    const calculatedRisk = ready ? (predictRisk(newRecord) || computeRisk(newRecord)) : computeRisk(newRecord);

    // 2. Update all state at once for the UI
    setRecord(newRecord);
    setRisk(calculatedRisk); // Set the calculated risk for the UI

    // 3. Send the complete, correct data to the backend
    if (user) {
      axios.post('http://localhost:5000/api/checkin', {
          userId: user._id,
          ...newRecord,
          risk: calculatedRisk // Send the correct risk
        })
        .then(res => {
          setUser(res.data);
          console.log("Check-in saved to database.");
        })
        .catch(err => {
          console.error("Error saving check-in:", err);
          setError("Could not save your check-in data. Please try again later.");
          // We no longer revert the UI, to prevent the flicker.
        });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#e6e8ef] to-white dark:from-gray-900 dark:to-gray-950 text-gray-900 dark:text-gray-100 transition-colors duration-500">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <h1 className="text-3xl font-extrabold text-center text-[#1c5284] dark:text-[#39e240] animate-fade-in">
          🌱 Preventive Health Tracker
        </h1>

        {status !== "ready" && (
          <p className="text-sm text-gray-600 dark:text-gray-300 text-center">
            Training mini health model…
          </p>
        )}

        {!user ? (
          <div>
            <LoginForm onLogin={handleLogin} />
            {error && <p className="text-red-500 text-center mt-4">{error}</p>}
          </div>
        ) : (
          <>
            <p className="text-center text-lg">Welcome back, {user.name}!</p>
            <CheckInForm onSubmit={handleCheckIn} />
            <MoodTracker />
            {record && <ProgressCard record={record} risk={risk} />}
            {tips.length > 0 && <CoachChat risk={risk} tips={tips} />}
          </>
        )}
      </div>
    </div>
  );
}