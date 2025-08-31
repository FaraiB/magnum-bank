import React, { memo } from "react";
import { type Transaction } from "../redux/userSlice";
import "../pages/Transactions.css";

type SummaryModalProps = {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction | null;
  status: string;
};

const SummaryModal: React.FC<SummaryModalProps> = memo(
  ({ isOpen, onClose, transaction, status }) => {
    if (!isOpen || !transaction) {
      return null;
    }

    return (
      <div className="modal-overlay">
        <div className="modal">
          <h3>Transaction Summary</h3>
          <div className="transaction-summary">
            <p>
              <strong>Status:</strong> {status}
            </p>
            <p>
              <strong>Recipient:</strong> {transaction.recipientName}
            </p>
            <p>
              <strong>Amount:</strong> R${" "}
              {Math.abs(transaction.value).toFixed(2)}
            </p>
            <p>
              <strong>Type:</strong> {transaction.type}
            </p>
            <p>
              <strong>Date:</strong>{" "}
              {new Date(transaction.date).toLocaleDateString()}
            </p>
          </div>
          <button className="action-btn" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    );
  }
);

export default SummaryModal;
