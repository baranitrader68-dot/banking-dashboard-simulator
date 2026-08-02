import { useEffect, useState } from "react";

type Transaction = {
  id: number;
  type: string;
  amount: number;
  description: string;
  createdAt: string;
};

function Transactions() {
  const storedUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const userId = storedUser.id;

  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const [loading, setLoading] =
    useState(true);

  // =========================
  // FETCH TRANSACTIONS
  // =========================

  const fetchTransactions = async () => {
    try {
      setLoading(true);

      const response = await fetch(
        `http://https://banking-dashboard-simulator.onrender.com/api/account/${userId}/transactions`
      );

      const data =
        await response.json();

      if (response.ok) {
        setTransactions(data);
      }

    } catch (error) {
      console.error(
        "Failed to fetch transactions",
        error
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // LOAD TRANSACTIONS
  // =========================

  useEffect(() => {
    if (userId) {
      fetchTransactions();
    }
  }, [userId]);

  return (
    <div className="bg-white p-6 rounded-2xl shadow">

      <div className="flex justify-between items-center">

        <div>

          <h1 className="text-3xl font-bold">
            Transactions 💸
          </h1>

          <p className="mt-2 text-gray-600">
            View all your transactions here.
          </p>

        </div>

        <button
          onClick={fetchTransactions}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Refresh 🔄
        </button>

      </div>

      {loading ? (

        <p className="mt-8 text-gray-600">
          Loading transactions...
        </p>

      ) : transactions.length === 0 ? (

        <p className="mt-8 text-gray-600">
          No transactions found.
        </p>

      ) : (

        <div className="mt-8 space-y-4">

          {transactions.map(
            (transaction) => (

              <div
                key={transaction.id}
                className="border rounded-xl p-4 flex justify-between items-center"
              >

                <div>

                  <h2 className="font-semibold text-lg">
                    {transaction.description}
                  </h2>

                  <p className="text-sm text-gray-500">
                    {new Date(
                      transaction.createdAt
                    ).toLocaleString()}
                  </p>

                  <span
                    className={`inline-block mt-2 px-3 py-1 rounded-full text-sm ${
                      transaction.type === "CREDIT"
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {transaction.type}
                  </span>

                </div>

                <p
                  className={`text-xl font-bold ${
                    transaction.type === "CREDIT"
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >

                  {transaction.type === "CREDIT"
                    ? "+"
                    : "-"}

                  ₹
                  {transaction.amount.toLocaleString(
                    "en-IN"
                  )}

                </p>

              </div>

            )
          )}

        </div>

      )}

    </div>
  );
}

export default Transactions;