// "use client";

// import { useState } from "react";
// import { FiHome, FiUsers, FiDatabase, FiLogOut, FiMenu } from "react-icons/fi";
// import { FaMosque } from "react-icons/fa";

// export default function AdminDashboard() {
//   const [active, setActive] = useState("dashboard");
//   const [sidebarOpen, setSidebarOpen] = useState(false);

//   // Dummy charity data
//   const charities = [
//     {
//       id: 1,
//       donorName: "Ahmed Raza",
//       amount: 5000,
//       category: "Masjid Construction",
//       type: "Sadaqah",
//       staff: "Bilal Ahmed",
//     },
//     {
//       id: 2,
//       donorName: "Sara Khan",
//       amount: 3000,
//       category: "Girls Madrasa",
//       type: "Zakat",
//       staff: "Hamza Ali",
//     },
//   ];

//   // Dummy staff data
//   const staffMembers = [
//     { id: 1, name: "Bilal Ahmed", email: "bilal@kanulriza.org" },
//     { id: 2, name: "Hamza Ali", email: "hamza@kanulriza.org" },
//   ];

//   return (
//     <main className="min-h-screen w-full bg-green-50 flex">
      
//       {/* ▬▬▬▬▬ SIDEBAR ▬▬▬▬▬ */}
//       <aside
//         className={`${
//           sidebarOpen ? "translate-x-0" : "-translate-x-64"
//         } fixed md:static top-0 left-0 z-50 w-64 bg-white shadow-xl p-6 flex flex-col border-r border-green-200 transition-transform duration-300`}
//       >
//         <h1 className="text-2xl font-bold text-green-700 flex items-center gap-2">
//           <FaMosque /> Kanul Riza
//         </h1>

//         <nav className="mt-10 flex flex-col gap-3 text-lg">
//           <button
//             onClick={() => {
//               setActive("dashboard");
//               setSidebarOpen(false);
//             }}
//             className={`flex items-center gap-3 p-3 rounded-xl transition ${
//               active === "dashboard"
//                 ? "bg-green-100 text-green-600"
//                 : "text-gray-700"
//             }`}
//           >
//             <FiHome /> Dashboard
//           </button>

//           <button
//             onClick={() => {
//               setActive("charities");
//               setSidebarOpen(false);
//             }}
//             className={`flex items-center gap-3 p-3 rounded-xl transition ${
//               active === "charities"
//                 ? "bg-green-100 text-green-600"
//                 : "text-gray-700"
//             }`}
//           >
//             <FiDatabase /> Charities
//           </button>

//           <button
//             onClick={() => {
//               setActive("staff");
//               setSidebarOpen(false);
//             }}
//             className={`flex items-center gap-3 p-3 rounded-xl transition ${
//               active === "staff"
//                 ? "bg-green-100 text-green-600"
//                 : "text-gray-700"
//             }`}
//           >
//             <FiUsers /> Staff Management
//           </button>

//           <button className="flex items-center gap-3 p-3 rounded-xl text-red-600 mt-auto">
//             <FiLogOut /> Logout
//           </button>
//         </nav>
//       </aside>

//       {/* ▬▬▬▬▬ MOBILE NAV TOGGLE ▬▬▬▬▬ */}
//       <button
//         onClick={() => setSidebarOpen(true)}
//         className="md:hidden fixed top-4 left-4 z-40 bg-green-600 text-white p-3 rounded-full shadow-lg"
//       >
//         <FiMenu size={22} />
//       </button>

//       {/* ▬▬▬▬▬ MAIN CONTENT ▬▬▬▬▬ */}
//       <section className="flex-1 p-6 md:p-10 overflow-y-auto">
//         <h2 className="text-2xl md:text-3xl font-semibold text-green-800 mb-6">
//           Welcome to Kanul Riza Admin Dashboard
//         </h2>

//         {/* ▬▬▬▬▬ DASHBOARD OVERVIEW ▬▬▬▬▬ */}
//         {active === "dashboard" && (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
//             <div className="p-6 bg-white rounded-xl shadow-md border border-green-200">
//               <h3 className="text-lg md:text-xl font-semibold text-gray-700">Total Charities</h3>
//               <p className="text-2xl md:text-3xl font-bold text-green-600">
//                 {charities.length}
//               </p>
//             </div>

