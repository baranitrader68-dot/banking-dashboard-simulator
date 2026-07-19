import { useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";

function App() {
  const [page, setPage] = useState<"login" | "signup" | "dashboard">(
    "login"
  );

  return (
    <div>
      {page === "login" && (
        <Login
          onSignup={() => setPage("signup")}
          onLoginSuccess={() => setPage("dashboard")}
        />
      )}

      {page === "signup" && (
        <Signup onLogin={() => setPage("login")} />
      )}

      {page === "dashboard" && <Dashboard />}
    </div>
  );
}

export default App;