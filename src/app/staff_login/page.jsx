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
import Link from "next/link";

export default function StaffLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loginMethod, setLoginMethod] = useState("staffId"); // 'staffId' or 'email'

  const {
    register,
    handleSubmit,
    formState: { errors },
    setValue,
  } = useForm();


useEffect(() => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("staff_token");
    if (token) router.push("/donation_form");
  }
}, [router]); // prevents infinite re-render


  const onSubmit = async (data) => {
    setLoading(true);
    try {
      console.log("📤 [Login] Attempting login...");

      // Prepare login data based on method
      const loginData =
        loginMethod === "staffId"
          ? { staffId: data.identifier, password: data.password }
          : { email: data.identifier, password: data.password };

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
    <main className="min-h-screen bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4 md:p-8">
      <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl p-6 md:p-10 w-full max-w-md border border-green-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
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

        {/* Login Method Toggle */}
        <div className="flex gap-2 mb-6 bg-gray-100 p-1 rounded-lg">
          <button
            type="button"
            onClick={() => {
              setLoginMethod("staffId");
              setValue("identifier", "");
            }}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
              loginMethod === "staffId"
                ? "bg-white text-green-700 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Staff ID
          </button>
          <button
            type="button"
            onClick={() => {
              setLoginMethod("email");
              setValue("identifier", "");
            }}
            className={`flex-1 py-2 rounded-md text-sm font-medium transition-all ${
              loginMethod === "email"
                ? "bg-white text-green-700 shadow-sm"
                : "text-gray-600 hover:text-gray-900"
            }`}
          >
            Email
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Identifier */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              {loginMethod === "staffId" ? (
                <>
                  <FiUser className="h-4 w-4 text-gray-500" />
                  Staff ID *
                </>
              ) : (
                <>
                  <FiMail className="h-4 w-4 text-gray-500" />
                  Email Address *
                </>
              )}
            </label>
            <input
              type={loginMethod === "email" ? "email" : "text"}
              {...register("identifier", {
                required: `${
                  loginMethod === "staffId" ? "Staff ID" : "Email"
                } is required`,
              })}
              placeholder={
                loginMethod === "staffId"
                  ? "Enter your staff ID"
                  : "you@example.com"
              }
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all"
            />
            {errors.identifier && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                <span>⚠️</span> {errors.identifier.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
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

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                {...register("remember")}
                className="h-4 w-4 text-green-500 rounded focus:ring-green-400 cursor-pointer"
              />
              <span className="text-sm text-gray-600 cursor-pointer">
                Remember me
              </span>
            </label>

            <button
              type="button"
              className="text-sm text-green-600 hover:text-green-700 font-medium"
              onClick={() =>
                toast.info(
                  "Please contact your administrator for password reset."
                )
              }
            >
              Forgot password?
            </button>
          </div>

          {/* Demo Credentials Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-3">
            <div className="flex items-start gap-2">
              <span className="text-blue-500">💡</span>
              <div className="text-xs text-blue-800">
                <p className="font-medium mb-1">Demo Credentials:</p>
                <p className="mb-1">
                  Staff ID:{" "}
                  <code className="bg-blue-100 px-2 py-1 rounded">
                    STAFF001
                  </code>
                </p>
                <p>
                  Password:{" "}
                  <code className="bg-blue-100 px-2 py-1 rounded">
                    password123
                  </code>
                </p>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col gap-4 pt-2">
            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold shadow-lg hover:from-green-600 hover:to-green-700 hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
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

            <div className="text-center">
              <Link
                href="/staff_registeration"
                className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 text-sm font-medium"
              >
                Don't have an account? Register here
                <FiArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </form>

        {/* Footer Note */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="text-center">
            <p className="text-sm text-gray-500 mb-2">
              For security reasons, please logout when finished
            </p>
            <div className="flex items-center justify-center gap-4 text-xs text-gray-400">
              <span>🔒 Secure Connection</span>
              <span>•</span>
              <span>📱 Mobile Friendly</span>
              <span>•</span>
              <span>⚡ Fast</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}


