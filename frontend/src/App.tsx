import { useState } from "react";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

function App() {
  const [page, setPage] = useState<"login" | "signup">("login");

  return (
    <div>
      {page === "login" ? (
        <Login onSignup={() => setPage("signup")} />
      ) : (
        <Signup onLogin={() => setPage("login")} />
      )}
    </div>
  );
}

export default App;