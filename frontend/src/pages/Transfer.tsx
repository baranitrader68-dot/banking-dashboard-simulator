import {
  useState,
} from "react";

function Transfer() {

  // =========================
  // GET LOGGED-IN USER
  // =========================

  const storedUser =
    localStorage.getItem(
      "user"
    );

  const user = storedUser
    ? JSON.parse(
        storedUser
      )
    : null;

  const userId =
    user?.id;

  const token =
    localStorage.getItem(
      "token"
    );

  // =========================
  // STATES
  // =========================

  const [
    receiverUserId,
    setReceiverUserId,
  ] = useState("");

  const [
    amount,
    setAmount,
  ] = useState("");

  const [
    message,
    setMessage,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  // =========================
  // SEND MONEY
  // =========================

  const handleTransfer =
    async () => {

      const receiverId =
        Number(
          receiverUserId
        );

      const transferAmount =
        Number(
          amount
        );

      // -------------------------
      // VALIDATION
      // -------------------------

      if (
        !receiverId
      ) {
        setMessage(
          "Please enter receiver user ID ❌"
        );

        return;
      }

      if (
        !transferAmount ||
        transferAmount <= 0
      ) {
        setMessage(
          "Please enter a valid amount ❌"
        );

        return;
      }

      if (
        receiverId ===
        userId
      ) {
        setMessage(
          "You cannot transfer money to yourself ❌"
        );

        return;
      }

      try {

        setLoading(
          true
        );

        setMessage(
          ""
        );

        const response =
          await fetch(
            `http://localhost:5000/api/transfer/${userId}`,
            {
              method:
                "POST",

              headers: {
                "Content-Type":
                  "application/json",

                Authorization:
                  `Bearer ${token}`,
              },

              body:
                JSON.stringify({
                  receiverUserId:
                    receiverId,

                  amount:
                    transferAmount,
                }),
            }
          );

        const data =
          await response.json();

        if (
          response.ok
        ) {

          setMessage(
            "Money transferred successfully! ✅"
          );

          setReceiverUserId(
            ""
          );

          setAmount(
            ""
          );

        } else {

          setMessage(
            data.message ||
              "Transfer failed ❌"
          );
        }

      } catch (
        error
      ) {

        console.error(
          "Transfer error",
          error
        );

        setMessage(
          "Server connection failed ❌"
        );

      } finally {

        setLoading(
          false
        );
      }
    };

  // =========================
  // NOT LOGGED IN
  // =========================

  if (
    !userId
  ) {
    return (
      <div className="p-8">

        <p className="text-red-600 font-bold">
          User not logged in ❌
        </p>

      </div>
    );
  }

  // =========================
  // PAGE
  // =========================

  return (

    <div className="p-8">

      <div className="bg-white p-8 rounded-2xl shadow max-w-2xl">

        <h1 className="text-3xl font-bold text-gray-800">
          Money Transfer 💸
        </h1>

        <p className="text-gray-600 mt-2">
          Send money securely to another account.
        </p>

        {/* SEND MONEY */}

        <div className="mt-8">

          <h2 className="text-xl font-bold">
            Send Money 💰
          </h2>

          {/* RECEIVER USER ID */}

          <div className="mt-6">

            <label className="block font-semibold mb-2">
              Receiver User ID
            </label>

            <input
              type="number"
              placeholder="Example: 3"
              value={
                receiverUserId
              }
              onChange={(
                event
              ) =>
                setReceiverUserId(
                  event.target.value
                )
              }
              className="w-full border p-3 rounded-lg"
            />

          </div>

          {/* AMOUNT */}

          <div className="mt-4">

            <label className="block font-semibold mb-2">
              Amount
            </label>

            <input
              type="number"
              placeholder="Enter amount"
              value={
                amount
              }
              onChange={(
                event
              ) =>
                setAmount(
                  event.target.value
                )
              }
              className="w-full border p-3 rounded-lg"
            />

          </div>

          {/* BUTTON */}

          <button
            onClick={
              handleTransfer
            }
            disabled={
              loading
            }
            className="w-full mt-6 bg-blue-600 text-white p-3 rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >

            {loading
              ? "Transferring..."
              : "Transfer Money 💸"}

          </button>

          {/* MESSAGE */}

          {message && (

            <p className="mt-6 font-semibold">

              {message}

            </p>

          )}

        </div>

      </div>

    </div>
  );
}

export default Transfer;