//             <div className="p-6 bg-white rounded-xl shadow-md border border-green-200">
//               <h3 className="text-lg md:text-xl font-semibold text-gray-700">Total Staff</h3>
//               <p className="text-2xl md:text-3xl font-bold text-green-600">
//                 {staffMembers.length}
//               </p>
//             </div>

//             <div className="p-6 bg-white rounded-xl shadow-md border border-green-200">
//               <h3 className="text-lg md:text-xl font-semibold text-gray-700">Pending Requests</h3>
//               <p className="text-2xl md:text-3xl font-bold text-green-600">0</p>
//             </div>
//           </div>
//         )}

//         {/* ▬▬▬▬▬ CHARITIES TABLE ▬▬▬▬▬ */}
//         {active === "charities" && (
//           <div className="mt-6">
//             <h3 className="text-2xl font-semibold text-green-700 mb-4">
//               All Charities
//             </h3>

//             <div className="overflow-x-auto">
//               <table className="w-full bg-white rounded-xl shadow border border-green-200">
//                 <thead className="bg-green-100 text-left">
//                   <tr>
//                     <th className="p-3">Donor Name</th>
//                     <th className="p-3">Amount</th>
//                     <th className="p-3">Category</th>
//                     <th className="p-3">Type</th>
//                     <th className="p-3">Collected By</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {charities.map((item) => (
//                     <tr key={item.id} className="border-t">
//                       <td className="p-3">{item.donorName}</td>
//                       <td className="p-3">PKR {item.amount}</td>
//                       <td className="p-3">{item.category}</td>
//                       <td className="p-3">{item.type}</td>
//                       <td className="p-3">{item.staff}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         )}

//         {/* ▬▬▬▬▬ STAFF TABLE ▬▬▬▬▬ */}
//         {active === "staff" && (
//           <div className="mt-6">
//             <h3 className="text-2xl font-semibold text-green-700 mb-4">
//               Staff Management
//             </h3>

//             <p className="text-gray-700 mb-4">
//               Admin can create login credentials for staff members.
//             </p>

//             <div className="overflow-x-auto">
//               <table className="w-full bg-white rounded-xl shadow border border-green-200">
//                 <thead className="bg-green-100 text-left">
//                   <tr>
//                     <th className="p-3">Name</th>
//                     <th className="p-3">Email</th>
//                     <th className="p-3">Actions</th>
//                   </tr>
//                 </thead>

//                 <tbody>
//                   {staffMembers.map((member) => (
//                     <tr key={member.id} className="border-t">
//                       <td className="p-3">{member.name}</td>
//                       <td className="p-3">{member.email}</td>
//                       <td className="p-3 flex gap-4">
//                         <button className="text-green-600 font-semibold">Edit</button>
//                         <button className="text-red-600 font-semibold">Delete</button>
//                       </td>
//                     </tr>
//                   ))}
//                 </tbody>

//               </table>
//             </div>
//           </div>
//         )}
//       </section>
//     </main>
//   );
// }




"use client";

import { useState, useEffect } from "react";
import { FiHome, FiUsers, FiDatabase, FiLogOut, FiMenu, FiX, FiPlus, FiEdit, FiTrash2, FiMail } from "react-icons/fi";
import { FaMosque, FaUserShield } from "react-icons/fa";

