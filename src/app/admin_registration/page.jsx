"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { 
  FiUser, FiMail, FiPhone, FiLock, FiArrowLeft, FiShield,
  FiUserPlus, FiKey, FiCheckCircle, FiEye, FiEyeOff
} from "react-icons/fi";
import Link from "next/link";

export default function AdminRegistrationPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm();
  
  const password = watch("password", "");

  // Generate admin ID on component mount
  useEffect(() => {
    const generateAdminId = () => {
      const prefix = "ADMIN";
      const random = Math.random().toString(36).substring(2, 8).toUpperCase();
      return `${prefix}-${random}`;
    };
    
    setValue("adminId", generateAdminId());
  }, [setValue]);
  useEffect(() => {
  if (typeof window !== "undefined") {
      // localStorage.setItem('user', JSON.stringify(result.data.staff));
     const token = localStorage.getItem('admin_token');
      
    if (token) router.push("/admin_dashboard");
  }
}, [router]); // prevents infinite re-render

  // const onSubmit = async (data) => {
  //   setLoading(true);
  //   try {
  //     console.log('📤 [Admin Register] Sending data:', data);
      
  //     const response = await fetch('/api/admin/register', {
  //       method: 'POST',
  //       headers: { 
  //         'Content-Type': 'application/json'
  //       },
  //       body: JSON.stringify(data)
  //     });

  //     console.log('📥 [Admin Register] Response status:', response.status);
      
  //     const result = await response.json();
  //     console.log('📥 [Admin Register] Response data:', result);

  //     if (!response.ok) {
  //       throw new Error(result.error || 'Registration failed');
  //     }

  //     toast.success(
  //       <div className="flex flex-col">
  //         <span className="font-semibold">✅ Admin Account Created Successfully!</span>
  //         <span className="text-sm">Welcome {data.name}</span>
  //       </div>,
  //       { duration: 5000 }
  //     );

  //     // Store token in localStorage (client-side)
  //     if (result.data && result.data.token) {
  //       localStorage.setItem('admin_token', result.data.token);
  //       localStorage.setItem('admin_user', JSON.stringify(result.data.admin));
        
  //       console.log('✅ Token stored in localStorage');
  //     }

  //     // Redirect to admin dashboard
  //     setTimeout(() => {
  //       router.push('/admin/dashboard');
  //     }, 2000);

  //   } catch (error) {
  //     console.error('❌ [Admin Register] Error:', error);
  //     toast.error(error.message || 'Registration failed');
  //   } finally {
  //     setLoading(false);
  //   }
  // };
