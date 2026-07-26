import { useEffect, useState } from "react";

const API_URL =
  "https://banking-dashboard-simulator.onrender.com";

type AdminStats = {
  totalUsers: number;
  totalAccounts: number;
  totalCards: number;
  totalTransactions: number;
  totalBudgets: number;
  totalBalance: number;
};

function AdminDashboard() {
  const [stats, setStats] =
    useState<AdminStats | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const fetchAdminStats = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/admin/stats`
      );

      const data = await response.json();

      if (response.ok) {
        setStats(data);
      } else {
        setError(
          data.message ||
            "Failed to load admin dashboard ❌"
        );
      }
    } catch (error) {
      console.error(
        "Admin stats error:",
        error
      );

      setError(
        "Server connection failed ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminStats();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-bold">
          Loading Admin Dashboard...
        </h1>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-xl font-bold text-red-600">
          {error}
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}

      <div className="mb-8">

        <h1 className="text-3xl font-bold text-gray-800">
          Admin Dashboard 🛡️
        </h1>

        <p className="text-gray-600 mt-2">
          Banking Dashboard Administration Panel
        </p>

      </div>

      {/* STATISTICS CARDS */}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

        {/* TOTAL USERS */}

        <div className="bg-white p-6 rounded-2xl shadow">

          <p className="text-gray-500">
            Total Users 👥
          </p>

          <h2 className="text-3xl font-bold mt-3 text-blue-600">
            {stats?.totalUsers ?? 0}
          </h2>

        </div>

        {/* TOTAL ACCOUNTS */}

        <div className="bg-white p-6 rounded-2xl shadow">

          <p className="text-gray-500">
            Total Accounts 🏦
          </p>

          <h2 className="text-3xl font-bold mt-3 text-purple-600">
            {stats?.totalAccounts ?? 0}
          </h2>

        </div>

        {/* TOTAL BALANCE */}

        <div className="bg-white p-6 rounded-2xl shadow">

          <p className="text-gray-500">
            Total Bank Balance 💰
          </p>

          <h2 className="text-3xl font-bold mt-3 text-green-600">
            ₹
            {(
              stats?.totalBalance ?? 0
            ).toLocaleString("en-IN")}
          </h2>

        </div>

        {/* TOTAL CARDS */}

        <div className="bg-white p-6 rounded-2xl shadow">

          <p className="text-gray-500">
            Total Cards 💳
          </p>

          <h2 className="text-3xl font-bold mt-3 text-orange-600">
            {stats?.totalCards ?? 0}
          </h2>

        </div>

        {/* TOTAL TRANSACTIONS */}

        <div className="bg-white p-6 rounded-2xl shadow">

          <p className="text-gray-500">
            Total Transactions 💸
          </p>

          <h2 className="text-3xl font-bold mt-3 text-red-600">
            {stats?.totalTransactions ?? 0}
          </h2>

        </div>

        {/* TOTAL BUDGETS */}

        <div className="bg-white p-6 rounded-2xl shadow">

          <p className="text-gray-500">
            Total Budgets 🎯
          </p>

          <h2 className="text-3xl font-bold mt-3 text-pink-600">
            {stats?.totalBudgets ?? 0}
          </h2>

        </div>

      </div>

      {/* SYSTEM STATUS */}

      <div className="bg-white p-6 rounded-2xl shadow mt-8">

        <h2 className="text-xl font-bold">
          System Status ⚙️
        </h2>

        <div className="mt-4 flex items-center gap-3">

          <div className="w-4 h-4 bg-green-500 rounded-full" />

          <p className="text-green-600 font-semibold">
            All Banking Services Operational
          </p>

        </div>

      </div>

    </div>
  );
}

export default AdminDashboard;