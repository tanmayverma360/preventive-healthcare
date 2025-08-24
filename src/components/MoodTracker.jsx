import { useState } from "react";

const moods = [
  { label: "😊 Happy", value: "happy" },
  { label: "😐 Neutral", value: "neutral" },
  { label: "😔 Sad", value: "sad" },
  { label: "😡 Stressed", value: "stressed" },
];

export default function MoodTracker({ onSelect }) {
  const [selected, setSelected] = useState(null);

  const handleSelect = (mood) => {
    setSelected(mood.value);
    onSelect(mood.value);
  };

  return (
    <div className="glass-card p-6 max-w-2xl mx-auto w-full hover-scale transition-all duration-500">
      <h2 className="text-lg font-bold mb-4 text-[#1c5284]">
        How are you feeling today?
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {moods.map((mood) => (
          <button
            key={mood.value}
            onClick={() => handleSelect(mood)}
            className={`p-4 rounded-xl font-medium transition-all duration-300 hover-scale glow-hover ripple ${
              selected === mood.value
                ? "bg-[#39e240] text-white shadow-lg shadow-[#39e240]/50"
                : "bg-white/60 dark:bg-black/30"
            }`}
          >
            {mood.label}
          </button>
        ))}
      </div>
    </div>
  );
}
