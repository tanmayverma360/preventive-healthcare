import { useState, useEffect } from "react";
import axios from 'axios';
import ProgressCard from "./components/ProgressCard.jsx";
import CheckInForm from "./components/CheckInForm.jsx";
import CoachChat from "./components/CoachChat.jsx";
import MoodTracker from "./components/MoodTracker.jsx";
import LoginForm from "./components/LoginForm.jsx";
import TrendChart from "./components/TrendChart.jsx";
import Tabs from "./components/Tabs.jsx";
import NutritionForm from "./components/NutritionForm.jsx";
import NutritionLog from "./components/NutritionLog.jsx";
import { computeRisk } from "./lib/risk.js";
import { useRiskModel } from "./ml/useRiskModel.js";

function getTips(record, risk) {
    if (!record) return [];
    const base = ["Drink a glass of water every 2 hours today.", "Take a 10-minute walk after meals.", "Aim for 7–8 hours of sleep; reduce screens 1 hour before bed.", "Do 4-7-8 breathing for 2 minutes to lower stress.", "Choose fiber-rich foods and avoid sugary snacks today.",];
    const out = [];
    if (record.sleep < 7) out.push("Try to get at least 7–8 hours of sleep tonight.");
    if (record.water < 8) out.push("Drink more water to stay hydrated.");
    if (record.steps < 5000) out.push("Aim for a short walk or stretch break.");
    if (record.stress > 3) out.push("Practice deep breathing or a 5-min meditation.");
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
    const [historicalData, setHistoricalData] = useState([]);
    const [nutritionData, setNutritionData] = useState([]);
    const [activeTab, setActiveTab] = useState('Dashboard');

    const { ready, status, predictRisk } = useRiskModel();

    useEffect(() => {
        if (!record) return;
        setTips(getTips(record, risk));
    }, [record, risk]);

    useEffect(() => {
        if (user) {
            axios.get(`http://localhost:5000/api/healthdata/${user._id}`)
                .then(res => setHistoricalData(res.data))
                .catch(err => console.error("Could not fetch historical data:", err));

            axios.get(`http://localhost:5000/api/nutrition/${user._id}`)
                .then(res => setNutritionData(res.data))
                .catch(err => console.error("Could not fetch nutrition data:", err));
        }
    }, [user]);

    const handleLogin = (credentials) => {
        axios.post('http://localhost:5000/api/login', credentials)
            .then(res => setUser(res.data))
            .catch(() => setError("Invalid credentials."));
    };

    const handleCheckIn = (data) => {
        const newRecord = { ...data, date: new Date().toISOString() };
        const calculatedRisk = ready ? (predictRisk(newRecord) || computeRisk(newRecord)) : computeRisk(newRecord);
        setRecord(newRecord);
        setRisk(calculatedRisk);

        if (user) {
            axios.post('http://localhost:5000/api/checkin', { userId: user._id, ...newRecord, risk: calculatedRisk })
                .then(res => {
                    setHistoricalData(prevData => [...prevData, newRecord]);
                    setUser(res.data);
                    setActiveTab('Dashboard');
                })
                .catch(err => console.error("Error saving check-in:", err));
        }
    };

    const handleAddMeal = (mealData) => {
        const newMeal = { ...mealData, date: new Date().toISOString() };
        setNutritionData(prevData => [...prevData, newMeal]);

        if (user) {
            axios.post('http://localhost:5000/api/nutrition', { userId: user._id, ...newMeal })
                .then(res => {
                    console.log("Meal saved to database.");
                })
                .catch(err => {
                    console.error("Error saving meal:", err);
                    setNutritionData(prevData => prevData.filter(m => m.date !== newMeal.date));
                });
        }
    };

    const tabs = [
        { name: 'Dashboard' },
        { name: 'Trends' },
        { name: 'Nutrition' },
        { name: 'Log Today' },
    ];

    if (!user) {
        return (
            <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4">
                <div className="w-full max-w-4xl">
                    <LoginForm onLogin={handleLogin} error={error} />
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen">
            <div className="container mx-auto px-4 py-8">
                <header className="text-center mb-8">
                    <h1 className="text-4xl font-extrabold text-gray-800 dark:text-white">
                        🌱 Preventive Health Tracker
                    </h1>
                    <p className="text-lg text-gray-500 mt-2">Welcome back, {user.name}!</p>
                </header>

                <main>
                    <Tabs tabs={tabs} activeTab={activeTab} setActiveTab={setActiveTab} />
                    <div className="space-y-6">
                        {activeTab === 'Dashboard' && (
                            <>
                                {record ? (
                                    <>
                                        <ProgressCard record={record} risk={risk} />
                                        <CoachChat risk={risk} tips={tips} />
                                    </>
                                ) : (
                                    <div className="glass-card p-6 text-center">
                                        <p className="opacity-70">You haven't logged your data for today yet.</p>
                                        <button onClick={() => setActiveTab('Log Today')} className="mt-4 px-4 py-2 bg-emerald-500 text-white rounded-lg font-semibold">
                                            Log Today
                                        </button>
                                    </div>
                                )}
                            </>
                        )}

                        {activeTab === 'Trends' && (
                            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                <TrendChart historicalData={historicalData} metric="stress" title="Stress Trend" color="#ef4444" />
                                <TrendChart historicalData={historicalData} metric="sleep" title="Sleep Trend" color="#3b82f6" />
                                <TrendChart historicalData={historicalData} metric="steps" title="Steps Trend" color="#10b981" />
                                <TrendChart historicalData={historicalData} metric="water" title="Water Intake Trend" color="#6366f1" />
                            </div>
                        )}

                        {activeTab === 'Nutrition' && (
                            <>
                                <NutritionForm onAddMeal={handleAddMeal} />
                                <NutritionLog meals={nutritionData} />
                            </>
                        )}

                        {activeTab === 'Log Today' && (
                            <>
                                <CheckInForm onSubmit={handleCheckIn} />
                                <MoodTracker onSelect={(mood) => console.log("Mood selected:", mood)} />
                            </>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
} // <-- This was the missing closing brace.