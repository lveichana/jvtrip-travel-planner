// Login.jsx - sessionStorage + clear on typing
import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Plane, Eye, EyeOff } from "lucide-react";
import api from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Check for persisted error on mount
  useEffect(() => {
    const persistedError = sessionStorage.getItem('loginError');
    if (persistedError) {
      setError(persistedError);
    }
  }, []);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
    // Clear error when user starts typing
    if (error) {
      setError("");
      sessionStorage.removeItem('loginError');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    sessionStorage.removeItem('loginError');
    setLoading(true);

    try {
      const res = await api.post("/auth/login", form);
      sessionStorage.removeItem('loginError');
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      const errorMessage = err.response?.data?.message || err.response?.data?.error || "Invalid email or password";
      
      // Save error to sessionStorage
      sessionStorage.setItem('loginError', errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-cyan-50">
      <div className="w-full max-w-md bg-white shadow-xl rounded-2xl p-8">
        {/* Logo & Title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-gradient-to-br from-blue-500 to-cyan-400 rounded-xl mb-3">
            <Plane className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800">JVTrip</h2>
          <p className="text-gray-500 text-sm mt-1">Welcome back!</p>
        </div>

        {/* Error Message - Persists across HMR */}
        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg relative">
            <p className="text-red-600 text-sm pr-6">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="your@email.com"
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-cyan-500 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-cyan-600 transition shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-sm text-center text-gray-600 mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-600 hover:text-blue-700 font-semibold">
            Sign Up
          </Link>
        </p>
      </div>
    </div>
  );
}