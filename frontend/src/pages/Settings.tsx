import { useEffect, useState } from "react";

const API_URL =
  "https://banking-dashboard-simulator.onrender.com";

interface UserData {
  id: number;
  name: string;
  email: string;
  createdAt: string;
}

const Settings = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      if (!userId) {
        setMessage("User not found");
        setLoading(false);
        return;
      }

      const response = await fetch(
        `${API_URL}/api/user/${userId}`
      );

      const data: UserData | { message: string } =
        await response.json();

      if (!response.ok) {
        setMessage(
          "message" in data
            ? data.message
            : "Failed to load user"
        );
        setLoading(false);
        return;
      }

      if ("name" in data && "email" in data) {
        setName(data.name || "");
        setEmail(data.email || "");
      }

      setLoading(false);
    } catch (error) {
      console.error("Fetch user error:", error);
      setMessage("Failed to load user details");
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      if (!userId) {
        setMessage("User not found");
        return;
      }

      setSaving(true);
      setMessage("");

      const response = await fetch(
        `${API_URL}/api/user/${userId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        setMessage(
          data.message || "Failed to update profile"
        );
        setSaving(false);
        return;
      }

      setMessage(
        "Profile updated successfully ✅"
      );

      setSaving(false);
    } catch (error) {
      console.error("Update user error:", error);

      setMessage(
        "Something went wrong while updating profile"
      );

      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-100">
        <p className="text-gray-600">
          Loading settings...
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="mx-auto max-w-4xl">

        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            Settings
          </h1>

          <p className="mt-1 text-gray-500">
            Manage your account settings
          </p>
        </div>

        <div className="rounded-2xl bg-white p-6 shadow-md">

          <h2 className="mb-6 text-xl font-semibold text-gray-800">
            Profile Information
          </h2>

          <div className="mb-5">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Full Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              placeholder="Enter your name"
            />
          </div>

          <div className="mb-6">
            <label className="mb-2 block text-sm font-medium text-gray-700">
              Email Address
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full rounded-lg border border-gray-300 px-4 py-3 outline-none focus:border-blue-500"
              placeholder="Enter your email"
            />
          </div>

          {message && (
            <div className="mb-5 rounded-lg bg-blue-50 p-3 text-blue-700">
              {message}
            </div>
          )}

          <button
            onClick={handleSave}
            disabled={saving}
            className="rounded-lg bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {saving
              ? "Saving..."
              : "Save Changes"}
          </button>

        </div>
      </div>
    </div>
  );
};

export default Settings;