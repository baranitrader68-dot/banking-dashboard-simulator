import { useState } from "react";

type LoginProps = {
  onSignup: () => void;
  onLoginSuccess: () => void;
};

function Login({
  onSignup,
  onLoginSuccess,
}: LoginProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    if (!email || !password) {
      setMessage(
        "Email and password are required ❌"
      );
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        "https://banking-dashboard-simulator.onrender.com/api/auth/login",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        // Save JWT token
        localStorage.setItem(
          "token",
          data.token
        );

        // Save user data
        localStorage.setItem(
          "user",
          JSON.stringify(data.user)
        );

        setMessage(
          "Login successful! 🎉"
        );

        setTimeout(() => {
          onLoginSuccess();
        }, 500);
      } else {
        setMessage(
          data.message ||
            "Invalid email or password ❌"
        );
      }
    } catch (error) {
      console.error(error);

      setMessage(
        "Server connection failed ❌"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white w-full max-w-md p-8 rounded-2xl shadow-lg">

        <h1 className="text-3xl font-bold text-center text-blue-600">
          Welcome Back
        </h1>

        <p className="text-center text-gray-500 mt-2">
          Login to your banking account
        </p>

        <form
          onSubmit={handleLogin}
          className="mt-6 space-y-4"
        >

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            className="w-full border p-3 rounded-lg"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            className="w-full border p-3 rounded-lg"
          />

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
          >
            {loading
              ? "Logging in..."
              : "Login"}
          </button>

        </form>

        {message && (
          <p className="text-center mt-4 font-semibold">
            {message}
          </p>
        )}

        <p className="text-center mt-6 text-gray-600">
          Don't have an account?{" "}

          <button
            type="button"
            onClick={onSignup}
            className="text-blue-600 cursor-pointer hover:underline"
          >
            Sign Up
          </button>
        </p>

      </div>
    </div>
  );
}

export default Login;