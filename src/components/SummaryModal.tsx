import React, { memo } from "react";
import { type Transaction } from "../redux/userSlice";

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
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="modal bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <div className="text-center mb-6">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <svg
                className="w-8 h-8 text-green-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">
              Transaction Summary
            </h3>
            <p className="text-sm text-green-600 font-medium mt-1">{status}</p>
          </div>

          <div className="space-y-4 mb-6">
            <div className="bg-gray-50 rounded-md p-4 space-y-3">
              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Recipient:
                </span>
                <span className="text-sm text-gray-900">
                  {transaction.recipientName}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">Type:</span>
                <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {transaction.type}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">Date:</span>
                <span className="text-sm text-gray-900">
                  {new Date(transaction.date).toLocaleDateString()}
                </span>
              </div>

              <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                <span className="text-sm font-medium text-gray-700">
                  Amount:
                </span>
                <span className="text-lg font-bold text-red-600">
                  R$ {Math.abs(transaction.value).toFixed(2)}
                </span>
              </div>

              <div className="flex justify-between">
                <span className="text-sm font-medium text-gray-700">
                  Balance After:
                </span>
                <span className="text-sm font-medium text-gray-900">
                  R$ {transaction.balanceAfter.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
          >
            Close
          </button>
        </div>
      </div>
    );
  }
);

export default SummaryModal;
