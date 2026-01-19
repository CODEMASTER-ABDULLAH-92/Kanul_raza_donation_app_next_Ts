"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { FiUser, FiMail, FiPhone, FiLock, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

export default function StaffRegistration() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm();
  const password = watch("password", "");

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("staff_token");
      if (token) router.push("/donation_form");
    }
  }, [router]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      console.log("📤 [Staff Register] Sending registration data:", data);

      const response = await fetch("/api/staff/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      console.log("📥 [Staff Register] Response status:", response.status);

      const result = await response.json();
      console.log("📥 [Staff Register] Response data:", result);

      if (!response.ok) {
        const errorMessage = result.error || result.message || "Registration failed";
        throw new Error(errorMessage);
      }

      toast.success("Staff registered successfully! 🎉");

      localStorage.setItem("user", JSON.stringify(result.data.staff));
      localStorage.setItem("staff_token", result.data.token);

      console.log("✅ [Staff Register] Registration successful, redirecting...");

      setTimeout(() => {
        router.push("/donation_form");
      }, 1500);
    } catch (error) {
      console.error("❌ [Staff Register] Error:", error);
      console.error("❌ [Staff Register] Full error:", error);
      toast.error(`Registration error: ${error.message}`);
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
            <div className="h-12 w-12 rounded-xl from-green-500 to-green-600 flex items-center justify-center">
              <FiUser className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-green-700">
                Staff Registration
              </h1>
              <p className="text-sm text-gray-500 mt-1">Create a new staff account</p>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-2">
            Register to access the donation collection system
          </p>
          <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs">
            <span className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></span>
            Secure Registration
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Full Name */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FiUser className="h-4 w-4 text-gray-500" />
              Full Name *
            </label>
            <input
              type="text"
              {...register("name", {
                required: "Full name is required",
                minLength: { value: 3, message: "At least 3 characters" },
              })}
              placeholder="Enter your full name"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                ⚠️ {errors.name.message}
              </p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FiMail className="h-4 w-4 text-gray-500" />
              Email *
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
                ⚠️ {errors.email.message}
              </p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FiPhone className="h-4 w-4 text-gray-500" />
              Phone Number *
            </label>
            <input
              type="text"
              {...register("phone", {
                required: "Phone number is required",
                minLength: { value: 10, message: "Invalid phone number" },
              })}
              placeholder="03XXXXXXXXX"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                ⚠️ {errors.phone.message}
              </p>
            )}
          </div>

          {/* Password */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FiLock className="h-4 w-4 text-gray-500" />
              Password *
            </label>
            <input
              type="password"
              {...register("password", {
                required: "Password is required",
                minLength: { value: 6, message: "Minimum 6 characters" },
              })}
              placeholder="Create a password"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all"
            />
            {errors.password && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                ⚠️ {errors.password.message}
              </p>
            )}
          </div>

          {/* Confirm Password */}
          <div>
            <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FiLock className="h-4 w-4 text-gray-500" />
              Confirm Password *
            </label>
            <input
              type="password"
              {...register("confirmPassword", {
                required: "Please confirm your password",
                validate: (value) =>
                  value === password || "Passwords do not match",
              })}
              placeholder="Re-enter password"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all"
            />
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600 flex items-center gap-1">
                ⚠️ {errors.confirmPassword.message}
              </p>
            )}
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 rounded-xl bg-linear-to-r from-green-500 to-green-600 text-white font-semibold shadow-lg hover:from-green-600 hover:to-green-700 hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Registering...
              </>
            ) : (
              <>
                Create Account <FiArrowLeft className="h-4 w-4 rotate-180" />
              </>
            )}
          </button>

          {/* Login redirect */}
          <div className="text-center">
            <Link
              href="/staff_login"
              className="inline-flex items-center gap-2 text-green-600 hover:text-green-700 text-sm font-medium"
            >
              Already have an account? Login
              <FiArrowLeft className="h-4 w-4 rotate-180" />
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}