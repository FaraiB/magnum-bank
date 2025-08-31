import React, { memo } from "react";
import "../pages/Home.css";

type Transaction = {
  id: string;
  date: string;
  type: string;
  value: number;
};

type LatestTransactionsProps = {
  transactions: Transaction[];
};

const LatestTransactions: React.FC<LatestTransactionsProps> = ({
  transactions,
}) => {
  return (
    <div className="transaction-summary">
      <h3>Latest Transactions</h3>
      {transactions.length > 0 ? (
        <ul>
          {transactions.map((transaction) => (
            <li key={transaction.id}>
              <p>
                {new Date(transaction.date).toLocaleDateString()} -{" "}
                {transaction.type}: R$ {Math.abs(transaction.value).toFixed(2)}
              </p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No recent transactions.</p>
      )}
    </div>
  );
};

export default memo(LatestTransactions);
