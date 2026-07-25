import { useState } from "react";

function Signup({ onLogin }: { onLogin: () => void }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleSignup = async (
    e: React.FormEvent
  ) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://banking-dashboard-simulator.onrender.com/api/auth/signup",
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name,
            email,
            password,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setMessage(
          "Signup successful! 🎉"
        );

        setName("");
        setEmail("");
        setPassword("");
      } else {
        setMessage(
          data.message || "Signup failed ❌"
        );
      }
    } catch (error) {
      console.error(
        "Signup error:",
        error
      );

      setMessage(
        "Server connection failed ❌"
      );
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">

        <h1 className="text-center text-3xl font-bold text-blue-600">
          Create Account
        </h1>

        <p className="mt-2 text-center text-gray-500">
          Join our banking platform
        </p>

        <form
          onSubmit={handleSignup}
          className="mt-6 space-y-4"
        >

          {/* Full Name */}
          <input
            type="text"
            placeholder="Full Name"
            value={name}
            onChange={(e) =>
              setName(e.target.value)
            }
            required
            className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
          />

          {/* Email */}
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(e.target.value)
            }
            required
            className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
          />

          {/* Password */}
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(e.target.value)
            }
            required
            minLength={6}
            className="w-full rounded-lg border p-3 outline-none focus:border-blue-500"
          />

          {/* Sign Up Button */}
          <button
            type="submit"
            className="w-full rounded-lg bg-blue-600 p-3 text-white hover:bg-blue-700"
          >
            Sign Up
          </button>

        </form>

        {/* Message */}
        {message && (
          <p className="mt-4 text-center font-semibold">
            {message}
          </p>
        )}

        {/* Login */}
        <p className="mt-6 text-center text-gray-600">
          Already have an account?{" "}

          <button
            type="button"
            onClick={onLogin}
            className="cursor-pointer text-blue-600"
          >
            Login
          </button>
        </p>

      </div>
    </div>
  );
}

export default Signup;