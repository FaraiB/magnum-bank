import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { type RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { type Transaction } from "../redux/userSlice";

const History = () => {
  const allTransactions = useSelector(
    (state: RootState) => state.user.transactions
  );
  const navigate = useNavigate();

  const [filterType, setFilterType] = useState("all");
  const [filterPeriod, setFilterPeriod] = useState("all");

  const [filteredTransactions, setFilteredTransactions] =
    useState<Transaction[]>(allTransactions);

  useEffect(() => {
    let tempTransactions = [...allTransactions];

    // Filter by transaction type
    if (filterType !== "all") {
      tempTransactions = tempTransactions.filter((t) => t.type === filterType);
    }

    // Filter by date period
    if (filterPeriod !== "all") {
      const today = new Date();
      // Create a new Date object to avoid modifying 'today'
      let filterDate = new Date(today);

      switch (filterPeriod) {
        case "7days":
          filterDate.setDate(today.getDate() - 7);
          break;
        case "15days":
          filterDate.setDate(today.getDate() - 15);
          break;
        case "30days":
          filterDate.setDate(today.getDate() - 30);
          break;
        case "90days":
          filterDate.setDate(today.getDate() - 90);
          break;
      }

      tempTransactions = tempTransactions.filter(
        (t) => new Date(t.date) >= filterDate
      );
    }

    setFilteredTransactions(tempTransactions);
  }, [allTransactions, filterType, filterPeriod]);

  return (
    <div className="container">
      <nav className="navbar">
        <h1>Transaction History</h1>
        <button onClick={() => navigate("/")} className="action-btn">
          Back to Home
        </button>
      </nav>
      <div className="content">
        <h2>All Transactions</h2>

        <div className="filters">
          <label htmlFor="filter-type">Filter by Type:</label>
          <select
            id="filter-type"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All</option>
            <option value="PIX">PIX</option>
            <option value="TED">TED</option>
          </select>

          <label htmlFor="filter-period">Filter by Period:</label>
          <select
            id="filter-period"
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
          >
            <option value="all">All</option>
            <option value="7days">Last 7 Days</option>
            <option value="15days">Last 15 Days</option>
            <option value="30days">Last 30 Days</option>
            <option value="90days">Last 90 Days</option>
          </select>
        </div>

        <table className="transaction-table">
          <thead>
            <tr>
              <th>Date</th>
              <th>Type</th>
              <th>Value</th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.length === 0 ? (
              <tr>
                <td colSpan={3} style={{ textAlign: "center" }}>
                  No transactions found.
                </td>
              </tr>
            ) : (
              filteredTransactions.map((transaction) => (
                <tr key={transaction.id}>
                  <td>{new Date(transaction.date).toLocaleDateString()}</td>
                  <td>{transaction.type}</td>
                  <td
                    className={transaction.value < 0 ? "negative" : "positive"}
                  >
                    R$ {transaction.value.toFixed(2)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default History;
