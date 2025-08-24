import { useState } from "react";

export default function LoginForm({ onLogin }) {
  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState("password");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ email, password });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="glass-card p-6 max-w-2xl mx-auto w-full"
    >
      <h2 className="text-lg font-bold mb-4 text-[#1c5284]">Login</h2>
      <div className="grid grid-cols-1 gap-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/60 dark:bg-black/30"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 px-3 py-2 rounded-lg border border-gray-300 dark:border-gray-700 bg-white/60 dark:bg-black/30"
        />
      </div>
      <button
        type="submit"
        className="mt-6 w-full py-2 rounded-xl bg-[#1c5284] text-white font-semibold"
      >
        Login
      </button>
    </form>
  );
}