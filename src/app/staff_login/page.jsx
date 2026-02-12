"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import {
  FiUser,
  FiMail,
  FiLock,
  FiArrowRight,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";
export default function StaffLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("staff_token");
      if (token) router.push("/donation_form");
    }
  }, [router]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      console.log("📤 [Login] Attempting login...");

      // Login data - only email now
      const loginData = {
        email: data.email,
        password: data.password
      };

      console.log("📤 [Login] Sending data:", loginData);

      const response = await fetch("/api/staff/Login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      console.log("📥 [Login] Response status:", response.status);

      const result = await response.json();
      console.log("📥 [Login] Response data:", result);

      if (!response.ok) {
        throw new Error(result.error || "Login failed");
      }

      toast.success("Login successful! 🎉");

      // Store user data and token
      localStorage.setItem("user", JSON.stringify(result.data.staff));
      localStorage.setItem("staff_token", result.data.token);

      console.log("✅ [Login] User data stored, redirecting...");

      // Redirect to dashboard
      setTimeout(() => {
        router.push("/donation_form");
      }, 1000);
    } catch (error) {
      console.error("❌ [Login] Error:", error);
      toast.error(
        error.message || "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-linear-to-r from-green-50 via-white to-green-50 flex items-center justify-center p-4 md:p-8">
      <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl p-6 md:p-10 w-full max-w-md border border-green-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-linear-to-r from-green-500 to-green-600 flex items-center justify-center">
              <FiUser className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-green-700">
                Staff Login
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Donation Collection System
              </p>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-2">
            Access the donation collection system with your credentials
          </p>
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            Secure Login
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FiMail className="h-4 w-4 text-gray-500" />
              Email Address *
            </label>
            <input
              type="email"
              {...register("email", {
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address",
                },
              })}
              placeholder="you@example.com"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <span>⚠️</span> {errors.email.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FiLock className="h-4 w-4 text-gray-500" />
              Password *
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                {...register("password", {
                  required: "Password is required",
                  minLength: {
                    value: 6,
                    message: "Password must be at least 6 characters",
                  },
                })}
                placeholder="Enter your password"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <FiEyeOff className="h-5 w-5" />
                ) : (
                  <FiEye className="h-5 w-5" />
                )}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <span>⚠️</span> {errors.password.message}
              </p>
            )}
          </div>



          {/* Form Actions */}
          <div className="flex flex-col gap-4 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 rounded-xl bg-linear-to-r from-green-500 to-green-600 text-white font-semibold shadow-lg hover:from-green-600 hover:to-green-700 hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Logging in...
                </>
              ) : (
                <>
                  <FiArrowRight className="h-4 w-4" />
                  Login to Dashboard
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}