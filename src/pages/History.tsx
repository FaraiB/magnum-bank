import { useState, useMemo } from "react";
import { useSelector } from "react-redux";
import { type RootState } from "../redux/store";
import Layout from "../components/Layout";
import "./History.css";

const History = () => {
  const allTransactions = useSelector(
    (state: RootState) => state.user.transactions
  );

  const [filterType, setFilterType] = useState("all");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [minAmount, setMinAmount] = useState("");
  const [maxAmount, setMaxAmount] = useState("");
  const [sortOrder, setSortOrder] = useState("desc");

  const filteredAndSortedTransactions = useMemo(() => {
    let filteredTransactions = [...allTransactions];

    // Filter by type
    if (filterType !== "all") {
      filteredTransactions = filteredTransactions.filter(
        (t) => t.type === filterType
      );
    }

    // Filter by date range
    if (startDate) {
      filteredTransactions = filteredTransactions.filter(
        (t) => new Date(t.date) >= new Date(startDate)
      );
    }
    if (endDate) {
      filteredTransactions = filteredTransactions.filter(
        (t) => new Date(t.date) <= new Date(endDate)
      );
    }

    // Filter by amount range
    if (minAmount) {
      filteredTransactions = filteredTransactions.filter(
        (t) => Math.abs(t.value) >= parseFloat(minAmount)
      );
    }
    if (maxAmount) {
      filteredTransactions = filteredTransactions.filter(
        (t) => Math.abs(t.value) <= parseFloat(maxAmount)
      );
    }

    // Sort transactions
    return filteredTransactions.sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
    });
  }, [
    allTransactions,
    filterType,
    startDate,
    endDate,
    minAmount,
    maxAmount,
    sortOrder,
  ]);

  const handlePeriodFilter = (days: number) => {
    const today = new Date();
    const pastDate = new Date();
    pastDate.setDate(today.getDate() - days);
    setStartDate(pastDate.toISOString().substring(0, 10));
    setEndDate(today.toISOString().substring(0, 10));
  };

  const handleResetFilters = () => {
    setFilterType("all");
    setStartDate("");
    setEndDate("");
    setMinAmount("");
    setMaxAmount("");
  };

  return (
    <Layout>
      <div className="history-page">
        <h1 className="page-title">Transaction History</h1>
        <div className="filter-controls">
          <div className="filter-group">
            <label htmlFor="filterType">Type:</label>
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

          <div className="period-filters">
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
            <label htmlFor="minAmount">Min Amount:</label>
            <input
              type="number"
              id="minAmount"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              placeholder="0.00"
            />
            <label htmlFor="maxAmount">Max Amount:</label>
            <input
              type="number"
              id="maxAmount"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              placeholder="0.00"
            />
          </div>

          <button onClick={handleResetFilters} className="reset-btn">
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
          {filteredAndSortedTransactions.length > 0 ? (
            <ul>
              {filteredAndSortedTransactions.map((transaction) => (
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
            <p className="no-transactions">No transactions found.</p>
          )}
        </div>
      </div>
    </Layout>
  );
};

export default History;
