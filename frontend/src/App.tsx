import { useState } from "react";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

import Transactions from "./pages/Transactions";
import Transfer from "./pages/Transfer";
import Cards from "./pages/Cards";
import Budget from "./pages/Budget";
import Notifications from "./pages/Notifications";
import Settings from "./pages/Settings";
import Admin from "./pages/Admin";

import Sidebar from "./components/Sidebar";

function App() {
  // =========================
  // CHECK LOGIN
  // =========================

  const [isLoggedIn, setIsLoggedIn] =
    useState(
      Boolean(localStorage.getItem("token"))
    );

  // =========================
  // PAGE STATE
  // =========================

  const [page, setPage] =
    useState("dashboard");

  // =========================
  // LOGIN SUCCESS
  // =========================

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
    setPage("dashboard");
  };

  // =========================
  // LOGOUT
  // =========================

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    setIsLoggedIn(false);
    setPage("login");
  };

  // =========================
  // SIGNUP PAGE
  // =========================

  if (
    !isLoggedIn &&
    page === "signup"
  ) {
    return (
      <Signup
        onLogin={() =>
          setPage("login")
        }
      />
    );
  }

  // =========================
  // LOGIN PAGE
  // =========================

  if (!isLoggedIn) {
    return (
      <Login
        onSignup={() =>
          setPage("signup")
        }
        onLoginSuccess={
          handleLoginSuccess
        }
      />
    );
  }

  // =========================
  // LOGGED-IN APP
  // =========================

  return (
    <div className="flex min-h-screen bg-gray-100">

      {/* SIDEBAR */}

      <Sidebar
        onNavigate={setPage}
        onLogout={handleLogout}
      />

      {/* MAIN CONTENT */}

      <main className="flex-1">

        {/* DASHBOARD */}

        {page === "dashboard" && (
          <Dashboard />
        )}

        {/* TRANSACTIONS */}

        {page === "transactions" && (
          <Transactions />
        )}

        {/* MONEY TRANSFER */}

        {page === "transfer" && (
          <Transfer />
        )}

        {/* CARDS */}

        {page === "cards" && (
          <Cards />
        )}

        {/* BUDGET */}

        {page === "budget" && (
          <Budget />
        )}

        {/* NOTIFICATIONS */}

        {page === "notifications" && (
          <Notifications />
        )}

        {/* SETTINGS */}

        {page === "settings" && (
          <Settings />
        )}

        {/* ADMIN PANEL */}

        {page === "admin" && (
          <Admin />
        )}

      </main>

    </div>
  );
}

export default App;