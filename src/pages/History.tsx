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
      let filterDate = new Date();

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
          <label>Filter by Type:</label>
          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="all">All</option>
            <option value="PIX/TED">PIX/TED</option>
          </select>

          <label>Filter by Period:</label>
          <select
            value={filterPeriod}
            onChange={(e) => setFilterPeriod(e.target.value)}
          >
            <option value="all">All</option>
            <option value="7days">Last 7 Days</option>
            <option value="15days">Last 15 Days</option>
            <option value="30days">Last 30 Days</option>
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
