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
  FiDownload,
  FiDollarSign,
  FiCheckCircle,
  FiClock,
  FiTrash2,
  
  FiMail,
  FiPhone,
  FiCalendar,
  FiUser,
  FiRefreshCw,
  FiSearch,
} from "react-icons/fi";
import { FaMosque, } from "react-icons/fa";

export default function AdminDashboard() {
  const router = useRouter();
  const [active, setActive] = useState("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [loading, setLoading] = useState(true);
  const [donations, setDonations] = useState([]);
  const [staffMembers, setStaffMembers] = useState([]);
  const [stats, setStats] = useState({
    totalDonations: 0,
    activeStaff: 0,
    totalDonors: 0,
    averageDonation: 0,
    thisMonthDonations: 0,
    todayDonations: 0,
  });
  const [adminUser, setAdminUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [deleteLoading, setDeleteLoading] = useState(null);

  // Check mobile view
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Check authentication and fetch data
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

    fetchAllData();
  }, [router]);

  // Fetch all data
  const fetchAllData = async () => {
    setLoading(true);
    try {
      await Promise.all([fetchDonations(), fetchStaffMembers()]);
      calculateStats();
    } catch (error) {
      console.error("Error fetching data:", error);
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  // Fetch donations from API
  const fetchDonations = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      if (!token) {
        console.error("No admin token found");
        return;
      }

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
      setDonations(data.data.donations || []);
    } catch (err) {
      console.error("Fetch donations error:", err);
      setDonations([]);
    }
  };

  // Fetch staff members
  const fetchStaffMembers = async () => {
    try {
      const token = localStorage.getItem("admin_token");
      const response = await fetch("/api/staff/getAllStaff", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const result = await response.json();
      if (result.success) {
        setStaffMembers(result.data.staff || []);
      } else {
        console.error("Failed to fetch staff members");
        setStaffMembers([]);
      }
    } catch (error) {
      console.error("Error fetching staff:", error);
      setStaffMembers([]);
    }
  };

  // Calculate statistics from donations
 const calculateStats = () => {
  // 1. Handle Empty State
  if (!donations || donations.length === 0) {
    setStats({
      totalDonations: 0,
      activeStaff: staffMembers.filter((s) => s.active).length,
      totalDonors: 0,
      averageDonation: 0,
      thisMonthDonations: 0,
      todayDonations: 0,
    });
    return;
  }

  const now = new Date();
  const thisMonth = now.getMonth();
  const thisYear = now.getFullYear();
  const today = now.getDate();

  // 2. Calculate Total Amount (Rounded)
  const totalAmount = donations.reduce((sum, donation) => {
    return sum + (parseFloat(donation.amount) || 0);
  }, 0);

  // 3. Calculate This Month's Amount
  const thisMonthAmount = donations.reduce((sum, donation) => {
    if (!donation.createdAt) return sum;
    const donationDate = new Date(donation.createdAt);
    if (donationDate.getMonth() === thisMonth && donationDate.getFullYear() === thisYear) {
      return sum + (parseFloat(donation.amount) || 0);
    }
    return sum;
  }, 0);

  // 4. Calculate Today's Amount
  const todayAmount = donations.reduce((sum, donation) => {
    if (!donation.createdAt) return sum;
    const donationDate = new Date(donation.createdAt);
    if (
      donationDate.getDate() === today &&
      donationDate.getMonth() === thisMonth &&
      donationDate.getFullYear() === thisYear
    ) {
      return sum + (parseFloat(donation.amount) || 0);
    }
    return sum;
  }, 0);

  // 5. Get unique donors
  const uniqueDonors = new Set(
    donations.map((donation) => donation.email).filter(Boolean)
  );

  // 6. Calculate Average
  const rawAvg = donations.length > 0 ? totalAmount / donations.length : 0;

  // 7. Set Stats with Decimals Removed
  setStats({
    totalDonations: Math.floor(totalAmount), // Removes decimals
    activeStaff: staffMembers.filter((s) => s.active).length,
    totalDonors: uniqueDonors.size,
    averageDonation: Math.floor(rawAvg),    // Removes decimals
    thisMonthDonations: Math.floor(thisMonthAmount), // Removes decimals
    todayDonations: Math.floor(todayAmount), // Removes decimals
  });
};

  // Recalculate stats when donations or staffMembers change
  useEffect(() => {
    calculateStats();
  }, [donations, staffMembers]);

  // Filter donations based on search term
  const filteredDonations = donations.filter((donation) =>
    searchTerm === "" ||
    donation.donorName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donation.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donation.phone?.includes(searchTerm) ||
    donation.receiptNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donation.staffName?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Delete donation function
  const handleDeleteDonation = async (donationId, donorName) => {
  // 1. Confirmation Dialog
  if (!window.confirm(`Are you sure you want to delete the donation from ${donorName || "this donor"}?`)) {
    return;
  }

  setDeleteLoading(donationId);
  
  try {
    const token = localStorage.getItem("admin_token");
    
    // 2. API Call
    const response = await fetch(`/api/deleteDonation/${donationId}`, {
      method: "DELETE",
      headers: {
        "Authorization": `Bearer ${token}`,
        "Content-Type": "application/json"
      },
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || "Failed to delete donation");
    }

    // 3. Success Feedback
    toast.success("Donation deleted successfully");
    
    // 4. Update UI State
    setDonations((prev) => prev.filter(d => d._id !== donationId));
    
    if (typeof calculateStats === "function") {
      calculateStats();
    }

  } catch (error) {
    console.error("Error deleting donation:", error);
    toast.error(error.message || "An unexpected error occurred");
  } finally {
    setDeleteLoading(null);
  }
};

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_user");
    toast.success("Logged out successfully");
    router.push("/admin_login");
  };

  // Export data function
  const handleExportData = async () => {
    try {
      const token = localStorage.getItem("admin_token");
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
        a.download = `donations-export-${new Date().toISOString().split("T")[0]}.csv`;
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

  // Refresh data
  const handleRefresh = async () => {
    setLoading(true);
    await fetchAllData();
    toast.success("Data refreshed");
  };

  // Format date for display
  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Format currency
  const formatCurrency = (amount) => {
    return `PKR ${parseFloat(amount || 0).toLocaleString("en-PK", {
      // minimumFractionDigits: 2,
      // maximumFractionDigits: 2,
    })}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-linear-to-r from-green-50 to-white">
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
            <div className="h-10 w-10 rounded-lg bg-linear-to-r from-green-500 to-green-600 flex items-center justify-center">
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
              setActive("donations");
              setSidebarOpen(false);
            }}
            className={`flex items-center gap-3 p-3 rounded-lg transition-all ${
              active === "donations"
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
                {active === "donations" && "Donation Management"}
                {active === "staff" && "Staff Management"}
              </h2>
              <button
                onClick={handleRefresh}
                className="p-2 rounded-lg hover:bg-green-50 text-green-600"
                title="Refresh Data"
              >
                <FiRefreshCw size={20} />
              </button>
            </div>
            <p className="text-gray-600 mt-1">
              {active === "dashboard" && "Monitor all activities and statistics"}
              {active === "donations" && "View and manage all donation records"}
              {active === "staff" && "Manage staff accounts and permissions"}
            </p>
          </div>

          <div className="flex items-center gap-4">
            {active === "donations" && (
              <>
                <div className="relative">
                  <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    placeholder="Search donations..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  />
                </div>
                <button
                  onClick={handleExportData}
                  className="flex items-center gap-2 px-4 py-2 bg-white border border-green-500 text-green-600 rounded-lg hover:bg-green-50 transition-colors"
                >
                  <FiDownload size={18} /> Export
                </button>
              </>
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
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-5 bg-white rounded-xl shadow-sm border border-green-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Donations</p>
                    <p className="text-2xl md:text-3xl font-bold text-green-600 mt-2">
                      {formatCurrency(stats.totalDonations)}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-green-100 flex items-center justify-center">
                    <FiDollarSign className="h-6 w-6 text-green-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  {donations.length} total transactions
                </p>
              </div>

              <div className="p-5 bg-white rounded-xl shadow-sm border border-green-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Today`s Donations</p>
                    <p className="text-2xl md:text-3xl font-bold text-green-600 mt-2">
                      {formatCurrency(stats.todayDonations)}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-blue-100 flex items-center justify-center">
                    <FiCalendar className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  This month: {formatCurrency(stats.thisMonthDonations)}
                </p>
              </div>

              {/* <div className="p-5 bg-white rounded-xl shadow-sm border border-green-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Staff</p>
                    <p className="text-2xl md:text-3xl font-bold text-green-600 mt-2">
                      {stats.activeStaff}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-purple-100 flex items-center justify-center">
                    <FiUsers className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  {staffMembers.length} total staff members
                </p>
              </div> */}

              <div className="p-5 bg-white rounded-xl shadow-sm border border-green-100 hover:shadow-md transition-shadow">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Avg. Donation</p>
                    <p className="text-2xl md:text-3xl font-bold text-green-600 mt-2">
                      {formatCurrency(stats.averageDonation)}
                    </p>
                  </div>
                  <div className="h-12 w-12 rounded-lg bg-emerald-100 flex items-center justify-center">
                    <FiCheckCircle className="h-6 w-6 text-emerald-600" />
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-3">
                  {stats.totalDonors} unique donors
                </p>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent Donations */}
              <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Recent Donations
                  </h3>
                  <button
                    onClick={() => setActive("donations")}
                    className="text-green-600 hover:text-green-700 font-medium text-sm"
                  >
                    View All →
                  </button>
                </div>
                <div className="divide-y divide-gray-100">
                  {donations.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <FiDatabase className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                      <p>No donations recorded yet</p>
                    </div>
                  ) : (
                    donations.slice(0, 5).map((donation) => (
                      <div key={donation._id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{donation.donorName || "N/A"}</p>
                            <p className="text-sm text-gray-500">{donation.email || "No email"}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">{formatCurrency(donation.amount)}</p>
                            <p className="text-xs text-gray-500">{donation.category || "General"}</p>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>

              {/* Staff Activity */}
              <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
                <div className="p-5 border-b border-gray-100 flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-800">
                    Staff Activity
                  </h3>
                  <button
                    onClick={() => setActive("staff")}
                    className="text-green-600 hover:text-green-700 font-medium text-sm"
                  >
                    View All →
                  </button>
                </div>
                <div className="divide-y divide-gray-100">
                  {staffMembers.length === 0 ? (
                    <div className="p-8 text-center text-gray-500">
                      <FiUsers className="h-12 w-12 mx-auto text-gray-300 mb-3" />
                      <p>No staff members found</p>
                    </div>
                  ) : (
                    staffMembers.slice(0, 5).map((staff) => (
                      <div key={staff._id} className="p-4 hover:bg-gray-50 transition-colors">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-linear-to-r from-green-500 to-green-600 flex items-center justify-center text-white font-bold">
                              {staff.name?.charAt(0) || "S"}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{staff.name}</p>
                              <p className="text-xs text-gray-500">{staff.role || "Collector"}</p>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded-full text-xs ${
                            staff.active 
                              ? "bg-emerald-100 text-emerald-700" 
                              : "bg-gray-100 text-gray-700"
                          }`}>
                            {staff.active ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* DONATIONS MANAGEMENT */}
        {active === "donations" && (
          <div className="space-y-6">
            {/* Stats Bar */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-white rounded-xl border border-green-100">
                <p className="text-sm text-gray-600">Total Donations</p>
                <p className="text-xl font-bold text-green-600">{formatCurrency(stats.totalDonations)}</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-green-100">
                <p className="text-sm text-gray-600">Total Records</p>
                <p className="text-xl font-bold text-green-600">{donations.length}</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-green-100">
                <p className="text-sm text-gray-600">Showing</p>
                <p className="text-xl font-bold text-green-600">{filteredDonations.length} of {donations.length}</p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  All Donations
                </h3>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-gray-500">
                    {filteredDonations.length} donation{filteredDonations.length !== 1 && "s"}
                  </span>
                </div>
              </div>

              {filteredDonations.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <FiDatabase className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-lg font-medium mb-2">No donations found</p>
                  <p className="text-gray-500">
                    {searchTerm ? "Try a different search term" : "Donations will appear here once recorded"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[800px]">
                    <thead className="bg-green-50">
                      <tr>
                        <th className="p-4 text-left font-semibold text-gray-700">Receipt</th>
                        <th className="p-4 text-left font-semibold text-gray-700">Donor Information</th>
                        <th className="p-4 text-left font-semibold text-gray-700">Amount</th>
                        <th className="p-4 text-left font-semibold text-gray-700">Details</th>
                        <th className="p-4 text-left font-semibold text-gray-700">Staff</th>
                        <th className="p-4 text-left font-semibold text-gray-700">Date</th>
                        <th className="p-4 text-left font-semibold text-gray-700">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {filteredDonations.map((donation) => (
                        <tr key={donation._id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4">
                            <div className="font-mono text-sm text-gray-900 bg-gray-50 p-2 rounded border">
                              {donation.receiptNumber || "N/A"}
                            </div>
                          </td>
                          <td className="p-4">
                            <div>
                              <div className="font-medium text-gray-900 flex items-center gap-2">
                                <FiUser className="h-4 w-4 text-gray-400" />
                                {donation.donorName || "-"}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                <FiMail className="h-3 w-3" />
                                {donation.email || "No email"}
                              </div>
                              <div className="text-sm text-gray-500 flex items-center gap-1 mt-1">
                                <FiPhone className="h-3 w-3" />
                                {donation.phone || "No phone"}
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="font-bold text-green-600">
                              {formatCurrency(donation.amount)}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1">
                              <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                                {donation.category || "-"}
                              </span>
                              <span className="px-2 py-1 bg-purple-100 text-purple-700 rounded text-xs block">
                                {donation.charityType || "-"}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div>
                              <div className="text-gray-700">{donation.staffName || "-"}</div>
                              {donation.notes && (
                                <div className="text-xs text-gray-500 mt-1 truncate max-w-xs">
                                  {donation.notes}
                                </div>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="text-sm text-gray-600">
                              {formatDate(donation.createdAt)}
                            </div>
                            <div className="mt-1">
                              <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs ${
                                donation.emailSent
                                  ? "bg-emerald-100 text-emerald-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}>
                                {donation.emailSent ? <FiCheckCircle size={12} /> : <FiClock size={12} />}
                                {donation.emailSent ? "Email Sent" : "Email Pending"}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => handleDeleteDonation(donation._id, donation.donorName)}
                                disabled={deleteLoading === donation._id}
                                className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors disabled:opacity-50"
                                title="Delete"
                              >
                                {deleteLoading === donation._id ? (
                                  <div className="h-4 w-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin"></div>
                                ) : (
                                  <FiTrash2 size={16} />
                                )}
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

        {/* STAFF MANAGEMENT */}
        {active === "staff" && (
          <div className="space-y-6">
            {/* Staff Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-white rounded-xl border border-green-100">
                <p className="text-sm text-gray-600">Total Staff</p>
                <p className="text-xl font-bold text-green-600">{staffMembers.length}</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-green-100">
                <p className="text-sm text-gray-600">Active Staff</p>
                <p className="text-xl font-bold text-green-600">{stats.activeStaff}</p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-green-100">
                <p className="text-sm text-gray-600">Collectors</p>
                <p className="text-xl font-bold text-green-600">
                  {staffMembers.filter(s => s.role === 'collector').length}
                </p>
              </div>
              <div className="p-4 bg-white rounded-xl border border-green-100">
                <p className="text-sm text-gray-600">Admins</p>
                <p className="text-xl font-bold text-green-600">
                  {staffMembers.filter(s => s.role === 'admin').length}
                </p>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
              <div className="p-5 border-b border-gray-100">
                <h3 className="text-lg font-semibold text-gray-800">
                  Staff Members
                </h3>
              </div>

              {staffMembers.length === 0 ? (
                <div className="p-8 text-center text-gray-500">
                  <FiUsers className="h-16 w-16 mx-auto text-gray-300 mb-4" />
                  <p className="text-lg font-medium mb-2">No staff members found</p>
                  <p className="text-gray-500">
                    Staff members will appear here once registered
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead className="bg-green-50">
                      <tr>
                        <th className="p-4 text-left font-semibold text-gray-700">Staff Info</th>
                        <th className="p-4 text-left font-semibold text-gray-700">Contact</th>
                        <th className="p-4 text-left font-semibold text-gray-700">Role</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {staffMembers.map((staff) => (
                        <tr key={staff._id} className="hover:bg-gray-50 transition-colors">
                          <td className="p-4">
                            <div className="flex items-center gap-3">
                              <div className="h-10 w-10 rounded-full bg-linear-to-r from-green-500 to-green-600 flex items-center justify-center text-white font-bold">
                                {staff.name?.charAt(0) || "S"}
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{staff.name}</p>
                                <p className="text-xs text-gray-500">Joined: {formatDate(staff.createdAt)}</p>
                              </div>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="space-y-1">
                              <p className="text-gray-700 flex items-center gap-2">
                                <FiMail className="h-4 w-4 text-gray-400" />
                                {staff.email}
                              </p>
                              <p className="text-gray-700 flex items-center gap-2">
                                <FiPhone className="h-4 w-4 text-gray-400" />
                                {staff.phone || "N/A"}
                              </p>
                            </div>
                          </td>
                          <td className="p-4">
                            <span className={`px-3 py-1 rounded-full text-sm ${
                              staff.role === "admin"
                                ? "bg-red-100 text-red-700"
                                : "bg-blue-100 text-blue-700"
                            }`}>
                              {staff.role || "collector"}
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
      </section>
    </main>
  );
}