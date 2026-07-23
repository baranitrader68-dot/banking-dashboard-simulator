import { useEffect, useState } from "react";

type AdminStats = {
  totalUsers: number;
  totalAccounts: number;
  totalCards: number;
  totalTransactions: number;
  totalBudgets: number;
  totalBalance: number;
};

function Admin() {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchAdminStats = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/api/admin/stats"
      );

      const data = await response.json();

      if (response.ok) {
        setStats(data);
      }
    } catch (error) {
      console.error(
        "Failed to fetch admin stats",
        error
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
      <div className="p-8">
        <p className="text-gray-600">
          Loading admin dashboard...
        </p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="p-8">
        <p className="text-red-600">
          Failed to load admin dashboard ❌
        </p>
      </div>
    );
  }

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold text-gray-800">
        Admin Dashboard 👑
      </h1>

      <p className="text-gray-600 mt-2">
        Monitor your banking platform.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">
            Total Users 👥
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {stats.totalUsers}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">
            Total Accounts 🏦
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {stats.totalAccounts}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">
            Total Cards 💳
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {stats.totalCards}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">
            Transactions 💸
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {stats.totalTransactions}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">
            Total Budgets 🎯
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {stats.totalBudgets}
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">
            Total Balance 💰
          </p>

          <h2 className="text-3xl font-bold mt-2">
            ₹{stats.totalBalance.toLocaleString("en-IN")}
          </h2>
        </div>

      </div>

      <button
        onClick={fetchAdminStats}
        className="mt-8 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
      >
        Refresh Stats 🔄
      </button>

    </div>
  );
}

export default Admin;