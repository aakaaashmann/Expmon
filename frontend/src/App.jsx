import { useEffect, useState } from "react";
import api from "./services/api";

function App() {
  const [expenses, setExpenses] = useState([]);
  const [filteredExpenses, setFilteredExpenses] = useState([]);

  const [form, setForm] = useState({
    amount: "",
    category: "",
    description: "",
    date: "",
  });

  const [categoryFilter, setCategoryFilter] = useState("");

  // Separate loading states
  const [submitting, setSubmitting] = useState(false);
  const [loadingList, setLoadingList] = useState(false);

  const [error, setError] = useState("");

  useEffect(() => {
    fetchExpenses();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [expenses, categoryFilter]);

  const fetchExpenses = async () => {
    try {
      setLoadingList(true);
      const res = await api.get("/expenses?sort=date_desc");
      setExpenses(res.data);
    } catch (err) {
      setError("Failed to fetch expenses");
    } finally {
      setLoadingList(false);
    }
  };

  const applyFilters = () => {
    let data = [...expenses];

    if (categoryFilter) {
      data = data.filter(
        (expense) =>
          expense.category.toLowerCase() ===
          categoryFilter.toLowerCase()
      );
    }

    setFilteredExpenses(data);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.amount || !form.category || !form.date) {
      setError("Please fill required fields");
      return;
    }

    // Prevent negative or zero amounts
    if (parseFloat(form.amount) <= 0) {
      setError("Amount must be greater than 0");
      return;
    }

    try {
      setSubmitting(true);

      await api.post(
        "/expenses",
        {
          ...form,
          amount: parseFloat(form.amount),
        },
        {
          headers: {
            "Idempotency-Key": crypto.randomUUID(),
          },
        }
      );

      // Reset form
      setForm({
        amount: "",
        category: "",
        description: "",
        date: "",
      });

      fetchExpenses();
    } catch (err) {
      setError("Failed to add expense");
    } finally {
      setSubmitting(false);
    }
  };

  const total = filteredExpenses.reduce(
    (sum, expense) => sum + parseFloat(expense.amount),
    0
  );

  return (
    <div style={{ maxWidth: 800, margin: "40px auto", fontFamily: "Arial" }}>
      <h2>Expense Tracker</h2>

      {/* FORM */}
      <form onSubmit={handleSubmit} style={{ marginBottom: 20 }}>
        <input
          type="number"
          placeholder="Amount"
          value={form.amount}
          onChange={(e) =>
            setForm({ ...form, amount: e.target.value })
          }
          required
        />

        <input
          type="text"
          placeholder="Category"
          value={form.category}
          onChange={(e) =>
            setForm({ ...form, category: e.target.value })
          }
          required
        />

        <input
          type="text"
          placeholder="Description"
          value={form.description}
          onChange={(e) =>
            setForm({ ...form, description: e.target.value })
          }
        />

        <input
          type="date"
          value={form.date}
          onChange={(e) =>
            setForm({ ...form, date: e.target.value })
          }
          required
        />

        <button disabled={submitting}>
          {submitting ? "Adding..." : "Add Expense"}
        </button>
      </form>

      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* FILTER */}
      <div style={{ marginBottom: 20 }}>
        <input
          type="text"
          placeholder="Filter by category"
          value={categoryFilter}
          onChange={(e) => setCategoryFilter(e.target.value)}
        />
      </div>

      {/* LIST */}
      {loadingList ? (
        <p>Loading...</p>
      ) : (
        <>
          <table border="1" cellPadding="8" width="100%">
            <thead>
              <tr>
                <th>Amount</th>
                <th>Category</th>
                <th>Description</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => (
                <tr key={expense.id}>
                  <td>₹{expense.amount}</td>
                  <td>{expense.category}</td>
                  <td>{expense.description}</td>
                  <td>{expense.date}</td>
                </tr>
              ))}
            </tbody>
          </table>

          <h3 style={{ marginTop: 20 }}>
            Total: ₹{total.toFixed(2)}
          </h3>
        </>
      )}
    </div>
  );
}

export default App;