const onSubmit = async (data) => {
  setLoading(true);
  try {
    console.log('📤 [Admin Register] Sending data:', data);
    
    const response = await fetch('/api/admin/register', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });

    console.log('📥 [Admin Register] Response status:', response.status);
    
    const result = await response.json();
    console.log('📥 [Admin Register] Response data:', result);

    if (!response.ok) {
      // Check if the error message contains localStorage
      if (result.error && result.error.includes('localStorage')) {
        throw new Error('Server configuration error. Please contact administrator.');
      }
      throw new Error(result.error || 'Registration failed');
    }

    toast.success(
      <div className="flex flex-col">
        <span className="font-semibold">✅ Admin Account Created Successfully!</span>
        <span className="text-sm">Welcome {data.name}</span>
      </div>,
      { duration: 5000 }
    );

    // Store token in localStorage (client-side) - safely
    if (result.data && result.data.token) {
      try {
        if (typeof window !== "undefined"){
          localStorage.setItem('admin_token', result.data.token);
          localStorage.setItem('admin_user', JSON.stringify(result.data.admin));
          console.log('✅ Token stored in localStorage');

        }
      } catch (storageError) {
        console.warn('⚠️ Could not store token in localStorage:', storageError);
        toast.warning('Session may not persist. Please login after refresh.');
      }
    }

    // Redirect to admin dashboard
    setTimeout(() => {
      router.push('/admin_dashboard');
    }, 1000);

  } catch (error) {
    console.error('❌ [Admin Register] Error:', error);
    toast.error(error.message || 'Registration failed');
  } finally {
    setLoading(false);
  }
};
  const generateNewId = () => {
    const generateAdminId = () => {
      const prefix = "ADMIN";
      const random = Math.random().toString(36).substring(2, 8).toUpperCase();
      return `${prefix}-${random}`;
    };
    
    setValue("adminId", generateAdminId());
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-purple-50 flex items-center justify-center p-4 md:p-8">
      <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl p-6 md:p-10 w-full max-w-md border border-purple-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 flex items-center justify-center">
              <FiShield className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-purple-700">Admin Registration</h1>
          </div>
          
          <p className="text-gray-600 text-sm mb-2">
            Create a new administrator account for Kanul Riza
          </p>
          <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs">
            <span className="h-2 w-2 rounded-full bg-purple-500 animate-pulse"></span>
            System Administrator Access
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          {/* Admin ID */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FiUser className="h-4 w-4 text-gray-500" />
              Admin ID *
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                {...register("adminId", { 
                  required: "Admin ID is required",
                  minLength: { value: 3, message: "Admin ID must be at least 3 characters" }
                })}
                readOnly
                className="flex-1 p-3 border border-gray-300 rounded-xl bg-gray-50"
              />
              <button
                type="button"
                onClick={generateNewId}
                className="px-4 py-3 bg-purple-100 text-purple-600 rounded-xl hover:bg-purple-200 transition-colors text-sm"
              >
                Generate
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">Unique identifier for admin account</p>
            {errors.adminId && (
              <p className="mt-1 text-sm text-red-600">{errors.adminId.message}</p>
            )}
          </div>

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FiUser className="h-4 w-4 text-gray-500" />
              Full Name *
            </label>
            <input
              type="text"
              {...register("name", { 
                required: "Full name is required",
                minLength: { value: 3, message: "Name must be at least 3 characters" }
              })}
              placeholder="Enter your full name"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all"
            />
            {errors.name && (
              <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FiMail className="h-4 w-4 text-gray-500" />
              Email Address *
            </label>
            <input
              type="email"
              {...register("email", { 
                required: "Email is required",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Invalid email address"
                }
              })}
              placeholder="admin@kanulriza.org"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all"
            />
            {errors.email && (
              <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
            )}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FiPhone className="h-4 w-4 text-gray-500" />
              Phone Number *
            </label>
            <input
              type="tel"
              {...register("phone", { 
                required: "Phone number is required",
                pattern: {
                  value: /^03[0-9]{9}$/,
                  message: "Enter valid Pakistani number (03XXXXXXXXX)"
                }
              })}
              placeholder="03XXXXXXXXX"
              className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all"
            />
            {errors.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
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
                  minLength: { value: 8, message: "Password must be at least 8 characters" },
                  pattern: {
                    value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                    message: "Must contain uppercase, lowercase, number, and special character"
                  }
                })}
                placeholder="Create a strong password"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all pr-12"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
              </button>
            </div>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">{errors.password.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Minimum 8 characters with uppercase, lowercase, number, and special character
            </p>
          </div>

          {/* Confirm Password */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <FiKey className="h-4 w-4 text-gray-500" />
              Confirm Password *
            </label>
            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                {...register("confirmPassword", { 
                  required: "Please confirm your password",
                  validate: value => value === password || "Passwords do not match"
                })}
                placeholder="Confirm your password"
                className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-400 transition-all pr-12"
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? <FiEyeOff className="h-5 w-5" /> : <FiEye className="h-5 w-5" />}
              </button>
            </div>
            {errors.confirmPassword && (
              <p className="mt-1 text-sm text-red-600">{errors.confirmPassword.message}</p>
            )}
          </div>

          {/* Terms Agreement */}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              {...register("terms", { 
                required: "You must agree to the terms and conditions" 
              })}
              className="h-4 w-4 mt-1 text-purple-500 rounded focus:ring-purple-400"
            />
            <label htmlFor="terms" className="text-sm text-gray-600">
              I agree to the{" "}
              <button
                type="button"
                onClick={() => toast.info('Terms and conditions will be displayed here')}
                className="text-purple-600 hover:text-purple-700 font-medium"
              >
                terms and conditions
              </button>
              {" "}and understand that I am creating a system administrator account with full access privileges.
            </label>
          </div>
          {errors.terms && (
            <p className="mt-1 text-sm text-red-600">{errors.terms.message}</p>
          )}

          {/* Form Actions */}
          <div className="flex flex-col gap-4 pt-6">
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-purple-500 to-purple-600 text-white font-semibold shadow-lg hover:from-purple-600 hover:to-purple-700 hover:shadow-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Creating Admin Account...
                </>
              ) : (
                <>
                  <FiUserPlus className="h-4 w-4" />
                  Create Admin Account
                </>
              )}
            </button>
            
            <div className="text-center">
              <Link 
                href="/admin_login" 
                className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 text-sm font-medium"
              >
                <FiArrowLeft className="h-4 w-4" />
                Already have an admin account? Login here
              </Link>
            </div>
          </div>
        </form>
      </div>
    </main>
  );
}