"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import {
  FiHome,
  FiUsers,
  FiDatabase,
  FiLogOut,
  FiMenu,
  FiX,
  FiPlus,
  FiEdit,
  FiTrash2,
  
  FiDownload,
  FiDollarSign,
  FiCheckCircle,
  FiClock,
} from "react-icons/fi";
import { FaMosque, FaUserShield } from "react-icons/fa";

export default function AdminDashboard() {
  const router = useRouter();
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [charities, setCharities] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [stats, setStats] = useState({
    totalDonations: 0,
    activeStaff: 0,
    completedDonations: 0,
    pendingDonations: 0,
    totalDonors: 0,
    averageDonation: 0,
  });
  const [adminUser, setAdminUser] = useState(null);

  const [newStaff, setNewStaff] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    staffId: "",
    role: "collector",
  });

  // Fetch data on component mount
  useEffect(() => {
    checkAuthAndFetchData();
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const storedAdmin = localStorage.getItem("admin_user");
      const token = localStorage.getItem("admin_token");

      if (!token) {
        router.push("/admin_login");
        return;
      }

      if (storedAdmin) {
        try {
          const parsed = JSON.parse(storedAdmin);
          setAdminUser(parsed);
        } catch (error) {
          console.error("Error parsing admin_user:", error);
        }
      }
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");

    toast.success("Logged out successfully");
    router.push("/admin_login");
  };

  const checkAuthAndFetchData = async () => {
    try {
      // Fetch all data
      await Promise.all([
        fetchDonations(),
        fetchStaffMembers(),
        fetchStatistics(),
      ]);
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };
  
  
  const [donations, setDonations] = useState([]);

  const fetchDonations = async () => {
    const token = localStorage.getItem("admin_token");
    if (!token) {
      console.error("No admin token found. Please login first.");
      return;
    }

    try {
      const res = await fetch("/api/getalldata", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        throw new Error(`Error fetching donations: ${res.status}`);
      }

      const data = await res.json();
      console.log("Donations:", data.data.donations);
      setDonations(data.data.donations);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchDonations();
  }, []); // Empty dependency to run only once

  const fetchStaffMembers = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/staff/getAllStaff", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        setStaffMembers(result.data.staff || []);
      } else {
        toast.error("Failed to fetch staff members");
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
    }
  };

  const fetchStatistics = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/donations/stats", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (result.success) {
        setStats({
          totalDonations: result.data.summary.totalAmount || 0,
          activeStaff: staffMembers.filter((s) => s.active).length,
          completedDonations: result.data.summary.totalAmount || 0, // You might want to filter by status
          pendingDonations: 0, // You'll need to add status filtering
          totalDonors: await fetchTotalDonors(),
          averageDonation: result.data.summary.averageAmount || 0,
        });
      }
    } catch (error) {
      console.error("Error fetching statistics:", error);
    }
  };

  const fetchTotalDonors = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/donations?distinct=email", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      return result.data?.length || 0;
    } catch (error) {
      console.error("Error fetching donors:", error);
      return 0;
    }
  };

  const handleAddStaff = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/staff/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newStaff),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to create staff");
      }

      toast.success(`Staff account created for ${newStaff.name}`);

      // Refresh staff list
      await fetchStaffMembers();

      // Reset form
      setNewStaff({
        name: "",
        email: "",
        phone: "",
        password: "",
        staffId: "",
        role: "collector",
      });
      setShowAddStaffModal(false);
    } catch (error) {
      console.error("Error adding staff:", error);
      toast.error(error.message || "Failed to create staff account");
    }
  };

  const handleDeleteStaff = async (staffId) => {
    if (
      !window.confirm("Are you sure you want to deactivate this staff member?")
    ) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/staff/${staffId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to deactivate staff");
      }

      toast.success("Staff member deactivated");

      // Refresh staff list
      await fetchStaffMembers();
      await fetchStatistics();
    } catch (error) {
      console.error("Error deleting staff:", error);
      toast.error(error.message || "Failed to deactivate staff");
    }
  };

  const handleActivateStaff = async (staffId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/staff/${staffId}/activate`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to activate staff");
      }

      toast.success("Staff member activated");

      // Refresh staff list
      await fetchStaffMembers();
      await fetchStatistics();
    } catch (error) {
      console.error("Error activating staff:", error);
      toast.error(error.message || "Failed to activate staff");
    }
  };

  const handleExportData = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/donations/export", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement("a");
        a.href = url;
        a.download = `donations-export-${
          new Date().toISOString().split("T")[0]
        }.csv`;
        document.body.appendChild(a);
        a.click();
        a.remove();
        window.URL.revokeObjectURL(url);
        toast.success("Data exported successfully");
      } else {
        throw new Error("Failed to export data");
      }
    } catch (error) {
      console.error("Error exporting data:", error);
      toast.error("Failed to export data");
    }
  };

  const generateStaffId = () => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let staffId = "STAFF-";
    for (let i = 0; i < 6; i++) {
      staffId += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return staffId;
  };

  const handleRefresh = async () => {
    setLoading(true);
    await checkAuthAndFetchData();
    toast.success("Data refreshed");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center  bg-linear-to-r from-green-50 to-white">
        <div className="text-center">
          <div className="h-12 w-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-4 text-gray-600 font-medium">
            Loading Admin Dashboard...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen w-full bg-linear-to-r from-green-50 to-white flex">
      {/* Mobile Overlay */}
      {sidebarOpen && isMobile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`sidebar fixed md:static top-0 left-0 z-50 w-64 bg-white shadow-xl p-6 flex flex-col border-r border-green-200 transition-transform duration-300 h-screen ${
          sidebarOpen ? "translate-x-0" : "-translate-x-64 md:translate-x-0"
        }`}
      >
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-lg  from-green-500 to-green-600 flex items-center justify-center">
              <FaMosque className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-green-700">Kanul Riza</h1>
              <p className="text-xs text-gray-500">Admin Panel</p>
            </div>
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
                ? "bg-linear-to-r from-green-500 to-green-600 text-white shadow-md"
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
                ? "bg-linear-to-r from-green-500 to-green-600 text-white shadow-md"
                : "text-gray-700 hover:bg-green-50"
            }`}
          >
            <FiDatabase size={20} /> Donations
          </button>

          <button
            onClick={() => {
              setActive("staff");
              setSidebarOpen(false);
            }}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              active === "staff"
                ? "bg-linear-to-r from-green-500 to-green-600 text-white shadow-md"
                : "text-gray-700 hover:bg-green-50"
            }`}
          >
            <FiUsers size={20} /> Staff Management
          </button>
        </nav>

        <div className="mt-auto pt-6 border-t border-gray-200">
          <div className="mb-4 p-3 bg-green-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-linear-to-r from-green-500 to-green-600 flex items-center justify-center text-white font-bold">
                {adminUser?.name?.charAt(0) || "A"}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-gray-900">
                  {adminUser?.name || "Admin"}
                </p>
                <p className="text-xs text-gray-500">
                  {adminUser?.email || "admin@kanulriza.org"}
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-3 p-3 rounded-lg text-red-600 hover:bg-red-50 transition-all border border-red-200"
          >
            <FiLogOut size={20} /> Logout
          </button>
        </div>
      </aside>

      {/* MAIN CONTENT */}
      <section className="flex-1 p-4 md:p-6 lg:p-8 overflow-y-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 md:mb-8 gap-4">
          <div>
            <div className="flex items-center gap-3">
              <h2 className="text-2xl md:text-3xl font-bold text-green-800">
                {active === "dashboard" && "Dashboard Overview"}
                {active === "charities" && "Donation Management"}
                {active === "staff" && "Staff Management"}
                {active === "analytics" && "Analytics"}
              </h2>
              <button
                onClick={handleRefresh}
                className="p-2 rounded-lg hover:bg-green-50 text-green-600"
                title="Refresh Data"
              >
                {/* <FiRefresh size={20} /> */}
              </button>
            </div>
            <p className="text-gray-600 mt-1">
              {active === "dashboard" &&
                "Monitor all activities and statistics"}
              {active === "charities" && "View and manage all donation records"}
              {active === "staff" && "Create and manage staff accounts"}
              {active === "analytics" && "Detailed reports and insights"}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {active === "charities" && (
              <button
                onClick={handleExportData}
                className="flex items-center gap-2 px-4 py-2 bg-white border border-green-500 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
              >
                <FiDownload size={18} /> Export
              </button>
            )}

            {active === "staff" && (
              <button
                onClick={() => {
                  setNewStaff({
                    ...newStaff,
                    staffId: generateStaffId(),
                  });
                  setShowAddStaffModal(true);
                }}
                className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-green-500 to-green-600 text-white rounded-lg hover:from-green-600 hover:to-green-700 transition-all shadow-sm"
              >
                <FiPlus /> Add Staff
              </button>
            )}

            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="menu-button md:hidden p-2 rounded-lg bg-linear-to-r from-green-500 to-green-600 text-white"
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
                      PKR {stats.totalDonations.toLocaleString()}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <FiDollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  {charities.length} total transactions
                </p>
              </div>

              <div className="p-5 bg-white rounded-xl shadow-sm border border-green-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Staff</p>
                    <p className="text-2xl md:text-3xl font-bold text-green-600 mt-2">
                      {stats.activeStaff}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FiUsers className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  {staffMembers.length} total staff members
                </p>
              </div>

              <div className="p-5 bg-white rounded-xl shadow-sm border border-green-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Donors</p>
                    <p className="text-2xl md:text-3xl font-bold text-green-600 mt-2">
                      {stats.totalDonors}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                    <FiUsers className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">Unique donors</p>
              </div>

              <div className="p-5 bg-white rounded-xl shadow-sm border border-green-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg. Donation</p>
                    <p className="text-2xl md:text-3xl font-bold text-green-600 mt-2">
                      PKR {stats.averageDonation.toFixed(2).toLocaleString()}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <FiCheckCircle className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  Average donation amount
                </p>
              </div>
            </div>

            {/* Recent Donations Table */}
            <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-800">
                  Recent Donations
                </h3>
                <button
                  onClick={() => setActive("charities")}
                  className="text-green-600 hover:text-green-700 font-medium text-sm"
                >
                  View All →
                </button>
              </div>
              <div className="overflow-x-auto">
                {charities.length === 0 ? (
                  <div className="p-8 text-center text-gray-500">
                    <FiDatabase className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                    <p>No donations recorded yet</p>
                  </div>
                ) : (
                  <table className="w-full">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="p-3 text-left text-sm font-medium text-gray-700">
                          Donor
                        </th>
                        <th className="p-3 text-left text-sm font-medium text-gray-700">
                          Amount
                        </th>
                        <th className="p-3 text-left text-sm font-medium text-gray-700">
                          Category
                        </th>
                        <th className="p-3 text-left text-sm font-medium text-gray-700">
                          Staff
                        </th>
                        <th className="p-3 text-left text-sm font-medium text-gray-700">
                          Date
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {charities.slice(0, 5).map((donation) => (
                        <tr
                          key={donation._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="p-3">
                            <div className="font-medium text-gray-900">
                              {donation.donorName}
                            </div>
                            <div className="text-sm text-gray-500">
                              {donation.email}
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="font-bold text-green-600">
                              PKR {donation.amount?.toLocaleString()}
                            </div>
                          </td>
                          <td className="p-3">
                            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm">
                              {donation.category}
                            </span>
                          </td>
                          <td className="p-3 text-gray-700">
                            {donation.staffName}
                          </td>
                          <td className="p-3 text-gray-600">
                            {new Date(donation.createdAt).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
        )}
{active === "charities" && (
  <div className="space-y-6">
    <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-gray-100 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-gray-800">All Donations</h3>
        <div className="flex items-center gap-3">
          <span className="text-sm text-gray-500">
            Showing {donations.length} donation{donations.length !== 1 && "s"}
          </span>
        </div>
      </div>

      {/* Empty State */}
      {donations.length === 0 ? (
        <div className="p-8 text-center text-gray-500">
          <FiDatabase className="h-16 w-16 mx-auto text-gray-300 mb-4" />
          <p className="text-lg font-medium mb-2">No donations found</p>
          <p className="text-gray-500">
            Donations will appear here once recorded
          </p>
        </div>
      ) : (
        /* Donations Table */
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px]">
            <thead className="bg-green-50">
              <tr>
                <th className="p-4 text-left font-semibold text-gray-700">Receipt</th>
                <th className="p-4 text-left font-semibold text-gray-700">Donor Name</th>
                <th className="p-4 text-left font-semibold text-gray-700">Amount</th>
                <th className="p-4 text-left font-semibold text-gray-700">Category</th>
                <th className="p-4 text-left font-semibold text-gray-700">Type</th>
                <th className="p-4 text-left font-semibold text-gray-700">Staff</th>
                <th className="p-4 text-left font-semibold text-gray-700">Date</th>
                <th className="p-4 text-left font-semibold text-gray-700">Email Sent</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {donations.map((donation) => (
                <tr key={donation._id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-4 font-mono text-sm text-gray-500">
                    {donation.receiptNumber || "-"}
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="font-medium text-gray-900">{donation.donorName || "-"}</div>
                      <div className="text-sm text-gray-500">{donation.email || "-"}</div>
                      <div className="text-xs text-gray-400">{donation.phone || "-"}</div>
                    </div>
                  </td>
                  <td className="p-4">
                    <div className="font-bold text-green-600">
                      PKR {donation.amount ? donation.amount.toLocaleString() : "-"}
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm">
                      {donation.category || "-"}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className="px-3 py-1 bg-purple-100 text-purple-700 rounded-full text-sm">
                      {donation.charityType || "-"}
                    </span>
                  </td>
                  <td className="p-4">
                    <div>
                      <div className="text-gray-700">{donation.staffName || "-"}</div>
                      <div className="text-xs text-gray-500">{donation.staffId || "-"}</div>
                    </div>
                  </td>
                  <td className="p-4 text-gray-600">
                    {donation.createdAt
                      ? new Date(donation.createdAt).toLocaleDateString()
                      : "-"}
                  </td>
                  <td className="p-4">
                    <span
                      className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm ${
                        donation.emailSent
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {donation.emailSent ? <FiCheckCircle size={14} /> : <FiClock size={14} />}
                      {donation.emailSent ? "Sent" : "Pending"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  </div>
)}

        {/* STAFF MANAGEMENT */}
        {active === "staff" && (
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800">
                  Staff Members
                </h3>
              </div>

              {staffMembers.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <FiUsers className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-lg font-medium mb-2">
                    No staff members found
                  </p>
                  <p className="text-gray-500">
                    Add staff members to get started
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-green-50">
                      <tr>
                        <th className="p-4 text-left font-semibold text-gray-700">
                          Staff ID
                        </th>
                        <th className="p-4 text-left font-semibold text-gray-700">
                          Name
                        </th>
                        <th className="p-4 text-left font-semibold text-gray-700">
                          Email
                        </th>
                        <th className="p-4 text-left font-semibold text-gray-700">
                          Phone
                        </th>
                        <th className="p-4 text-left font-semibold text-gray-700">
                          Role
                        </th>
                        <th className="p-4 text-left font-semibold text-gray-700">
                          Status
                        </th>
                        <th className="p-4 text-left font-semibold text-gray-700">
                          Last Login
                        </th>
                        <th className="p-4 text-left font-semibold text-gray-700">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {staffMembers.map((member) => (
                        <tr
                          key={member._id}
                          className="hover:bg-gray-50 transition-colors"
                        >
                          <td className="p-4 font-mono text-sm text-gray-500">
                            {member.staffId}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-gradient-to-r from-green-500 to-green-600 flex items-center justify-center text-white font-bold">
                                {member.name?.charAt(0) || "S"}
                              </div>
                              <span className="font-medium text-gray-900">
                                {member.name}
                              </span>
                            </div>
                          </td>
                          <td className="p-4 text-gray-700">{member.email}</td>
                          <td className="p-4 text-gray-700">{member.phone}</td>
                          <td className="p-4">
                            <span
                              className={`px-3 py-1 rounded-full text-sm ${
                                member.role === "admin"
                                  ? "bg-red-100 text-red-700"
                                  : "bg-blue-100 text-blue-700"
                              }`}
                            >
                              {member.role}
                            </span>
                          </td>
                          <td className="p-4">
                            <span
                              className={`px-3 py-1 rounded-full text-sm ${
                                member.active
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {member.active ? "Active" : "Inactive"}
                            </span>
                          </td>
                          <td className="p-4 text-gray-600">
                            {member.lastLogin
                              ? new Date(member.lastLogin).toLocaleDateString()
                              : "Never"}
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {member.active ? (
                                <button
                                  onClick={() => handleDeleteStaff(member._id)}
                                  className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Deactivate"
                                >
                                  <FiTrash2 size={16} />
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    handleActivateStaff(member._id)
                                  }
                                  className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Activate"
                                >
                                  <FiCheckCircle size={16} />
                                </button>
                              )}
                              <button
                                onClick={() => {
                                  // Navigate to edit staff page
                                  router.push(`/admin/staff/${member._id}`);
                                }}
                                className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                title="Edit"
                              >
                                <FiEdit size={16} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
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
                <h3 className="text-xl font-bold text-gray-900">
                  Add New Staff
                </h3>
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
                  Staff ID
                </label>
                <input
                  type="text"
                  value={newStaff.staffId}
                  readOnly
                  className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Auto-generated Staff ID
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={newStaff.name}
                  onChange={(e) =>
                    setNewStaff({ ...newStaff, name: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                  placeholder="Enter full name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={newStaff.email}
                  onChange={(e) =>
                    setNewStaff({ ...newStaff, email: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                  placeholder="staff@kanulriza.org"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  value={newStaff.phone}
                  onChange={(e) =>
                    setNewStaff({ ...newStaff, phone: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                  placeholder="03XXXXXXXXX"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Role *
                </label>
                <select
                  value={newStaff.role}
                  onChange={(e) =>
                    setNewStaff({ ...newStaff, role: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                >
                  <option value="collector">Collector</option>
                  <option value="supervisor">Supervisor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Temporary Password *
                </label>
                <input
                  type="text"
                  value={newStaff.password}
                  onChange={(e) =>
                    setNewStaff({ ...newStaff, password: e.target.value })
                  }
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 outline-none transition"
                  placeholder="Create secure password"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Share this password securely with the staff member. They
                  should change it on first login.
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
                disabled={
                  !newStaff.name ||
                  !newStaff.email ||
                  !newStaff.password ||
                  !newStaff.phone
                }
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
