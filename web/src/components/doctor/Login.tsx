import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Mail,
  Lock,
  Stethoscope,
  AlertCircle,
  ArrowRight,
  Sparkles,
} from "lucide-react";

const BASE_URL = "https://5bd65bd753d5.ngrok-free.app";

export default function DoctorLogin() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [focusedInput, setFocusedInput] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`${BASE_URL}/api/auth/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: formData.email.toLowerCase().trim(),
          password: formData.password,
        }),
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (!response.ok) {
        throw new Error(
          data.detail ||
            data.message ||
            data.error ||
            "Invalid email or password"
        );
      }

      // Check if user is a doctor and account is approved
      if (data.user?.role !== "doctor") {
        setError(
          "This login is for doctors only. Please use the parent login."
        );
        setLoading(false);
        return;
      }

      // Save authentication data
      if (data.tokens?.access) {
        localStorage.setItem("doctorToken", data.tokens.access);
        localStorage.setItem("doctorRefreshToken", data.tokens.refresh);
      }
      localStorage.setItem("doctorLoggedIn", "true");
      localStorage.setItem("doctorEmail", data.user.email);
      localStorage.setItem("doctorName", data.user.full_name);
      localStorage.setItem("doctorData", JSON.stringify(data.user));

      console.log("Login successful, navigating to dashboard...");
      setLoading(false);

      // Redirect to doctor dashboard
      navigate("/doctor/dashboard");
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Please check your credentials.");
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-white to-amber-50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-orange-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"></div>
        <div
          className="absolute top-40 right-10 w-72 h-72 bg-amber-200 rounded-full mix-blend-multiply filter blur-xl opacity-30 animate-pulse"
          style={{ animationDelay: "1s" }}
        ></div>
        <div
          className="absolute -bottom-8 left-1/2 w-72 h-72 bg-orange-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-pulse"
          style={{ animationDelay: "2s" }}
        ></div>
      </div>

      <div className="w-full max-w-md relative z-10">
        {/* Logo and Title Section */}
        <div className="text-center mb-8 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl mb-4 shadow-lg shadow-orange-500/30 transform hover:scale-110 transition-transform duration-300 cursor-pointer">
            <Stethoscope className="w-10 h-10 text-white" />
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-2 flex items-center justify-center gap-2">
            Autism Specialist
            <Sparkles className="w-6 h-6 text-orange-500 animate-pulse" />
          </h1>
          <p className="text-gray-600 text-lg">
            Sign in to access your dashboard
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white/80 backdrop-blur-lg rounded-3xl shadow-2xl p-8 border border-orange-100 transform hover:shadow-orange-200/50 transition-all duration-300">
          {/* Error Alert */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-lg flex items-start gap-3 animate-shake">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Email Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                Email Address
                <span className="text-orange-500">*</span>
              </label>
              <div
                className={`relative transition-all duration-300 ${
                  focusedInput === "email" ? "transform scale-[1.02]" : ""
                }`}
              >
                <Mail
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                    focusedInput === "email"
                      ? "text-orange-500"
                      : "text-gray-400"
                  }`}
                  size={20}
                />
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  onFocus={() => setFocusedInput("email")}
                  onBlur={() => setFocusedInput("")}
                  className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                    focusedInput === "email"
                      ? "border-orange-500 bg-orange-50/50 shadow-lg shadow-orange-100"
                      : "border-gray-200 bg-white hover:border-orange-300"
                  }`}
                  placeholder="doctor@example.com"
                  required
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                Password
                <span className="text-orange-500">*</span>
              </label>
              <div
                className={`relative transition-all duration-300 ${
                  focusedInput === "password" ? "transform scale-[1.02]" : ""
                }`}
              >
                <Lock
                  className={`absolute left-4 top-1/2 transform -translate-y-1/2 transition-colors duration-300 ${
                    focusedInput === "password"
                      ? "text-orange-500"
                      : "text-gray-400"
                  }`}
                  size={20}
                />
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  onFocus={() => setFocusedInput("password")}
                  onBlur={() => setFocusedInput("")}
                  className={`w-full pl-12 pr-4 py-3.5 border-2 rounded-xl focus:outline-none transition-all duration-300 ${
                    focusedInput === "password"
                      ? "border-orange-500 bg-orange-50/50 shadow-lg shadow-orange-100"
                      : "border-gray-200 bg-white hover:border-orange-300"
                  }`}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {/* Remember me and Forgot password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="w-5 h-5 rounded border-2 border-gray-300 text-orange-600 focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 transition-all cursor-pointer"
                />
                <span className="text-sm text-gray-700 group-hover:text-orange-600 transition-colors">
                  Remember me
                </span>
              </label>
              <a
                href="/forgot-password"
                className="text-sm font-semibold text-orange-600 hover:text-orange-700 hover:underline transition-all"
              >
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-orange-500 to-orange-600 text-white py-4 rounded-xl font-semibold hover:from-orange-600 hover:to-orange-700 focus:outline-none focus:ring-4 focus:ring-orange-300 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-orange-500/30 hover:shadow-xl hover:shadow-orange-500/40 flex items-center justify-center gap-2 group"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-3 border-white border-t-transparent rounded-full animate-spin"></div>
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </button>
          </form>

          {/* Signup Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{" "}
              <a
                href="/doctor/signup"
                className="font-semibold text-orange-600 hover:text-orange-700 hover:underline transition-all"
              >
                Sign up here
              </a>
            </p>
          </div>
        </div>

        {/* Security Badge */}
        <div className="mt-6 text-center">
          <p className="text-xs text-gray-500 flex items-center justify-center gap-2">
            <Lock className="w-3.5 h-3.5 text-orange-500" />
            Protected by industry-standard encryption
          </p>
        </div>
      </div>

      <style>{`
        @keyframes fade-in {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes shake {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-5px);
          }
          75% {
            transform: translateX(5px);
          }
        }

        .animate-fade-in {
          animation: fade-in 0.6s ease-out;
        }

        .animate-shake {
          animation: shake 0.4s ease-in-out;
        }
      `}</style>
    </div>
  );
}
