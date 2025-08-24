import { useState } from "react";

export default function CheckInForm({ onSubmit }) {
  const [form, setForm] = useState({
    sleep: "",
    steps: "",
    water: "",
    stress: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
    setForm({ sleep: "", steps: "", water: "", stress: "" });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card p-6 max-w-2xl mx-auto w-full hover-scale transition-all duration-500"
    >
      <h2 className="text-lg font-bold mb-4 text-[#1c5284]">Daily Check-In</h2>

      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Sleep (hours)"
          name="sleep"
          value={form.sleep}
          onChange={handleChange}
        />
        <Input
          label="Steps"
          name="steps"
          value={form.steps}
          onChange={handleChange}
        />
        <Input
          label="Water (cups)"
          name="water"
          value={form.water}
          onChange={handleChange}
        />
        <Input
          label="Stress (1-5)"
          name="stress"
          value={form.stress}
          onChange={handleChange}
        />
      </div>

      <button
        type="submit"
        className="mt-6 w-full py-2 rounded-xl bg-[#1c5284] text-white font-semibold hover:scale-105 transition-all duration-300 ripple glow-hover"
      >
        Save Check-In
      </button>
    </form>
  );
}

function Input({ label, name, value, onChange }) {
  return (
    <div className="flex flex-col">
      <label className="text-sm font-medium opacity-70">{label}</label>
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        className="mt-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/60 dark:bg-black/30 backdrop-blur-sm focus:ring-2 focus:ring-[#39e240] outline-none transition-all duration-300"
      />
    </div>
  );
}