export default function AdminDashboard() {
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [newStaff, setNewStaff] = useState({ name: "", email: "", password: "" });

  // Dummy charity data
  const charities = [
    {
      id: 1,
      donorName: "Ahmed Raza",
      amount: 5000,
      category: "Masjid Construction",
      type: "Sadaqah",
      staff: "Bilal Ahmed",
      date: "2024-01-15",
      status: "Completed"
    },
    {
      id: 2,
      donorName: "Sara Khan",
      amount: 3000,
      category: "Girls Madrasa",
      type: "Zakat",
      staff: "Hamza Ali",
      date: "2024-01-14",
      status: "Completed"
    },
    {
      id: 3,
      donorName: "Mohammad Ali",
      amount: 10000,
      category: "Boys Madrasa",
      type: "Sadaqah",
      staff: "Bilal Ahmed",
      date: "2024-01-13",
      status: "Pending"
    },
    {
      id: 4,
      donorName: "Fatima Noor",
      amount: 7500,
      category: "Construction Material",
      type: "Sadaqah",
      staff: "Hamza Ali",
      date: "2024-01-12",
      status: "Completed"
    },
  ];

  // Dummy staff data
  const [staffMembers, setStaffMembers] = useState([
    { id: 1, name: "Bilal Ahmed", email: "bilal@kanulriza.org", role: "Worker", status: "Active", lastLogin: "2024-01-15 14:30" },
    { id: 2, name: "Hamza Ali", email: "hamza@kanulriza.org", role: "Worker", status: "Active", lastLogin: "2024-01-15 09:45" },
    { id: 3, name: "Admin User", email: "admin@kanulriza.org", role: "Admin", status: "Active", lastLogin: "2024-01-15 16:20" },
  ]);

  // Stats calculations
  const totalDonations = charities.reduce((sum, charity) => sum + charity.amount, 0);
  const pendingDonations = charities.filter(c => c.status === "Pending").reduce((sum, charity) => sum + charity.amount, 0);
  const completedDonations = charities.filter(c => c.status === "Completed").reduce((sum, charity) => sum + charity.amount, 0);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Close sidebar when clicking outside on mobile
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarOpen && isMobile && !event.target.closest('.sidebar') && !event.target.closest('.menu-button')) {
        setSidebarOpen(false);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, [sidebarOpen, isMobile]);

  const handleAddStaff = () => {
    if (newStaff.name && newStaff.email && newStaff.password) {
      const newStaffMember = {
        id: staffMembers.length + 1,
        name: newStaff.name,
        email: newStaff.email,
        role: "Worker",
        status: "Active",
        lastLogin: "Never"
      };
      setStaffMembers([...staffMembers, newStaffMember]);
      setNewStaff({ name: "", email: "", password: "" });
      setShowAddStaffModal(false);
      alert(`Staff account created for ${newStaff.name}\nEmail: ${newStaff.email}\nPassword: ${newStaff.password}\n\nPlease save these credentials securely.`);
    }
  };

  const handleDeleteStaff = (id) => {
    if (window.confirm("Are you sure you want to delete this staff member?")) {
      setStaffMembers(staffMembers.filter(staff => staff.id !== id));
    }
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
  };

  return (
    <main className="min-h-screen w-full bg-gradient-to-b from-green-50 to-white flex">
      
      {/* Mobile Overlay */}
      {sidebarOpen && isMobile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setSidebarOpen(false)} />
      )}
      
      {/* SIDEBAR */}
      <aside
        className={`sidebar fixed md:static top-0 left-0 z-50 w-64 bg-white shadow-xl p-6 flex flex-col border-r border-green-200 transition-transform duration-300 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-64 md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
              <FaMosque className="h-6 w-6 text-white" />
            </div>
            <h1 className="text-xl font-bold text-green-700">Kanul Riza</h1>
          </div>
          {isMobile && (
            <button
              onClick={() => setSidebarOpen(false)}
              className="p-2 rounded-lg hover:bg-gray-100"
            >
              <FiX size={20} />
            </button>
          )}
        </div>

        <nav className="flex-1 flex flex-col gap-2">
          <button
            onClick={() => {
              setActive("dashboard");
              setSidebarOpen(false);
            }}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              active === "dashboard"
                ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md"
                : "text-gray-700 hover:bg-green-50"
            }`}
          >
            <FiHome size={20} /> Dashboard
          </button>

          <button
            onClick={() => {
              setActive("charities");
              setSidebarOpen(false);
            }}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              active === "charities"
                ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md"
                : "text-gray-700 hover:bg-green-50"
            }`}
          >
            <FiDatabase size={20} /> Charities
          </button>

          <button
            onClick={() => {
              setActive("staff");
              setSidebarOpen(false);
            }}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              active === "staff"
                ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-md"
                : "text-gray-700 hover:bg-green-50"
            }`}
          >
            <FiUsers size={20} /> Staff Management
          </button>
        </nav>

        <button
          onClick={handleLogout}
          className="mt-auto flex items-center gap-3 p-3 rounded-lg text-red-600 hover:bg-red-50 transition-all"
        >
          <FiLogOut size={20} /> Logout
        </button>
      </aside>

      {/* MAIN CONTENT */}
      <section className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-green-800">
              Welcome to Kanul Riza Admin Dashboard
            </h2>
            <p className="text-gray-600 mt-1">Manage donations and staff efficiently</p>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-3 bg-white px-4 py-2 rounded-lg border border-green-200">
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white font-bold">
                A
              </div>
              <div>
                <p className="text-sm font-medium">Admin</p>
                <p className="text-xs text-gray-500">admin@kanulriza.org</p>
              </div>
            </div>
            
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="menu-button md:hidden p-2 rounded-lg bg-gradient-to-r from-green-500 to-green-600 text-white"
            >
              <FiMenu size={20} />
            </button>
          </div>
        </div>

        {/* DASHBOARD OVERVIEW */}
        {active === "dashboard" && (
          <div className="space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-5 bg-white rounded-xl shadow-sm border border-green-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Donations</p>
                    <p className="text-2xl md:text-3xl font-bold text-green-600 mt-2">
                      PKR {totalDonations.toLocaleString()}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <FiDatabase className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">{charities.length} total transactions</p>
              </div>

              <div className="p-5 bg-white rounded-xl shadow-sm border border-green-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Staff</p>
                    <p className="text-2xl md:text-3xl font-bold text-green-600 mt-2">
                      {staffMembers.filter(s => s.status === "Active").length}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FiUsers className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">{staffMembers.length} total staff members</p>
              </div>

              <div className="p-5 bg-white rounded-xl shadow-sm border border-green-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Completed</p>
                    <p className="text-2xl md:text-3xl font-bold text-green-600 mt-2">
                      PKR {completedDonations.toLocaleString()}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <FiDatabase className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">{charities.filter(c => c.status === "Completed").length} donations</p>
              </div>

              <div className="p-5 bg-white rounded-xl shadow-sm border border-green-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-2xl md:text-3xl font-bold text-yellow-600 mt-2">
                      PKR {pendingDonations.toLocaleString()}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-yellow-100 flex items-center justify-center">
                    <FiDatabase className="h-6 w-6 text-yellow-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">{charities.filter(c => c.status === "Pending").length} pending</p>
              </div>
            </div>

            {/* Recent Charities Table */}
            <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800">Recent Donations</h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="p-3 text-left text-sm font-medium text-gray-700">Donor</th>
                      <th className="p-3 text-left text-sm font-medium text-gray-700">Amount</th>
                      <th className="p-3 text-left text-sm font-medium text-gray-700">Category</th>
                      <th className="p-3 text-left text-sm font-medium text-gray-700">Staff</th>
                      <th className="p-3 text-left text-sm font-medium text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {charities.slice(0, 5).map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-3">
                          <div className="font-medium text-gray-900">{item.donorName}</div>
                          <div className="text-sm text-gray-500">{item.type}</div>
                        </td>
                        <td className="p-3">
                          <div className="font-bold text-green-600">PKR {item.amount.toLocaleString()}</div>
                        </td>
                        <td className="p-3">
                          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                            {item.category}
                          </span>
                        </td>
                        <td className="p-3 text-gray-700">{item.staff}</td>
                        <td className="p-3">
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            item.status === "Completed" 
                              ? "bg-emerald-100 text-emerald-700" 
                              : "bg-yellow-100 text-yellow-700"
                          }`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* CHARITIES TABLE */}
        {active === "charities" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">All Donations</h3>
                <p className="text-gray-600 mt-1">View and manage all charity donations</p>
              </div>
              <div className="flex items-center gap-3">
                <button className="px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors flex items-center gap-2">
                  <FiPlus /> Add Donation
                </button>
                <button className="px-4 py-2 border border-green-500 text-green-600 rounded-lg hover:bg-green-50 transition-colors">
                  Export Report
                </button>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-green-50">
                    <tr>
                      <th className="p-4 text-left font-semibold text-gray-700">ID</th>
                      <th className="p-4 text-left font-semibold text-gray-700">Donor Name</th>
                      <th className="p-4 text-left font-semibold text-gray-700">Amount</th>
                      <th className="p-4 text-left font-semibold text-gray-700">Category</th>
                      <th className="p-4 text-left font-semibold text-gray-700">Type</th>
                      <th className="p-4 text-left font-semibold text-gray-700">Staff</th>
                      <th className="p-4 text-left font-semibold text-gray-700">Date</th>
                      <th className="p-4 text-left font-semibold text-gray-700">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {charities.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 text-gray-500">#{item.id}</td>
                        <td className="p-4 font-medium text-gray-900">{item.donorName}</td>
                        <td className="p-4 font-bold text-green-600">PKR {item.amount.toLocaleString()}</td>
                        <td className="p-4">
                          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                            {item.category}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                            {item.type}
                          </span>
                        </td>
                        <td className="p-4 text-gray-700">{item.staff}</td>
                        <td className="p-4 text-gray-600">{item.date}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            item.status === "Completed" 
                              ? "bg-emerald-100 text-emerald-700" 
                              : "bg-yellow-100 text-yellow-700"
                          }`}>
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* STAFF MANAGEMENT */}
        {active === "staff" && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="text-2xl font-bold text-gray-800">Staff Management</h3>
                <p className="text-gray-600 mt-1">Create and manage staff accounts</p>
              </div>
              <button
                onClick={() => setShowAddStaffModal(true)}
                className="px-4 py-2 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all flex items-center gap-2 shadow-sm"
              >
                <FiPlus /> Add New Staff
              </button>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-green-50">
                    <tr>
                      <th className="p-4 text-left font-semibold text-gray-700">ID</th>
                      <th className="p-4 text-left font-semibold text-gray-700">Name</th>
                      <th className="p-4 text-left font-semibold text-gray-700">Email</th>
                      <th className="p-4 text-left font-semibold text-gray-700">Role</th>
                      <th className="p-4 text-left font-semibold text-gray-700">Status</th>
                      <th className="p-4 text-left font-semibold text-gray-700">Last Login</th>
                      <th className="p-4 text-left font-semibold text-gray-700">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {staffMembers.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50 transition-colors">
                        <td className="p-4 text-gray-500">#{member.id}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white font-bold">
                              {member.name.charAt(0)}
                            </div>
                            <span className="font-medium text-gray-900">{member.name}</span>
                          </div>
                        </td>
                        <td className="p-4 text-gray-700">{member.email}</td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            member.role === "Admin" 
                              ? "bg-red-100 text-red-700" 
                              : "bg-blue-100 text-blue-700"
                          }`}>
                            {member.role}
                          </span>
                        </td>
                        <td className="p-4">
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            member.status === "Active" 
                              ? "bg-emerald-100 text-emerald-700" 
                              : "bg-gray-100 text-gray-700"
                          }`}>
                            {member.status}
                          </span>
                        </td>
                        <td className="p-4 text-gray-600">{member.lastLogin}</td>
                        <td className="p-4">
                          <div className="flex items-center gap-2">
                            <button className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                              <FiEdit size={16} />
                            </button>
                            <button 
                              onClick={() => handleDeleteStaff(member.id)}
                              className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            >
                              <FiTrash2 size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </section>

      {/* ADD STAFF MODAL */}
      {showAddStaffModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-lg bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center">
                  <FaUserShield className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Add New Staff Member</h3>
              </div>
              <button
                onClick={() => setShowAddStaffModal(false)}
                className="p-2 rounded-lg hover:bg-gray-100"
              >
                <FiX size={20} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={newStaff.name}
                  onChange={(e) => setNewStaff({...newStaff, name: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={newStaff.email}
                  onChange={(e) => setNewStaff({...newStaff, email: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                  placeholder="staff@kanulriza.org"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="text"
                  value={newStaff.password}
                  onChange={(e) => setNewStaff({...newStaff, password: e.target.value})}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                  placeholder="Create secure password"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Share this password securely with the staff member. They should change it on first login.
                </p>
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={() => setShowAddStaffModal(false)}
                className="flex-1 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddStaff}
                disabled={!newStaff.name || !newStaff.email || !newStaff.password}
                className="flex-1 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Account
              </button>
            </div>
          </div>
        </div>
      )}
    </main>
  );
}