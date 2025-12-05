// "use client";

// import { useState, useEffect } from "react";
// import { useRouter } from "next/navigation";
// import { toast } from "react-hot-toast";
// import {
//   FiUser,
//   FiLock,
//   FiArrowRight,
//   FiEye,
//   FiEyeOff,
//   FiShield,
// } from "react-icons/fi";

// export default function AdminLogin() {
//   const router = useRouter();
//   const [loading, setLoading] = useState(false);
//   const [showPassword, setShowPassword] = useState(false);
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });

//   useEffect(() => {
//     if (typeof window !== "undefined") {
//       const token = localStorage.getItem("admin_token");
//       if (token) router.push("/admin_dashboard");
//     }
//   }, [router]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);

//     try {
//       console.log("🔐 [Admin Login] Attempting login...");

//       // Use the staff login API
//       const response = await fetch("/api/admin/login", {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({
//           email: formData.email,
//           password: formData.password,
//         }),
//       });
//       console.log("📥 [Admin Login] Response status:", response.status);

//       const result = await response.json();
//       console.log("📥 [Admin Login] Response data:", result);
//       if (typeof window !== "undefined") {
//         localStorage.setItem("admin_token", result.data.token);
//         localStorage.setItem("admin_user", JSON.stringify(result.data.admin));
//         console.log("✅ Token stored in localStorage");
//       }
//       if (!response.ok) {
//         throw new Error(result.error || "Invalid email or password");
//       }

//       // Check if the user is actually an admin
//       if (result.data.staff.role !== "admin") {
//         throw new Error("Admin access required. Please use admin credentials.");
//       }

//       toast.success("Admin login successful! 🎉");
//       console.log("✅ [Admin Login] Admin data stored, redirecting...");

//       // Redirect to admin dashboard
//       setTimeout(() => {
//         router.push("/admin_dashboard");
//       }, 1000);
//     } catch (error) {
//       console.error("❌ [Admin Login] Error:", error);
//       toast.error(error.message || "Login failed");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4 md:p-8">
//       <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl p-6 md:p-10 w-full max-w-md border border-red-100">
//         {/* Header */}
//         <div className="text-center mb-8">
//           <div className="flex items-center justify-center gap-3 mb-4">
//             <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
//               <FiShield className="h-6 w-6 text-white" />
//             </div>
//             <div>
//               <h1 className="text-2xl md:text-3xl font-bold text-red-700">
//                 Admin Login
//               </h1>
//               <p className="text-sm text-gray-500 mt-1">
//                 Kanul Riza Admin Panel
//               </p>
//             </div>
//           </div>

//           <p className="text-gray-600 text-sm mb-2">
//             Restricted access for administrators only
//           </p>
//           <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs">
//             <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
//             Secure Admin Access
//           </div>
//         </div>

//         {/* Form */}
//         <form onSubmit={handleSubmit} className="space-y-5">
//           {/* Email */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//               <FiUser className="h-4 w-4 text-gray-500" />
//               Admin Email *
//             </label>
//             <input
//               type="email"
//               value={formData.email}
//               onChange={(e) =>
//                 setFormData({ ...formData, email: e.target.value })
//               }
//               placeholder="admin@kanulriza.org"
//               className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all"
//               required
//             />
//           </div>

//           {/* Password */}
//           <div>
//             <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
//               <FiLock className="h-4 w-4 text-gray-500" />
//               Password *
//             </label>
//             <div className="relative">
//               <input
//                 type={showPassword ? "text" : "password"}
//                 value={formData.password}
//                 onChange={(e) =>
//                   setFormData({ ...formData, password: e.target.value })
//                 }
//                 placeholder="Enter your password"
//                 className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all pr-12"
//                 required
//               />
//               <button
//                 type="button"
//                 onClick={() => setShowPassword(!showPassword)}
//                 className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
//               >
//                 {showPassword ? (
//                   <FiEyeOff className="h-5 w-5" />
//                 ) : (
//                   <FiEye className="h-5 w-5" />
//                 )}
//               </button>
//             </div>
//           </div>

