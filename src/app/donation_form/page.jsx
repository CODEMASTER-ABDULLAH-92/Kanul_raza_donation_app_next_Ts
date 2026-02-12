"use client";
import { useEffect, useState } from "react";
import { redirect, } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import {
  FiUser,
  FiMail,
  FiDollarSign,
  FiBook,
  FiHome,
  FiSend,
  FiX,
  FiClock,
  FiFileText,
} from "react-icons/fi";
import {
  FaMosque,
  FaSchool,
  FaBook,
  FaBuilding,
  FaShoppingBasket,
  FaUtensils,
  FaHandHoldingHeart,
} from "react-icons/fa";

export default function DonationForm() {
  const [loading, setLoading] = useState(false);
  const [sendEmail, setSendEmail] = useState(true);
  const [user, setUser] = useState(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm();

  const charityTypes = [
    {
      value: "sadaqah",
      label: "Sadaqah",
      icon: <FaHandHoldingHeart className="text-green-500" />,
      description: "Voluntary charity"
    },
    {
      value: "zakat",
      label: "Zakat",
      icon: <FiBook className="text-blue-500" />,
      description: "Obligatory charity"
    },
    {
      value: "general",
      label: "General Donation",
      icon: <FiDollarSign className="text-yellow-500" />,
      description: "General charitable fund"
    },
  ];

  const charityCategories = [
    {
      value: "boys_madrasa",
      label: "Boys Madrasa",
      icon: <FaSchool className="text-blue-600" />,
      description: "Islamic education for boys"
    },
    {
      value: "girls_madrasa",
      label: "Girls Madrasa",
      icon: <FaSchool className="text-pink-600" />,
      description: "Islamic education for girls"
    },
    {
      value: "masjid",
      label: "Masjid Construction",
      icon: <FaMosque className="text-green-600" />,
      description: "Mosque building and maintenance"
    },
    {
      value: "islamic_books",
      label: "Islamic Books",
      icon: <FaBook className="text-yellow-600" />,
      description: "Printing and distribution"
    },
    {
      value: "construction",
      label: "Construction Work",
      icon: <FaBuilding className="text-orange-600" />,
      description: "Building projects"
    },
    {
      value: "ration",
      label: "Poor Families Support",
      icon: <FaShoppingBasket className="text-red-500" />,
      description: "Monthly ration distribution"
    },
    {
      value: "food_distribution",
      label: "Food Distribution",
      icon: <FaUtensils className="text-emerald-500" />,
      description: "Daily food for needy"
    },
  ];

  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("staff_token");
      if (!token) return redirect("/staff_login");

      const userData = JSON.parse(localStorage.getItem("user") || "{}");
      setUser(userData);
      
      // Set default form values
      reset({
        phone: "",
        email: "",
        donorName: "",
        amount: "",
        notes: "",
      });
    }
  }, [reset]);

