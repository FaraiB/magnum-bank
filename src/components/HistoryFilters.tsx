import React from "react";

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
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-6">
        Filter Transactions
      </h3>

      <div className="space-y-6">
        {/* Transaction Type Filter */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
          <label
            htmlFor="filterType"
            className="block text-sm font-medium text-gray-700 mb-1 sm:mb-0 sm:w-24"
          >
            Type:
          </label>
          <select
            id="filterType"
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white"
          >
            <option value="all">All Types</option>
            <option value="PIX">PIX</option>
            <option value="TED">TED</option>
          </select>
        </div>

        {/* Quick Period Filters */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700">
            Quick Filters:
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => handlePeriodFilter(7)}
              className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Last 7 days
            </button>
            <button
              onClick={() => handlePeriodFilter(15)}
              className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Last 15 days
            </button>
            <button
              onClick={() => handlePeriodFilter(30)}
              className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Last 30 days
            </button>
            <button
              onClick={() => handlePeriodFilter(90)}
              className="px-3 py-2 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            >
              Last 90 days
            </button>
          </div>
        </div>

        {/* Date Range Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label
              htmlFor="startDate"
              className="block text-sm font-medium text-gray-700"
            >
              Start Date:
            </label>
            <input
              type="date"
              id="startDate"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label
              htmlFor="endDate"
              className="block text-sm font-medium text-gray-700"
            >
              End Date:
            </label>
            <input
              type="date"
              id="endDate"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
            />
          </div>
        </div>

        {/* Amount Range Filters */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label
              htmlFor="minAmount"
              className="block text-sm font-medium text-gray-700"
            >
              Min Amount (R$):
            </label>
            <input
              type="number"
              id="minAmount"
              value={minAmount}
              onChange={(e) => setMinAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
            />
          </div>
          <div className="space-y-1">
            <label
              htmlFor="maxAmount"
              className="block text-sm font-medium text-gray-700"
            >
              Max Amount (R$):
            </label>
            <input
              type="number"
              id="maxAmount"
              value={maxAmount}
              onChange={(e) => setMaxAmount(e.target.value)}
              placeholder="0.00"
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
            />
          </div>
        </div>

        {/* Sort and Reset Controls */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-center space-x-4">
            <label
              htmlFor="sortOrder"
              className="block text-sm font-medium text-gray-700"
            >
              Sort by Date:
            </label>
            <select
              id="sortOrder"
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white"
            >
              <option value="desc">Newest First</option>
              <option value="asc">Oldest First</option>
            </select>
          </div>

          <button
            onClick={handleResetFilters}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
          >
            Reset Filters
          </button>
        </div>
      </div>
    </div>
  );
};

export default HistoryFilters;
