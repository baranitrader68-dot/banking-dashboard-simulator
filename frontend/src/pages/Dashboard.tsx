import { useEffect, useState } from "react";

const API_URL =
  "https://banking-dashboard-simulator.onrender.com";

type Transaction = {
  id: number;
  type: string;
  amount: number;
  description: string;
  createdAt: string;
};

type Card = {
  id: number;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
  status: string;
};

type Budget = {
  id: number;
  category: string;
  amount: number;
  spent: number;
  createdAt: string;
};

type Notification = {
  id: number;
  title: string;
  message: string;
  isRead: boolean;
  createdAt: string;
};

function Dashboard() {
  // =========================
  // GET USER
  // =========================

  const storedUser = localStorage.getItem("user");

  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

  const userId = user?.id;

  const token = localStorage.getItem("token");

  // =========================
  // STATES
  // =========================

  const [balance, setBalance] =
    useState<number | null>(null);

  const [currency, setCurrency] =
    useState("INR");

  const [addMoneyAmount, setAddMoneyAmount] =
    useState("");

  const [sendMoneyAmount, setSendMoneyAmount] =
    useState("");

  const [recipientEmail, setRecipientEmail] =
    useState("");

  const [message, setMessage] =
    useState("");

  const [transactions, setTransactions] =
    useState<Transaction[]>([]);

  const [income, setIncome] =
    useState(0);

  const [expenses, setExpenses] =
    useState(0);

  const [card, setCard] =
    useState<Card | null>(null);

  const [budgets, setBudgets] =
    useState<Budget[]>([]);

  const [budgetCategory, setBudgetCategory] =
    useState("");

  const [budgetAmount, setBudgetAmount] =
    useState("");

  const [notifications, setNotifications] =
    useState<Notification[]>([]);

  const [loading, setLoading] =
    useState(true);

  // =========================
  // AUTH HEADERS
  // =========================

  const authHeaders = {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };

  // =========================
  // FETCH ACCOUNT BALANCE
  // =========================

  const fetchAccountBalance = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/account/${userId}`,
        {
          headers: authHeaders,
        }
      );

      const data = await response.json();

      console.log(
        "ACCOUNT BALANCE RESPONSE:",
        data
      );

      if (response.ok) {
        setBalance(
          Number(data.balance ?? 0)
        );

        setCurrency(
          data.currency ?? "INR"
        );
      } else {
        console.error(
          "Balance API error:",
          data
        );

        setBalance(0);
      }

    } catch (error) {
      console.error(
        "Failed to fetch balance",
        error
      );

      setBalance(0);

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // FETCH TRANSACTIONS
  // =========================

  const fetchTransactions = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/account/${userId}/transactions`,
        {
          headers: authHeaders,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setTransactions(data);

        const totalIncome = data
          .filter(
            (transaction: Transaction) =>
              transaction.type === "CREDIT"
          )
          .reduce(
            (
              total: number,
              transaction: Transaction
            ) =>
              total + Number(transaction.amount),
            0
          );

        const totalExpenses = data
          .filter(
            (transaction: Transaction) =>
              transaction.type === "DEBIT"
          )
          .reduce(
            (
              total: number,
              transaction: Transaction
            ) =>
              total + Number(transaction.amount),
            0
          );

        setIncome(totalIncome);
        setExpenses(totalExpenses);
      }

    } catch (error) {
      console.error(
        "Failed to fetch transactions",
        error
      );
    }
  };

  // =========================
  // FETCH CARD
  // =========================

  const fetchCard = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/card/${userId}`,
        {
          headers: authHeaders,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setCard(data);
      }

    } catch (error) {
      console.error(
        "Failed to fetch card",
        error
      );
    }
  };

  // =========================
  // FETCH BUDGETS
  // =========================

  const fetchBudgets = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/budget/${userId}`,
        {
          headers: authHeaders,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setBudgets(data);
      }

    } catch (error) {
      console.error(
        "Failed to fetch budgets",
        error
      );
    }
  };

  // =========================
  // FETCH NOTIFICATIONS
  // =========================

  const fetchNotifications = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/notification/${userId}`,
        {
          headers: authHeaders,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setNotifications(data);
      }

    } catch (error) {
      console.error(
        "Failed to fetch notifications",
        error
      );
    }
  };

  // =========================
  // MARK NOTIFICATION AS READ
  // =========================

  const markAsRead = async (
    notificationId: number
  ) => {
    try {
      const response = await fetch(
        `${API_URL}/api/notification/${notificationId}/read`,
        {
          method: "PATCH",
          headers: authHeaders,
        }
      );

      if (response.ok) {
        setNotifications(
          (previous) =>
            previous.map(
              (notification) =>
                notification.id ===
                notificationId
                  ? {
                      ...notification,
                      isRead: true,
                    }
                  : notification
            )
        );
      }

    } catch (error) {
      console.error(
        "Failed to mark notification as read",
        error
      );
    }
  };

  // =========================
  // LOAD ALL DATA
  // =========================

  useEffect(() => {
    if (!userId || !token) {
      setLoading(false);
      return;
    }

    fetchAccountBalance();
    fetchTransactions();
    fetchCard();
    fetchBudgets();
    fetchNotifications();

  }, [userId, token]);

  // =========================
  // ADD MONEY
  // =========================

  const handleAddMoney = async () => {
    const money = Number(
      addMoneyAmount
    );

    if (!money || money <= 0) {
      setMessage(
        "Please enter a valid amount ❌"
      );

      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/account/${userId}/add-money`,
        {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({
            amount: money,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setBalance(
          Number(data.balance ?? 0)
        );

        setAddMoneyAmount("");

        setMessage(
          "Money added successfully! 🎉"
        );

        fetchTransactions();
        fetchNotifications();

      } else {
        setMessage(
          data.message ||
            "Failed to add money ❌"
        );
      }

    } catch (error) {
      setMessage(
        "Server connection failed ❌"
      );
    }
  };

  // =========================
  // SEND MONEY
  // =========================

  const handleSendMoney = async () => {
    const money = Number(
      sendMoneyAmount
    );

    if (!recipientEmail) {
      setMessage(
        "Please enter recipient email ❌"
      );

      return;
    }

    if (!money || money <= 0) {
      setMessage(
        "Please enter a valid amount ❌"
      );

      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/account/${userId}/send-money`,
        {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({
            recipientEmail,
            amount: money,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setSendMoneyAmount("");
        setRecipientEmail("");

        setMessage(
          "Money sent successfully! 🎉"
        );

        fetchAccountBalance();
        fetchTransactions();
        fetchNotifications();

      } else {
        setMessage(
          data.message ||
            "Money transfer failed ❌"
        );
      }

    } catch (error) {
      setMessage(
        "Server connection failed ❌"
      );
    }
  };

  // =========================
  // CREATE CARD
  // =========================

  const handleCreateCard = async () => {
    try {
      const response = await fetch(
        `${API_URL}/api/card/${userId}`,
        {
          method: "POST",
          headers: authHeaders,
        }
      );

      const data = await response.json();

      if (response.ok) {
        setCard(data.card);

        setMessage(
          "Virtual card created successfully! 💳🎉"
        );

        fetchNotifications();

      } else {
        setMessage(
          data.message ||
            "Failed to create card ❌"
        );
      }

    } catch (error) {
      setMessage(
        "Server connection failed ❌"
      );
    }
  };

  // =========================
  // CREATE BUDGET
  // =========================

  const handleCreateBudget = async () => {
    const money = Number(
      budgetAmount
    );

    if (!budgetCategory) {
      setMessage(
        "Please enter budget category ❌"
      );

      return;
    }

    if (!money || money <= 0) {
      setMessage(
        "Please enter a valid budget amount ❌"
      );

      return;
    }

    try {
      const response = await fetch(
        `${API_URL}/api/budget/${userId}`,
        {
          method: "POST",
          headers: authHeaders,
          body: JSON.stringify({
            category: budgetCategory,
            amount: money,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setBudgetCategory("");
        setBudgetAmount("");

        setMessage(
          "Budget created successfully! 🎯"
        );

        fetchBudgets();
        fetchNotifications();

      } else {
        setMessage(
          data.message ||
            "Failed to create budget ❌"
        );
      }

    } catch (error) {
      setMessage(
        "Server connection failed ❌"
      );
    }
  };

  // =========================
  // NOT LOGGED IN
  // =========================

  if (!userId || !token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <h1 className="text-2xl font-bold text-red-600">
          User not logged in ❌
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">

      {/* HEADER */}

      <h1 className="text-3xl font-bold text-gray-800">
        Banking Dashboard 🏦
      </h1>

      <p className="mt-2 text-gray-600">
        Welcome, {user.name} 👋
      </p>

      {/* SUMMARY */}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">

        {/* BALANCE */}

        <div className="bg-white p-6 rounded-2xl shadow">

          <p className="text-gray-500">
            Total Balance
          </p>

          <h2 className="text-3xl font-bold mt-2">

            {loading
              ? "Loading..."
              : `₹${(
                  balance ?? 0
                ).toLocaleString(
                  "en-IN"
                )}`}

          </h2>

          <p className="text-sm text-gray-400 mt-2">
            Currency: {currency}
          </p>

        </div>

        {/* INCOME */}

        <div className="bg-white p-6 rounded-2xl shadow">

          <p className="text-gray-500">
            Income
          </p>

          <h2 className="text-3xl font-bold mt-2">
            ₹
            {income.toLocaleString(
              "en-IN"
            )}
          </h2>

        </div>

        {/* EXPENSES */}

        <div className="bg-white p-6 rounded-2xl shadow">

          <p className="text-gray-500">
            Expenses
          </p>

          <h2 className="text-3xl font-bold mt-2">
            ₹
            {expenses.toLocaleString(
              "en-IN"
            )}
          </h2>

        </div>

      </div>

      {/* VIRTUAL CARD */}

      <div className="bg-white p-6 rounded-2xl shadow mt-8">

        <h2 className="text-xl font-bold">
          My Virtual Card 💳
        </h2>

        {card ? (

          <div className="mt-4 bg-gray-900 text-white p-6 rounded-2xl max-w-md">

            <p className="text-sm text-gray-300">
              BANKING DASHBOARD
            </p>

            <p className="text-2xl tracking-widest mt-6">
              {card.cardNumber}
            </p>

            <div className="flex justify-between mt-6">

              <div>
                <p className="text-xs text-gray-400">
                  CARD HOLDER
                </p>

                <p className="font-semibold">
                  {card.cardHolder}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  EXPIRY
                </p>

                <p className="font-semibold">
                  {card.expiryDate}
                </p>
              </div>

              <div>
                <p className="text-xs text-gray-400">
                  CVV
                </p>

                <p className="font-semibold">
                  {card.cvv}
                </p>
              </div>

            </div>

            <p className="mt-6 text-green-400 font-semibold">
              ● {card.status}
            </p>

          </div>

        ) : (

          <div className="mt-4">

            <p className="text-gray-600 mb-4">
              You don't have a virtual card yet.
            </p>

            <button
              onClick={handleCreateCard}
              className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700"
            >
              Create Virtual Card 💳
            </button>

          </div>

        )}

      </div>

      {/* BUDGET */}

      <div className="bg-white p-6 rounded-2xl shadow mt-8">

        <h2 className="text-xl font-bold">
          Budget Planner 🎯
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">

          <input
            type="text"
            placeholder="Category (Food, Travel...)"
            value={budgetCategory}
            onChange={(e) =>
              setBudgetCategory(
                e.target.value
              )
            }
            className="border p-3 rounded-lg"
          />

          <input
            type="number"
            placeholder="Budget Amount"
            value={budgetAmount}
            onChange={(e) =>
              setBudgetAmount(
                e.target.value
              )
            }
            className="border p-3 rounded-lg"
          />

          <button
            onClick={handleCreateBudget}
            className="bg-orange-500 text-white p-3 rounded-lg hover:bg-orange-600"
          >
            Create Budget 🎯
          </button>

        </div>

        <div className="mt-6 space-y-4">

          {budgets.length === 0 ? (

            <p className="text-gray-600">
              No budgets created yet.
            </p>

          ) : (

            budgets.map((budget) => {

              const percentage =
                budget.amount > 0
                  ? (budget.spent /
                      budget.amount) *
                    100
                  : 0;

              return (

                <div
                  key={budget.id}
                  className="border p-4 rounded-xl"
                >

                  <div className="flex justify-between">

                    <p className="font-semibold">
                      {budget.category}
                    </p>

                    <p className="font-semibold">

                      ₹
                      {Number(
                        budget.spent
                      ).toLocaleString(
                        "en-IN"
                      )}

                      {" / "}

                      ₹
                      {Number(
                        budget.amount
                      ).toLocaleString(
                        "en-IN"
                      )}

                    </p>

                  </div>

                  <div className="w-full bg-gray-200 rounded-full h-3 mt-3">

                    <div
                      className="bg-orange-500 h-3 rounded-full"
                      style={{
                        width: `${Math.min(
                          percentage,
                          100
                        )}%`,
                      }}
                    />

                  </div>

                  <p className="text-sm text-gray-500 mt-2">
                    {percentage.toFixed(0)}% used
                  </p>

                </div>

              );

            })

          )}

        </div>

      </div>

      {/* NOTIFICATIONS */}

      <div className="bg-white p-6 rounded-2xl shadow mt-8">

        <div className="flex justify-between items-center">

          <h2 className="text-xl font-bold">
            Notifications 🔔
          </h2>

          <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm">

            {
              notifications.filter(
                (notification) =>
                  !notification.isRead
              ).length
            }{" "}

            Unread

          </span>

        </div>

        {notifications.length === 0 ? (

          <p className="mt-4 text-gray-600">
            No notifications yet.
          </p>

        ) : (

          <div className="mt-4 space-y-3">

            {notifications.map(
              (notification) => (

                <div
                  key={notification.id}
                  className={`p-4 rounded-xl border ${
                    notification.isRead
                      ? "bg-gray-50"
                      : "bg-blue-50 border-blue-200"
                  }`}
                >

                  <div className="flex justify-between gap-4">

                    <div>

                      <p className="font-semibold">
                        {notification.title}
                      </p>

                      <p className="text-gray-600 mt-1">
                        {notification.message}
                      </p>

                      <p className="text-sm text-gray-400 mt-2">
                        {new Date(
                          notification.createdAt
                        ).toLocaleString()}
                      </p>

                    </div>

                    {!notification.isRead && (

                      <button
                        onClick={() =>
                          markAsRead(
                            notification.id
                          )
                        }
                        className="text-sm bg-blue-600 text-white px-3 py-2 rounded-lg h-fit hover:bg-blue-700"
                      >
                        Mark as Read
                      </button>

                    )}

                  </div>

                </div>

              )
            )}

          </div>

        )}

      </div>

      {/* ADD MONEY */}

      <div className="bg-white p-6 rounded-2xl shadow mt-8">

        <h2 className="text-xl font-bold">
          Add Money 💰
        </h2>

        <div className="flex gap-4 mt-4">

          <input
            type="number"
            placeholder="Enter amount"
            value={addMoneyAmount}
            onChange={(e) =>
              setAddMoneyAmount(
                e.target.value
              )
            }
            className="border p-3 rounded-lg flex-1"
          />

          <button
            onClick={handleAddMoney}
            className="bg-green-600 text-white px-6 rounded-lg hover:bg-green-700"
          >
            Add Money
          </button>

        </div>

      </div>

      {/* SEND MONEY */}

      <div className="bg-white p-6 rounded-2xl shadow mt-8">

        <h2 className="text-xl font-bold">
          Send Money 💸
        </h2>

        <div className="flex flex-col gap-4 mt-4">

          <input
            type="email"
            placeholder="Recipient Email"
            value={recipientEmail}
            onChange={(e) =>
              setRecipientEmail(
                e.target.value
              )
            }
            className="border p-3 rounded-lg"
          />

          <input
            type="number"
            placeholder="Enter amount"
            value={sendMoneyAmount}
            onChange={(e) =>
              setSendMoneyAmount(
                e.target.value
              )
            }
            className="border p-3 rounded-lg"
          />

          <button
            onClick={handleSendMoney}
            className="bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700"
          >
            Send Money
          </button>

        </div>

      </div>

      {/* MESSAGE */}

      {message && (

        <div className="bg-white p-4 rounded-2xl shadow mt-8">

          <p className="font-semibold">
            {message}
          </p>

        </div>

      )}

      {/* TRANSACTIONS */}

      <div className="bg-white p-6 rounded-2xl shadow mt-8">

        <h2 className="text-xl font-bold">
          Recent Transactions
        </h2>

        {transactions.length === 0 ? (

          <p className="mt-4 text-gray-600">
            No transactions yet.
          </p>

        ) : (

          <div className="mt-4 space-y-3">

            {transactions.map(
              (transaction) => (

                <div
                  key={transaction.id}
                  className="flex justify-between items-center border-b pb-3"
                >

                  <div>

                    <p className="font-semibold">
                      {transaction.description}
                    </p>

                    <p className="text-sm text-gray-500">
                      {new Date(
                        transaction.createdAt
                      ).toLocaleString()}
                    </p>

                  </div>

                  <p
                    className={
                      transaction.type ===
                      "CREDIT"
                        ? "font-bold text-green-600"
                        : "font-bold text-red-600"
                    }
                  >

                    {transaction.type ===
                    "CREDIT"
                      ? "+"
                      : "-"}{" "}

                    ₹
                    {Number(
                      transaction.amount
                    ).toLocaleString(
                      "en-IN"
                    )}

                  </p>

                </div>

              )
            )}

          </div>

        )}

      </div>

    </div>
  );
}

export default Dashboard;