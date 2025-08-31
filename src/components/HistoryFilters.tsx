import React from "react";
import "../pages/History.css";

// Define the props for this component
type HistoryFiltersProps = {
  filterType: string;
  setFilterType: (type: string) => void;
  startDate: string;
  setStartDate: (date: string) => void;
  endDate: string;
  setEndDate: (date: string) => void;
  minAmount: string;
  setMinAmount: (amount: string) => void;
  maxAmount: string;
  setMaxAmount: (amount: string) => void;
  handlePeriodFilter: (days: number) => void;
  handleResetFilters: () => void;
  sortOrder: string;
  setSortOrder: (order: string) => void;
};

const HistoryFilters: React.FC<HistoryFiltersProps> = ({
  filterType,
  setFilterType,
  startDate,
  setStartDate,
  endDate,
  setEndDate,
  minAmount,
  setMinAmount,
  maxAmount,
  setMaxAmount,
  handlePeriodFilter,
  handleResetFilters,
  sortOrder,
  setSortOrder,
}) => {
  return (
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
    </div>
  );
};

export default HistoryFilters;
