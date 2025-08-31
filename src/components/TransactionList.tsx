import React from "react";
import "../pages/History.css";
import { type Transaction } from "../redux/userSlice";

type TransactionListProps = {
  transactions: Transaction[];
};

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  return (
    <div className="transaction-list">
      {transactions.length > 0 ? (
        <ul>
          {transactions.map((transaction) => (
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
  );
};

export default TransactionList;
