import React from "react";
import { type Transaction } from "../redux/userSlice";
import { useTranslation } from "react-i18next";

type TransactionListProps = {
  transactions: Transaction[];
};

const TransactionList: React.FC<TransactionListProps> = ({ transactions }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg shadow-lg border border-gray-200">
      {transactions.length > 0 ? (
        <div className="divide-y divide-gray-200">
          <div className="px-6 py-4 bg-gray-50 rounded-t-lg">
            <h3 className="text-lg font-medium text-gray-900">
              {t("history.transactions")} ({transactions.length})
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {transactions.map((transaction) => (
              <div
                key={transaction.id}
                className="px-6 py-4 hover:bg-gray-50 transition-colors duration-200"
              >
                <div className="flex flex-col space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-base font-medium text-gray-900">
                      {transaction.recipientName}
                    </h4>
                    <span className="text-lg font-medium text-red-600">
                      R$ {Math.abs(transaction.value).toFixed(2)}
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-700">
                        {t("history.type")}
                      </span>
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 w-fit mt-1">
                        {transaction.type}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-700">
                        {t("history.date")}
                      </span>
                      <span className="mt-1">
                        {new Date(transaction.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex flex-col">
                      <span className="font-medium text-gray-700">
                        {t("history.balance")}
                      </span>
                      <span className="mt-1 font-medium">
                        R$ {transaction.balanceAfter.toFixed(2)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <svg
              className="w-8 h-8 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {t("history.noTransactions")}
          </h3>
        </div>
      )}
    </div>
  );
};

export default TransactionList;
