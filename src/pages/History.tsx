import { useState, useMemo, memo } from "react";
import { useSelector } from "react-redux";
import { type RootState } from "../redux/store";
import Layout from "../components/Layout";
import HistoryFilters from "../components/HistoryFilters";
import TransactionList from "../components/TransactionList";

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

    if (filterType !== "all") {
      filteredTransactions = filteredTransactions.filter(
        (t) => t.type === filterType
      );
    }

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Transaction History
          </h1>
          <p className="text-gray-600">
            Review and filter your transaction history
          </p>
        </div>

        <div className="space-y-6">
          <HistoryFilters
            filterType={filterType}
            setFilterType={setFilterType}
            startDate={startDate}
            setStartDate={setStartDate}
            endDate={endDate}
            setEndDate={setEndDate}
            minAmount={minAmount}
            setMinAmount={setMinAmount}
            maxAmount={maxAmount}
            setMaxAmount={setMaxAmount}
            handlePeriodFilter={handlePeriodFilter}
            handleResetFilters={handleResetFilters}
            sortOrder={sortOrder}
            setSortOrder={setSortOrder}
          />
          <TransactionList transactions={filteredAndSortedTransactions} />
        </div>
      </div>
    </Layout>
  );
};

export default memo(History);
