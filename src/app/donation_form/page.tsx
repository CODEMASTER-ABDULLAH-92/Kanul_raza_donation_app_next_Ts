// "use client"
// import { useState } from "react";

// export default function DonationForm() {
//   return (
//     <main className="min-h-screen w-full bg-gradient-to-b from-white to-green-100 flex items-center justify-center p-8">
//       <div className="bg-white/80 backdrop-blur-md shadow-xl rounded-2xl p-10 w-full max-w-2xl border border-green-200">
//         <h1 className="text-3xl font-bold text-green-700 text-center mb-6">Donation Form</h1>
//         <p className="text-gray-700 text-center mb-6">
//           This form is used by **authorized staff members only** to record donations
//           collected from people during field work.
//         </p>

//         <form className="grid grid-cols-1 md:grid-cols-2 gap-5">
//           {/* Donor Name */}
//           <div className="flex flex-col">
//             <label className="text-gray-700 font-medium">Donor Name</label>
//             <input
//               type="text"
//               placeholder="Enter donor's full name"
//               className="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
//             />
//           </div>

//           {/* Donor Email */}
//           <div className="flex flex-col">
//             <label className="text-gray-700 font-medium">Donor Email</label>
//             <input
//               type="email"
//               placeholder="Enter donor's email"
//               className="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
//             />
//           </div>

//           {/* Phone Number */}
//           <div className="flex flex-col">
//             <label className="text-gray-700 font-medium">Phone Number</label>
//             <input
//               type="text"
//               placeholder="03XX-XXXXXXX"
//               className="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
//             />
//           </div>

//           {/* Donation Amount */}
//           <div className="flex flex-col">
//             <label className="text-gray-700 font-medium">Donation Amount (PKR)</label>
//             <input
//               type="number"
//               placeholder="Enter amount"
//               className="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400"
//             />
//           </div>

//           {/* Donation Type */}
//           <div className="flex flex-col md:col-span-2">
//             <label className="text-gray-700 font-medium">Type of Charity</label>
//             <select className="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400">
//               <option>Select Charity Type</option>
//               <option>Sadaqah</option>
//               <option>Zakat</option>
//               <option>Sadaqah Nafilah</option>
//               <option>General Donation</option>
//             </select>
//           </div>

//           {/* Donation Category */}
//           <div className="flex flex-col md:col-span-2">
//             <label className="text-gray-700 font-medium">Donation For</label>
//             <select className="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400">
//               <option>Select Category</option>
//               <option>Boys Madrasa</option>
//               <option>Girls Madrasa</option>
//               <option>Masjid</option>
//               <option>Cement</option>
//               <option>Islamic Books</option>
//               <option>Construction Work</option>
//               <option>Poor Families (Ration)</option>
//               <option>Food Distribution</option>
//             </select>
//           </div>

//           {/* Notes */}
//           <div className="flex flex-col md:col-span-2">
//             <label className="text-gray-700 font-medium">Additional Notes</label>
//             <textarea
//               placeholder="Any extra details..."
//               className="p-3 border rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 h-28"
//             ></textarea>
//           </div>

//           {/* Submit Button */}
//           <div className="md:col-span-2 flex justify-center">
//             <button
//               type="submit"
//               className="px-8 py-3 rounded-xl bg-green-600 text-white font-semibold shadow hover:bg-green-700 transition"
//             >
//               Submit Donation
//             </button>
//           </div>
//         </form>
//       </div>
//     </main>
//   );
// }



"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiDollarSign, 
  FiBook, 
  FiHome, 
  FiSend,
  FiCheck,
  FiX 
} from "react-icons/fi";
import { 
  FaMosque, 
  FaSchool, 
  FaBook, 
  FaBuilding,
  FaShoppingBasket,
  FaUtensils,
  FaHandHoldingHeart
} from "react-icons/fa";

