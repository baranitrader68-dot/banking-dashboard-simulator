import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  createdAt: string;
};

function Settings() {
  const storedUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const userId = storedUser.id;

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [loading, setLoading] =
    useState(true);

  const [message, setMessage] =
    useState("");

  const fetchProfile = async () => {
    try {
      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/user/${userId}`,
        {
          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (response.ok) {
        setName(data.name);
        setEmail(data.email);
      } else {
        setMessage(
          data.message ||
            "Failed to load profile ❌"
        );
      }

    } catch (error) {
      console.error(
        "Failed to fetch profile",
        error
      );

      setMessage(
        "Failed to load profile ❌"
      );

    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userId) {
      fetchProfile();
    } else {
      setMessage("User not found ❌");
      setLoading(false);
    }
  }, [userId]);

  const handleSave = async () => {
    if (!name || !email) {
      setMessage(
        "Name and email are required ❌"
      );
      return;
    }

    try {
      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/user/${userId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",

            Authorization:
              `Bearer ${token}`,
          },

          body: JSON.stringify({
            name,
            email,
          }),
        }
      );

      const data =
        await response.json();

      if (response.ok) {
        setMessage(
          "Profile updated successfully! ✅"
        );

        const currentUser =
          JSON.parse(
            localStorage.getItem(
              "user"
            ) || "{}"
          );

        localStorage.setItem(
          "user",
          JSON.stringify({
            ...currentUser,
            name,
            email,
          })
        );

      } else {
        setMessage(
          data.message ||
            "Failed to update profile ❌"
        );
      }

    } catch (error) {
      console.error(
        "Failed to update profile",
        error
      );

      setMessage(
        "Server connection failed ❌"
      );
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <p className="text-gray-600">
          Loading profile...
        </p>
      </div>
    );
  }

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold text-gray-800">
        Settings ⚙️
      </h1>

      <p className="text-gray-600 mt-2">
        Manage your account settings.
      </p>

      <div className="bg-white p-6 rounded-2xl shadow mt-8">

        <h2 className="text-xl font-bold">
          Profile Settings 👤
        </h2>

        <div className="mt-6 space-y-4">

          <div>
            <label className="block font-semibold mb-2">
              Full Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) =>
                setName(e.target.value)
              }
              className="w-full border p-3 rounded-lg"
            />
          </div>

          <div>
            <label className="block font-semibold mb-2">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full border p-3 rounded-lg"
            />
          </div>

          <button
            onClick={handleSave}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700"
          >
            Save Changes 💾
          </button>

          {message && (
            <p className="mt-3 font-semibold">
              {message}
            </p>
          )}

        </div>

      </div>

      <div className="bg-white p-6 rounded-2xl shadow mt-6">

        <h2 className="text-xl font-bold">
          Security 🔒
        </h2>

        <p className="text-gray-600 mt-2">
          Keep your banking account secure.
        </p>

        <button
          className="mt-4 bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900"
        >
          Change Password 🔑
        </button>

      </div>

      <div className="bg-white p-6 rounded-2xl shadow mt-6">

        <h2 className="text-xl font-bold">
          Account Information 🏦
        </h2>

        <p className="text-gray-600 mt-2">
          Your banking account settings.
        </p>

        <div className="mt-4 p-4 bg-gray-100 rounded-lg">

          <p>
            <strong>
              Account Status:
            </strong>{" "}
            Active ✅
          </p>

          <p className="mt-2">
            <strong>
              Account Type:
            </strong>{" "}
            Savings Account
          </p>

        </div>

      </div>

    </div>
  );
}

export default Settings;