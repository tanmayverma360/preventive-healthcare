import { useState } from "react";

// An SVG icon component for the input fields
const InputIcon = ({ children }) => (
  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
    {children}
  </div>
);

export default function LoginForm({ onLogin, error }) {
  const [email, setEmail] = useState("test@test.com");
  const [password, setPassword] = useState("password");

  const handleSubmit = (e) => {
    e.preventDefault();
    onLogin({ email, password });
  };

  return (
    <div className="flex flex-col md:flex-row bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden">
      {/* Left Side: Branding & Image */}
      <div className="md:w-1/2 p-8 bg-emerald-500 text-white flex flex-col justify-center items-center">
        <h1 className="text-4xl font-extrabold">🌱</h1>
        <h2 className="text-3xl font-bold mt-4">Stay Ahead of Your Health</h2>
        <p className="mt-2 text-emerald-100 text-center">
          Log your daily metrics to unlock personalized insights and trends.
        </p>
      </div>

      {/* Right Side: Form */}
      <div className="md:w-1/2 p-8 md:p-12">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white">Welcome Back</h2>
        <p className="text-gray-600 dark:text-gray-400">Please sign in to continue.</p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {/* Email Input */}
          <div className="relative">
            <InputIcon>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
              </svg>
            </InputIcon>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Password Input */}
          <div className="relative">
            <InputIcon>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </InputIcon>
            <input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>

          {/* Error Message */}
          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-emerald-500 text-white font-semibold hover:bg-emerald-600 transition duration-300"
          >
            Sign In
          </button>

          <div className="text-center text-sm text-gray-500">
            <a href="#" className="font-medium text-emerald-600 hover:text-emerald-500">
              Forgot password?
            </a>
          </div>
        </form>
      </div>
    </div>
  );
}