const onSubmit = async (data) => {
  setLoading(true);

  try {
    // ✅ FIX: correct key
    const token = localStorage.getItem("staff_token");

    console.log("🧪 TOKEN:", token);

    if (!token || token.split(".").length !== 3) {
      throw new Error("Session expired. Please login again.");
    }

    const donationData = {
      donorName: data.donorName,
      email: data.email,
      phone: data.phone,
      amount: Number(data.amount),
      charityType: data.charityType,
      category: data.category,
      notes: data.notes || "",
      sendEmail,
    };

    const response = await fetch("/api/addData", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`, // ✅ NOW VALID JWT
      },
      body: JSON.stringify(donationData),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error);
    }

    toast.success("Donation recorded successfully");

  } catch (error) {
    console.error("Donation submission error:", error);
    toast.error(error.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <main className="min-h-screen bg-linear-to-br from-green-50 via-white to-blue-50 flex items-center justify-center p-4 md:p-8">
      <div className="bg-white/95 backdrop-blur-sm shadow-2xl rounded-2xl p-6 md:p-8 w-full max-w-4xl border border-green-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-linear-to-r from-green-500 to-emerald-600 flex items-center justify-center shadow-lg">
              <FaHandHoldingHeart className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Donation Collection Form
              </h1>
              <p className="text-gray-600 mt-1">Record New Donation</p>
            </div>
          </div>

          {/* Staff Info */}
          <div className="inline-flex items-center gap-3 bg-linear-to-r from-green-50 to-emerald-50 px-4 py-3 rounded-xl border border-green-200 mb-4">
            <div className="h-10 w-10 rounded-full bg-linear-to-r from-green-400 to-emerald-500 flex items-center justify-center">
              <FiUser className="h-5 w-5 text-white" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-800">{user?.name || "Staff Member"}</p>
              <p className="text-sm text-gray-600 flex items-center gap-1">
                <FiMail className="h-3 w-3" />
                {user?.email || "staff@example.com"}
              </p>
            </div>
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          </div>

          {/* Stats Bar */}
          <div className="flex items-center justify-center gap-6 text-sm text-gray-600">
            <div className="flex items-center gap-2">
              <FiClock className="h-4 w-4 text-green-500" />
              <span>{new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}</span>
            </div>
            <div className="w-px h-4 bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <FiFileText className="h-4 w-4 text-blue-500" />
              <span>Form ID: DON-{new Date().getTime().toString().slice(-6)}</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Donor Information */}
          <div className="bg-linear-to-r from-emerald-50 to-green-50 p-6 rounded-xl border border-green-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-green-100 flex items-center justify-center">
                <FiUser className="h-4 w-4 text-green-600" />
              </div>
              Donor Information
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Donor Name */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  {...register("donorName", {
                    required: "Donor name is required",
                    minLength: {
                      value: 3,
                      message: "Name must be at least 3 characters",
                    },
                  })}
                  placeholder="Enter donor's full name"
                  className="w-full p-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 transition-all bg-white"
                />
                {errors.donorName && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                    <span className="text-red-500">•</span> {errors.donorName.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
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
                  placeholder="donor@example.com"
                  className="w-full p-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 transition-all bg-white"
                />
                {errors.email && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                    <span className="text-red-500">•</span> {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  {...register("phone", {
                    required: "Phone number is required",
                    pattern: {
                      value: /^03[0-9]{9}$/,
                      message: "Enter valid number (03XXXXXXXXX)",
                    },
                  })}
                  placeholder="03XXXXXXXXX"
                  className="w-full p-3.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 transition-all bg-white"
                />
                {errors.phone && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                    <span className="text-red-500">•</span> {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Amount */}
              <div>
                <label className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  Amount (PKR) *
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-600 font-medium">
                    PKR
                  </span>
                  <input
                    type="number"
                    // step="0.01"
                    {...register("amount", {
                      required: "Amount is required",
                      min: { value: 1, message: "Minimum donation is PKR 1" },
                      max: { value: 100000000, message: "Maximum donation is PKR 100,000,000" }
                    })}
                    placeholder="Enter amount"
                    className="w-full p-3.5 pl-14 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 transition-all bg-white"
                  />
                </div>
                {errors.amount && (
                  <p className="mt-1.5 text-sm text-red-600 flex items-center gap-1">
                    <span className="text-red-500">•</span> {errors.amount.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Charity Details */}
          <div className="bg-linear-to-r from-blue-50 to-sky-50 p-6 rounded-xl border border-blue-100 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-blue-100 flex items-center justify-center">
                <FiHome className="h-4 w-4 text-blue-600" />
              </div>
              Charity Details
            </h2>

            {/* Charity Type */}
            <div className="mb-6">
              <label className="text-sm font-medium text-gray-700 mb-3 block">
                Type of Charity *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {charityTypes.map((type) => (
                  <div key={type.value} className="relative">
                    <input
                      type="radio"
                      id={`type-${type.value}`}
                      value={type.value}
                      {...register("charityType", {
                        required: "Please select charity type",
                      })}
                      className="hidden peer"
                    />
                    <label
                      htmlFor={`type-${type.value}`}
                      className="flex items-start gap-3 p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-emerald-300 hover:bg-white peer-checked:border-emerald-500 peer-checked:bg-emerald-50 transition-all duration-200"
                    >
                      <div className="h-10 w-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                        {type.icon}
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">{type.label}</p>
                        <p className="text-xs text-gray-500 mt-1">{type.description}</p>
                      </div>
                    </label>
                  </div>
                ))}
              </div>
              {errors.charityType && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <span className="text-red-500">•</span> {errors.charityType.message}
                </p>
              )}
            </div>

            {/* Charity Category */}
            <div>
              <label className="text-sm font-medium text-gray-700 mb-3 block">
                Donation Category *
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                {charityCategories.map((category) => (
                  <div key={category.value} className="relative">
                    <input
                      type="radio"
                      id={`category-${category.value}`}
                      value={category.value}
                      {...register("category", {
                        required: "Please select category",
                      })}
                      className="hidden peer"
                    />
                    <label
                      htmlFor={`category-${category.value}`}
                      className="flex flex-col items-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 hover:bg-white peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-all duration-200"
                    >
                      <div className="mb-2 h-10 w-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center">
                        {category.icon}
                      </div>
                      <p className="font-medium text-gray-900 text-center">{category.label}</p>
                      <p className="text-xs text-gray-500 text-center mt-1">{category.description}</p>
                    </label>
                  </div>
                ))}
              </div>
              {errors.category && (
                <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                  <span className="text-red-500">•</span> {errors.category.message}
                </p>
              )}
            </div>
          </div>

          {/* Notes */}
          <div className="bg-linear-to-r from-gray-50 to-gray-100 p-6 rounded-xl border border-gray-200 shadow-sm">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              <div className="h-8 w-8 rounded-lg bg-gray-100 flex items-center justify-center">
                <FiFileText className="h-4 w-4 text-gray-600" />
              </div>
              Additional Notes
            </h2>
            <textarea
              {...register("notes")}
              placeholder="Any special instructions, preferences, or additional details about this donation..."
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-400 h-32 resize-none transition-all bg-white"
              rows={4}
            />
          </div>

          {/* Email Notification */}
          <div className="bg-linear-to-r from-purple-50 to-indigo-50 p-6 rounded-xl border border-purple-100 shadow-sm">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className={`h-12 w-12 rounded-lg flex items-center justify-center ${sendEmail ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'}`}>
                  <FiMail className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">Send Email Receipt</h3>
                  <p className="text-sm text-gray-600">Donor will receive confirmation email</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSendEmail(!sendEmail)}
                className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${sendEmail ? 'bg-green-500' : 'bg-gray-300'}`}
              >
                <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${sendEmail ? 'translate-x-6' : 'translate-x-1'}`} />
              </button>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="button"
              onClick={() => {
                if (confirm("Clear all form data?")) {
                  reset({
                    phone: "",
                    email: "",
                    donorName: "",
                    amount: "",
                    notes: "",
                  });
                  setSendEmail(true);
                  toast.success("Form cleared");
                }
              }}
              className="px-6 py-3.5 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all flex-1 flex items-center justify-center gap-2 disabled:opacity-50"
              disabled={loading}
            >
              <FiX className="h-4 w-4" />
              Clear Form
            </button>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3.5 rounded-xl bg-linear-to-r from-emerald-500 to-green-600 text-white font-bold shadow-lg hover:from-emerald-600 hover:to-green-700 hover:shadow-xl active:scale-[0.98] transition-all flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing Donation...
                </>
              ) : (
                <>
                  <FiSend className="h-5 w-5" />
                  Submit Donation
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 text-sm text-gray-600">
            <div>
              <p className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-green-500"></span>
                All donations are securely recorded
              </p>
            </div>
            <div className="flex items-center gap-6 text-xs text-gray-500">
              <span>Version 2.0</span>
              <span>•</span>
              <span>Secure Connection</span>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}