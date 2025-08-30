import { useState } from "react";
import { useSelector } from "react-redux";
import { type RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { type Transaction } from "../redux/userSlice";

const History = () => {
  const navigate = useNavigate();
  const allTransactions = useSelector(
    (state: RootState) => state.user.transactions
  );

  // State for filtering and sorting
  const [filterType, setFilterType] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  // Filtering Logic
  const filteredTransactions = allTransactions.filter(
    (transaction: Transaction) => {
      // Filter by transaction type
      if (filterType !== "all" && transaction.type !== filterType) {
        return false;
      }

      // Filter by date range
      if (startDate && new Date(transaction.date) < new Date(startDate)) {
        return false;
      }
      if (endDate && new Date(transaction.date) > new Date(endDate)) {
        return false;
      }

      // Filter by amount range
      const amount = Math.abs(transaction.value);
      if (minAmount && amount < parseFloat(minAmount)) {
        return false;
      }
      if (maxAmount && amount > parseFloat(maxAmount)) {
        return false;
      }

      return true;
    }
  );

  // Sorting Logic
  const sortedTransactions = [...filteredTransactions].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
  });

  // Helper function to handle period filters
  const handlePeriodFilter = (days: number) => {
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - days);
    setStartDate(pastDate.toISOString().substring(0, 10));
    setEndDate(today.toISOString().substring(0, 10));
  };

  // New handler to reset all filters
  const handleResetFilters = () => {
    setFilterType("all");
    setStartDate("");
    setEndDate("");
    setMinAmount("");
    setMaxAmount("");
  };

  return (
    <div className="container">
      <nav className="navbar">
        <h1>Transaction History</h1>
        <button onClick={() => navigate("/")} className="action-btn">
          Back to Home
        </button>
      </nav>
      <div className="content">
        <h2>Your Transactions</h2>

        <div className="filter-controls">
          <div className="filter-group">
            <label htmlFor="filterType">Filter by Type:</label>
            <select
              id="filterType"
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="all">All</option>
              <option value="PIX">PIX</option>
              <option value="TED">TED</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Filter by Period:</label>
            <button onClick={() => handlePeriodFilter(7)}>Last 7 days</button>
            <button onClick={() => handlePeriodFilter(15)}>Last 15 days</button>
            <button onClick={() => handlePeriodFilter(30)}>Last 30 days</button>
            <button onClick={() => handlePeriodFilter(90)}>Last 90 days</button>
          </div>

          <div className="filter-group">
            <label htmlFor="startDate">Start Date:</label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <label htmlFor="endDate">End Date:</label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
          </div>

          <div className="filter-group">
            <label htmlFor="minAmount">Min Amount (R$):</label>
            <input
              type="number"
              id="minAmount"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              placeholder="0.00"
            />
            <label htmlFor="maxAmount">Max Amount (R$):</label>
            <input
              type="number"
              id="maxAmount"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <button onClick={handleResetFilters} className="action-btn">
            Reset Filters
          </button>
        </div>

        <div className="sort-controls">
          <label htmlFor="sortOrder">Sort by Date:</label>
          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="desc">Newest First</option>
            <option value="asc">Oldest First</option>
          </select>
        </div>

        <div className="transaction-list">
          {sortedTransactions.length > 0 ? (
            <ul>
              {sortedTransactions.map((transaction) => (
                <li key={transaction.id} className="transaction-item">
                  <div className="transaction-details">
                    <p>
                      <strong>Type:</strong> {transaction.type}
                    </p>
                    <p>
                      <strong>Date:</strong>{" "}
                      {new Date(transaction.date).toLocaleDateString()}
                    </p>
                    <p>
                      <strong>Amount:</strong> R${" "}
                      {Math.abs(transaction.value).toFixed(2)}
                    </p>
                    <p>
                      <strong>Balance after:</strong> R${" "}
                      {transaction.balanceAfter.toFixed(2)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No transactions found.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
