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
    useState<AdminStats>({
      totalUsers: 0,
      totalAccounts: 0,
      totalCards: 0,
      totalTransactions: 0,
      totalBudgets: 0,
      totalBalance: 0,
    });

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState("");

  const fetchAdminStats = async () => {
    try {
      setLoading(true);
      setError("");

      console.log(
        "Fetching:",
        `${API_URL}/api/admin/stats`
      );

      const response = await fetch(
        `${API_URL}/api/admin/stats`
      );

      const data = await response.json();

      console.log(
        "Response:",
        response.status,
        data
      );

      if (!response.ok) {
        throw new Error(
          data.message ||
            "Failed to load admin dashboard"
        );
      }

      setStats({
        totalUsers: data.totalUsers ?? 0,
        totalAccounts:
          data.totalAccounts ?? 0,
        totalCards:
          data.totalCards ?? 0,
        totalTransactions:
          data.totalTransactions ?? 0,
        totalBudgets:
          data.totalBudgets ?? 0,
        totalBalance:
          Number(data.totalBalance) || 0,
      });
    } catch (err: any) {
      console.error(err);

      setError(
        err.message ||
          "Failed to load admin dashboard ❌"
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

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-800">
          Admin Dashboard 👑
        </h1>

        <p className="mt-2 text-gray-600">
          Monitor your banking platform.
        </p>
      </div>

      {error && (
        <div className="mb-6 rounded-xl border border-red-300 bg-red-100 p-4 text-red-700">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">

        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-gray-500">
            Total Users 👥
          </p>

          <h2 className="mt-3 text-3xl font-bold text-blue-600">
            {stats.totalUsers}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-gray-500">
            Total Accounts 🏦
          </p>

          <h2 className="mt-3 text-3xl font-bold text-purple-600">
            {stats.totalAccounts}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-gray-500">
            Total Cards 💳
          </p>

          <h2 className="mt-3 text-3xl font-bold text-orange-600">
            {stats.totalCards}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-gray-500">
            Transactions 💸
          </p>

          <h2 className="mt-3 text-3xl font-bold text-red-600">
            {stats.totalTransactions}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-gray-500">
            Total Budgets 🎯
          </p>

          <h2 className="mt-3 text-3xl font-bold text-pink-600">
            {stats.totalBudgets}
          </h2>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow">
          <p className="text-gray-500">
            Total Balance 💰
          </p>

          <h2 className="mt-3 text-3xl font-bold text-green-600">
            ₹
            {stats.totalBalance.toLocaleString(
              "en-IN"
            )}
          </h2>
        </div>

      </div>

      <button
        onClick={fetchAdminStats}
        className="mt-8 rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700"
      >
        Refresh Stats 🔄
      </button>
    </div>
  );
}

export default AdminDashboard;