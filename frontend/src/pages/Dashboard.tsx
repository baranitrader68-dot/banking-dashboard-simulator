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
  // GET LOGGED-IN USER
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
    useState<number>(0);

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
        "ACCOUNT API RESPONSE:",
        data
      );

      if (response.ok) {
        setBalance(
          Number(
            data.balance ??
              data.account?.balance ??
              0
          )
        );

        setCurrency(
          data.currency ??
            data.account?.currency ??
            "INR"
        );
      }
    } catch (error) {
      console.error(
        "Failed to fetch balance",
        error
      );
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
    const money = Number(addMoneyAmount);

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
          Number(
            data.balance ??
              data.account?.balance ??
              balance + money
          )
        );

        setAddMoneyAmount("");

        setMessage(
          "Money added successfully! 🎉"
        );

        fetchAccountBalance();
        fetchTransactions();
        fetchNotifications();
      } else {
        setMessage(
          data.message ||
            "Failed to add money ❌"
        );
      }
    } catch (error) {
      console.error(error);

      setMessage(
        "Server connection failed ❌"
      );
    }
  };

  // =========================
  // SEND MONEY
  // =========================

  const handleSendMoney = async () => {
    const money = Number(sendMoneyAmount);

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
      console.error(error);

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
        setCard(data.card ?? data);

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
      console.error(error);

      setMessage(
        "Server connection failed ❌"
      );
    }
  };

  // =========================
  // CREATE BUDGET
  // =========================

  const handleCreateBudget = async () => {
    const money = Number(budgetAmount);

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
      console.error(error);

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

        <div className="bg-white p-6 rounded-2xl shadow">

          <p className="text-gray-500">
            Total Balance
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {loading
              ? "Loading..."
              : `₹${balance.toLocaleString(
                  "en-IN"
                )}`}
          </h2>

          <p className="text-sm text-gray-400 mt-2">
            Currency: {currency}
          </p>

        </div>

        <div className="bg-white p-6 rounded-2xl shadow">

          <p className="text-gray-500">
            Income
          </p>

          <h2 className="text-3xl font-bold mt-2">
            ₹{income.toLocaleString("en-IN")}
          </h2>

        </div>

        <div className="bg-white p-6 rounded-2xl shadow">

          <p className="text-gray-500">
            Expenses
          </p>

          <h2 className="text-3xl font-bold mt-2">
            ₹{expenses.toLocaleString("en-IN")}
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
                <p