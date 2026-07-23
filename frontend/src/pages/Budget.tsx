import { useEffect, useState } from "react";

type Budget = {
  id: number;
  category: string;
  amount: number;
  spent: number;
};

function Budget() {
  const storedUser = JSON.parse(
    localStorage.getItem("user") || "{}"
  );

  const userId = storedUser.id;

  const [budgets, setBudgets] =
    useState<Budget[]>([]);

  const [category, setCategory] =
    useState("");

  const [amount, setAmount] =
    useState("");

  const [message, setMessage] =
    useState("");

  const fetchBudgets = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/budget/${userId}`
      );

      const data =
        await response.json();

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

  useEffect(() => {
    if (userId) {
      fetchBudgets();
    }
  }, [userId]);

  const handleCreateBudget = async () => {
    const budgetAmount =
      Number(amount);

    if (
      !userId ||
      !category ||
      !budgetAmount ||
      budgetAmount <= 0
    ) {
      setMessage(
        "Please enter valid category and amount ❌"
      );

      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/budget/${userId}`,
        {
          method: "POST",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            category,
            amount: budgetAmount,
          }),
        }
      );

      const data =
        await response.json();

      if (response.ok) {
        setMessage(
          "Budget created successfully! 🎯"
        );

        setCategory("");
        setAmount("");

        fetchBudgets();

      } else {
        setMessage(
          data.message ||
            "Failed to create budget ❌"
        );
      }

    } catch (error) {
      console.error(
        "Failed to create budget",
        error
      );

      setMessage(
        "Server connection failed ❌"
      );
    }
  };

  return (
    <div className="p-8">

      <h1 className="text-3xl font-bold text-gray-800">
        Budget Planner 🎯
      </h1>

      <p className="text-gray-600 mt-2">
        Manage your monthly spending budgets.
      </p>

      <div className="bg-white p-6 rounded-2xl shadow mt-8">

        <h2 className="text-xl font-bold">
          Create New Budget
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">

          <input
            type="text"
            placeholder="Category"
            value={category}
            onChange={(e) =>
              setCategory(e.target.value)
            }
            className="border p-3 rounded-lg"
          />

          <input
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) =>
              setAmount(e.target.value)
            }
            className="border p-3 rounded-lg"
          />

          <button
            onClick={handleCreateBudget}
            className="bg-orange-500 text-white rounded-lg hover:bg-orange-600"
          >
            Create Budget 🎯
          </button>

        </div>

        {message && (
          <p className="mt-4 font-semibold">
            {message}
          </p>
        )}

      </div>

      <div className="mt-8 space-y-4">

        {budgets.length === 0 ? (

          <div className="bg-white p-6 rounded-2xl shadow">

            <p className="text-gray-500">
              No budgets created yet.
            </p>

          </div>

        ) : (

          budgets.map((budget) => {

            const percentage =
              budget.amount > 0
                ? (budget.spent /
                    budget.amount) *
                  100
                : 0;

            return (

              <div
                key={budget.id}
                className="bg-white p-6 rounded-2xl shadow"
              >

                <div className="flex justify-between">

                  <h3 className="font-bold text-lg">
                    {budget.category}
                  </h3>

                  <p className="font-semibold">

                    ₹
                    {budget.spent.toLocaleString(
                      "en-IN"
                    )}

                    {" / "}

                    ₹
                    {budget.amount.toLocaleString(
                      "en-IN"
                    )}

                  </p>

                </div>

                <div className="w-full bg-gray-200 h-3 rounded-full mt-4">

                  <div
                    className="bg-orange-500 h-3 rounded-full"
                    style={{
                      width: `${Math.min(
                        percentage,
                        100
                      )}%`,
                    }}
                  />

                </div>

                <p className="text-sm text-gray-500 mt-2">
                  {percentage.toFixed(0)}% used
                </p>

              </div>

            );

          })

        )}

      </div>

    </div>
  );
}

export default Budget;