//           {/* Security Notice */}
//           <div className="bg-red-50 border border-red-200 rounded-xl p-4">
//             <div className="flex items-start gap-2">
//               <span className="text-red-500">⚠️</span>
//               <div className="text-xs text-red-800">
//                 <p className="font-medium mb-1">Security Notice:</p>
//                 <p>
//                   This is a restricted area. Only authorized administrators may
//                   access this panel.
//                 </p>
//               </div>
//             </div>
//           </div>

//           {/* Login Button */}
//           <button
//             type="submit"
//             disabled={loading}
//             className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow-lg hover:from-red-600 hover:to-red-700 hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
//           >
//             {loading ? (
//               <>
//                 <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
//                 Verifying...
//               </>
//             ) : (
//               <>
//                 <FiArrowRight className="h-4 w-4" />
//                 Login to Admin Panel
//               </>
//             )}
//           </button>

//           {/* Back to Staff Login */}
//           <div className="text-center pt-4 border-t border-gray-200">
//             <button
//               type="button"
//               onClick={() => router.push("/admin_registration")}
//               className="text-sm text-gray-600 hover:text-gray-800"
//             >
//               ← Do not have account, Create new Account
//             </button>
//           </div>
//         </form>
//       </div>
//     </main>
//   );
// }

"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  FiUser,
  FiLock,
  FiArrowRight,
  FiEye,
  FiEyeOff,
  FiShield,
} from "react-icons/fi";

export default function AdminLogin() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  // If already logged in → redirect to admin dashboard
  useEffect(() => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("admin_token");
      if (token) router.push("/admin_dashboard");
    }
  }, [router]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("🔐 Admin Login Attempt…");

      const response = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const result = await response.json();
      console.log("📥 API Response:", result);

      if (!response.ok) {
        throw new Error(result.error || "Invalid email or password");
      }

      // Store token + admin data
      if (typeof window !== "undefined") {
        localStorage.setItem("admin_token", result.data.token);
        localStorage.setItem("admin_user", JSON.stringify(result.data.admin));
      }

      // Validate the role correctly
      if (result.data.admin.role !== "admin") {
        throw new Error("Admin access only. Use admin credentials.");
      }

      toast.success("Admin login successful! 🎉");
      console.log("✅ Admin authenticated. Redirecting…");

      setTimeout(() => router.push("/admin_dashboard"), 1000);
    } catch (error) {
      console.error("❌ Login Error:", error);
      toast.error(error.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-red-50 via-white to-red-50 flex items-center justify-center p-4 md:p-8">
      <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl p-6 md:p-10 w-full max-w-md border border-red-100">
        
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-red-500 to-red-600 flex items-center justify-center">
              <FiShield className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-red-700">
                Admin Login
              </h1>
              <p className="text-sm text-gray-500 mt-1">
                Kanul Riza Admin Panel
              </p>
            </div>
          </div>

          <p className="text-gray-600 text-sm mb-2">
            Restricted access for administrators only
          </p>
          <div className="inline-flex items-center gap-2 bg-red-50 text-red-700 px-3 py-1 rounded-full text-xs">
            <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse"></span>
            Secure Admin Access
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FiUser className="h-4 w-4 text-gray-500" />
              Admin Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              placeholder="admin@kanulriza.org"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all"
              required
            />
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
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Enter your password"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-red-400 focus:border-red-400 transition-all pr-12"
                required
              />

              {/* Toggle Button */}
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? (
                  <FiEyeOff className="h-5 w-5" />
                ) : (
                  <FiEye className="h-5 w-5" />
                )}
              </button>
            </div>
          </div>

          {/* Security Notice */}
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-start gap-2">
              <span className="text-red-500">⚠️</span>
              <div className="text-xs text-red-800">
                <p className="font-medium mb-1">Security Notice:</p>
                <p>Only authorized administrators may access this panel.</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full px-6 py-3 rounded-xl bg-gradient-to-r from-red-500 to-red-600 text-white font-semibold shadow-lg hover:from-red-600 hover:to-red-700 hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                Verifying...
              </>
            ) : (
              <>
                <FiArrowRight className="h-4 w-4" />
                Login to Admin Panel
              </>
            )}
          </button>

          {/* Registration Link */}
          <div className="text-center pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={() => router.push("/admin_registration")}
              className="text-sm text-gray-600 hover:text-gray-800"
            >
              ← No account? Create a new Admin
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
