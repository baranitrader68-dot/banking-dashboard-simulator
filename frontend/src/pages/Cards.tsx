import { useEffect, useState } from "react";

type CardData = {
  id: number;
  cardNumber: string;
  cardHolder: string;
  expiryDate: string;
  cvv: string;
};

function Cards() {
  const storedUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const userId = storedUser.id;

  const [card, setCard] =
    useState<CardData | null>(null);

  const [loading, setLoading] =
    useState(true);

  const [creating, setCreating] =
    useState(false);

  const [error, setError] =
    useState("");

  // =========================
  // GET EXISTING CARD
  // =========================

  const fetchCard = async () => {
    try {
      setLoading(true);
      setError("");

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/card/${userId}`,
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
        setCard(data);
      } else {
        setCard(null);

        setError(
          data.message ||
            "Unable to fetch card"
        );
      }

    } catch (error) {
      console.error(
        "Failed to fetch card",
        error
      );

      setError(
        "Unable to connect to server"
      );

    } finally {
      setLoading(false);
    }
  };

  // =========================
  // CREATE NEW CARD
  // =========================

  const createCard = async () => {
    try {
      setCreating(true);
      setError("");

      const token =
        localStorage.getItem("token");

      const response = await fetch(
        `http://localhost:5000/api/card/${userId}`,
        {
          method: "POST",

          headers: {
            Authorization:
              `Bearer ${token}`,
          },
        }
      );

      const data =
        await response.json();

      if (response.ok) {
        setCard(data.card);

      } else {
        setError(
          data.message ||
            "Unable to create card"
        );
      }

    } catch (error) {
      console.error(
        "Failed to create card",
        error
      );

      setError(
        "Unable to create card"
      );

    } finally {
      setCreating(false);
    }
  };

  // =========================
  // LOAD CARD
  // =========================

  useEffect(() => {
    if (userId) {
      fetchCard();
    } else {
      setError(
        "User information not found"
      );
      setLoading(false);
    }
  }, [userId]);

  // =========================
  // LOADING
  // =========================

  if (loading) {
    return (
      <div className="p-8">

        <div className="bg-white p-8 rounded-2xl shadow">

          <p>
            Loading card...
          </p>

        </div>

      </div>
    );
  }

  // =========================
  // PAGE
  // =========================

  return (

    <div className="p-8">

      <div className="bg-white p-8 rounded-2xl shadow">

        {/* HEADER */}

        <div className="flex justify-between items-center">

          <div>

            <h1 className="text-3xl font-bold text-gray-800">
              My Cards 💳
            </h1>

            <p className="text-gray-600 mt-2">
              Manage your virtual and bank cards.
            </p>

          </div>

          {/* REFRESH */}

          <button
            onClick={fetchCard}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
          >
            Refresh 🔄
          </button>

        </div>

        {/* ERROR */}

        {error && (

          <p className="mt-6 text-red-600 font-semibold">
            {error}
          </p>

        )}

        {/* NO CARD */}

        {!card && !error && (

          <div className="mt-8">

            <p className="text-gray-600 mb-4">
              You don't have a card yet.
            </p>

            <button
              onClick={createCard}
              disabled={creating}
              className="bg-green-600 text-white px-5 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50"
            >
              {creating
                ? "Creating..."
                : "Create Virtual Card 💳"}
            </button>

          </div>

        )}

        {/* CARD */}

        {card && (

          <div className="mt-8 max-w-md">

            <div className="bg-gray-900 text-white p-6 rounded-2xl shadow-xl">

              <p className="text-sm text-gray-400">
                BANKFLOW
              </p>

              <p className="text-2xl tracking-widest mt-8">
                {card.cardNumber}
              </p>

              <div className="flex justify-between mt-8">

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
                    EXPIRES
                  </p>

                  <p className="font-semibold">
                    {card.expiryDate}
                  </p>

                </div>

              </div>

              <div className="mt-6">

                <p className="text-xs text-gray-400">
                  CVV
                </p>

                <p className="font-semibold">
                  {card.cvv}
                </p>

              </div>

            </div>

          </div>

        )}

      </div>

    </div>

  );
}

export default Cards;