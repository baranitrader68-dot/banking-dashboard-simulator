import { useEffect, useState } from "react";

function Dashboard() {
  const userId = 2;

  const [balance, setBalance] = useState<number | null>(null);
  const [currency, setCurrency] = useState("INR");
  const [amount, setAmount] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchAccountBalance = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/account/${userId}`
      );

      const data = await response.json();

      if (response.ok) {
        setBalance(data.balance);
        setCurrency(data.currency);
      }
    } catch (error) {
      console.error("Failed to fetch balance", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAccountBalance();
  }, []);

  const handleAddMoney = async () => {
    const money = Number(amount);

    if (!money || money <= 0) {
      setMessage("Please enter a valid amount ❌");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/account/${userId}/add-money`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            amount: money,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setBalance(data.balance);
        setAmount("");
        setMessage("Money added successfully! 🎉");
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      setMessage("Server connection failed ❌");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <h1 className="text-3xl font-bold text-gray-800">
        Banking Dashboard 🏦
      </h1>

      <p className="mt-2 text-gray-600">
        Welcome to your banking dashboard
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">Total Balance</p>

          <h2 className="text-3xl font-bold mt-2">
            {loading
              ? "Loading..."
              : `₹${balance?.toLocaleString("en-IN")}`}
          </h2>

          <p className="text-sm text-gray-400 mt-2">
            Currency: {currency}
          </p>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">Income</p>

          <h2 className="text-3xl font-bold mt-2">
            ₹0
          </h2>
        </div>

        <div className="bg-white p-6 rounded-2xl shadow">
          <p className="text-gray-500">Expenses</p>

          <h2 className="text-3xl font-bold mt-2">
            ₹0
          </h2>
        </div>
      </div>

      <div className="bg-white p-6 rounded-2xl shadow mt-8">
        <h2 className="text-xl font-bold">
          Add Money 💰
        </h2>

        <div className="flex gap-4 mt-4">
          <input
            type="number"
            placeholder="Enter amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="border p-3 rounded-lg flex-1"
          />

          <button
            onClick={handleAddMoney}
            className="bg-green-600 text-white px-6 rounded-lg hover:bg-green-700"
          >
            Add Money
          </button>
        </div>

        {message && (
          <p className="mt-4 font-semibold">
            {message}
          </p>
        )}
      </div>

      <div className="bg-white p-6 rounded-2xl shadow mt-8">
        <h2 className="text-xl font-bold">
          Recent Transactions
        </h2>

        <p className="mt-4 text-gray-600">
          No transactions yet.
        </p>
      </div>
    </div>
  );
}

export default Dashboard;