export default function DonationForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [sendEmail, setSendEmail] = useState(true);
  const [sendSMS, setSendSMS] = useState(true);
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm();

  const charityTypes = [
    { value: "sadaqah", label: "Sadaqah", icon: <FaHandHoldingHeart className="text-green-500" /> },
    { value: "zakat", label: "Zakat", icon: <FiBook className="text-blue-500" /> },
    { value: "sadaqah_nafilah", label: "Sadaqah Nafilah", icon: <FaHandHoldingHeart className="text-purple-500" /> },
    { value: "general", label: "General Donation", icon: <FiDollarSign className="text-yellow-500" /> },
  ];

  const charityCategories = [
    { value: "boys_madrasa", label: "Boys Madrasa", icon: <FaSchool className="text-blue-600" /> },
    { value: "girls_madrasa", label: "Girls Madrasa", icon: <FaSchool className="text-pink-600" /> },
    { value: "masjid", label: "Masjid", icon: <FaMosque className="text-green-600" /> },
    { value: "cement", label: "Cement", icon: <FaBuilding className="text-gray-600" /> },
    { value: "islamic_books", label: "Islamic Books", icon: <FaBook className="text-yellow-600" /> },
    { value: "construction", label: "Construction Work", icon: <FaBuilding className="text-orange-600" /> },
    { value: "ration", label: "Poor Families (Ration)", icon: <FaShoppingBasket className="text-red-500" /> },
    { value: "food_distribution", label: "Food Distribution", icon: <FaUtensils className="text-emerald-500" /> },
  ];

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      // Get current logged in staff info
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      
      const donationData = {
        ...data,
        amount: parseFloat(data.amount),
        staffId: user.id || 'staff_unknown',
        staffName: user.name || 'Staff Member',
        sendEmail,
        sendSMS,
        date: new Date().toISOString()
      };

      // In development mode, simulate API call
      if (process.env.NEXT_PUBLIC_DEV_MODE === 'true') {
        console.log('Donation data:', donationData);
        
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        toast.success(
          <div className="flex flex-col">
            <span className="font-semibold">Donation Recorded Successfully!</span>
            <span className="text-sm">PKR {data.amount} for {charityCategories.find(c => c.value === data.category)?.label}</span>
          </div>,
          { duration: 4000 }
        );

        // Simulate sending notifications
        if (sendEmail || sendSMS) {
          toast.success(
            <div className="flex flex-col">
              <span className="font-semibold">Notifications Sent!</span>
              <span className="text-sm">
                {sendEmail && '📧 Email '}
                {sendEmail && sendSMS && '& '}
                {sendSMS && '📱 SMS '}
                sent to donor
              </span>
            </div>,
            { duration: 4000 }
          );
        }
      } else {
        // Production API calls
        const response = await fetch('/api/donations', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify(donationData)
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || 'Failed to submit donation');
        }

        toast.success('Donation recorded successfully!');
        
        if (sendEmail || sendSMS) {
          toast.success('Thank you email and SMS sent to donor.');
        }
      }

      // Reset form on success
      reset();
      setSendEmail(true);
      setSendSMS(true);
      
      // Optional: Redirect or show success message
      setTimeout(() => {
        router.push('/dashboard');
      }, 2000);

    } catch (error) {
      toast.error(error.message || 'Failed to submit donation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-br from-green-50 via-white to-green-50 flex items-center justify-center p-4 md:p-8">
      <div className="bg-white/90 backdrop-blur-sm shadow-2xl rounded-2xl p-6 md:p-10 w-full max-w-4xl border border-green-100">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-12 w-12 rounded-xl bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
              <FaHandHoldingHeart className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-green-700">Donation Collection Form</h1>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <p className="text-gray-700 mb-3">
              <span className="font-semibold text-green-600">Authorized Staff Only</span> – Use this form to record donations collected during field work.
            </p>
            <div className="inline-flex items-center gap-2 bg-green-50 text-green-700 px-4 py-2 rounded-full text-sm">
              <FiUser className="h-4 w-4" />
              <span>Staff: Muhammad Abdullah</span>
              <span className="text-green-500">•</span>
              <span className="text-xs px-2 py-1 bg-green-100 rounded">Active</span>
            </div>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Donor Information Section */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-xl border border-green-100">
            <h2 className="text-xl font-semibold text-green-800 mb-4 flex items-center gap-2">
              <FiUser className="h-5 w-5" />
              Donor Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Donor Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FiUser className="h-4 w-4 text-gray-500" />
                  Donor Full Name *
                </label>
                <input
                  type="text"
                  {...register("donorName", { 
                    required: "Donor name is required",
                    minLength: { value: 3, message: "Name must be at least 3 characters" }
                  })}
                  placeholder="Enter donor's full name"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all"
                />
                {errors.donorName && (
                  <p className="mt-1 text-sm text-red-600">{errors.donorName.message}</p>
                )}
              </div>

              {/* Donor Email */}
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
                  placeholder="donor@example.com"
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>
                )}
              </div>

              {/* Phone Number */}
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
                  className="w-full p-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all"
                />
                {errors.phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.phone.message}</p>
                )}
              </div>

              {/* Donation Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
                  <FiDollarSign className="h-4 w-4 text-gray-500" />
                  Donation Amount (PKR) *
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">₨</span>
                  <input
                    type="number"
                    step="0.01"
                    {...register("amount", { 
                      required: "Amount is required",
                      min: { value: 1, message: "Minimum donation is PKR 1" }
                    })}
                    placeholder="Enter amount"
                    className="w-full p-3 pl-10 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition-all"
                  />
                </div>
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600">{errors.amount.message}</p>
                )}
              </div>
            </div>
          </div>

          {/* Charity Details Section */}
          <div className="bg-gradient-to-r from-blue-50 to-sky-50 p-5 rounded-xl border border-blue-100">
            <h2 className="text-xl font-semibold text-blue-800 mb-4 flex items-center gap-2">
              <FiHome className="h-5 w-5" />
              Charity Details
            </h2>
            
            {/* Charity Type */}
            <div className="mb-5">
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Type of Charity *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {charityTypes.map((type) => (
                  <div key={type.value} className="relative">
                    <input
                      type="radio"
                      id={type.value}
                      value={type.value}
                      {...register("charityType", { required: "Please select charity type" })}
                      className="hidden peer"
                    />
                    <label
                      htmlFor={type.value}
                      className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-green-300 hover:bg-white peer-checked:border-green-500 peer-checked:bg-green-50 transition-all duration-200"
                    >
                      <div className="mb-2">{type.icon}</div>
                      <span className="text-sm font-medium text-center">{type.label}</span>
                    </label>
                  </div>
                ))}
              </div>
              {errors.charityType && (
                <p className="mt-2 text-sm text-red-600">{errors.charityType.message}</p>
              )}
            </div>

            {/* Charity Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-3">
                Donation For *
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {charityCategories.map((category) => (
                  <div key={category.value} className="relative">
                    <input
                      type="radio"
                      id={category.value}
                      value={category.value}
                      {...register("category", { required: "Please select category" })}
                      className="hidden peer"
                    />
                    <label
                      htmlFor={category.value}
                      className="flex flex-col items-center justify-center p-4 border-2 border-gray-200 rounded-xl cursor-pointer hover:border-blue-300 hover:bg-white peer-checked:border-blue-500 peer-checked:bg-blue-50 transition-all duration-200"
                    >
                      <div className="mb-2">{category.icon}</div>
                      <span className="text-sm font-medium text-center">{category.label}</span>
                    </label>
                  </div>
                ))}
              </div>
              {errors.category && (
                <p className="mt-2 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>
          </div>

          {/* Additional Notes */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-100 p-5 rounded-xl border border-gray-200">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Additional Notes (Optional)</h2>
            <textarea
              {...register("notes")}
              placeholder="Any special instructions, preferences, or additional details about this donation..."
              className="w-full p-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 h-32 resize-none transition-all"
              rows={4}
            />
          </div>

          {/* Notification Preferences */}
          <div className="bg-gradient-to-r from-purple-50 to-pink-50 p-5 rounded-xl border border-purple-100">
            <h2 className="text-xl font-semibold text-purple-800 mb-4">Send Notifications to Donor</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                sendEmail 
                  ? "border-green-500 bg-green-50" 
                  : "border-gray-300 bg-white hover:border-gray-400"
              }`} onClick={() => setSendEmail(!sendEmail)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      sendEmail ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
                    }`}>
                      <FiMail className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Send Thank You Email</p>
                      <p className="text-sm text-gray-500">Donor will receive confirmation email</p>
                    </div>
                  </div>
                  <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                    sendEmail 
                      ? "border-green-500 bg-green-500" 
                      : "border-gray-400"
                  }`}>
                    {sendEmail && <FiCheck className="h-3 w-3 text-white" />}
                  </div>
                </div>
              </div>

              <div className={`p-4 rounded-xl border-2 transition-all cursor-pointer ${
                sendSMS 
                  ? "border-green-500 bg-green-50" 
                  : "border-gray-300 bg-white hover:border-gray-400"
              }`} onClick={() => setSendSMS(!sendSMS)}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`h-10 w-10 rounded-lg flex items-center justify-center ${
                      sendSMS ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-600"
                    }`}>
                      <FiPhone className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">Send SMS Notification</p>
                      <p className="text-sm text-gray-500">Donor will receive thank you SMS</p>
                    </div>
                  </div>
                  <div className={`h-6 w-6 rounded-full border-2 flex items-center justify-center ${
                    sendSMS 
                      ? "border-green-500 bg-green-500" 
                      : "border-gray-400"
                  }`}>
                    {sendSMS && <FiCheck className="h-3 w-3 text-white" />}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Are you sure? All entered data will be lost.')) {
                  reset();
                  setSendEmail(true);
                  setSendSMS(true);
                }
              }}
              className="px-6 py-3 rounded-xl border-2 border-gray-300 text-gray-700 font-semibold hover:bg-gray-50 transition-all flex-1 flex items-center justify-center gap-2"
              disabled={loading}
            >
              <FiX className="h-4 w-4" />
              Clear Form
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 rounded-xl bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold shadow-lg hover:from-green-600 hover:to-green-700 hover:shadow-xl transition-all flex-1 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                <>
                  <FiSend className="h-4 w-4" />
                  Submit Donation
                </>
              )}
            </button>
          </div>
        </form>

        {/* Footer Note */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 text-sm text-gray-600">
            <div className="space-y-1">
              <p className="flex items-center gap-2">
                <span className="text-green-500 font-medium">✓</span>
                <span>All donations are recorded in the system</span>
              </p>
              <p className="flex items-center gap-2">
                <span className="text-green-500 font-medium">✓</span>
                <span>Head office will receive automatic notification</span>
              </p>
            </div>
            <div className="text-xs text-gray-500">
              <p>Form ID: DON-{new Date().getTime().toString().slice(-6)}</p>
              <p>Time: {new Date().toLocaleTimeString()}</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}