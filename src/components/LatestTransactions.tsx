import React, { memo } from "react";

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
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <h3 className="text-lg font-medium text-gray-900 mb-4">
        Latest Transactions
      </h3>
      {transactions.length > 0 ? (
        <div className="space-y-3">
          {transactions.map((transaction) => (
            <div
              key={transaction.id}
              className="flex justify-between items-center py-3 px-4 bg-gray-50 rounded-md border border-gray-100"
            >
              <div className="flex flex-col">
                <span className="text-sm font-medium text-gray-900">
                  {transaction.type}
                </span>
                <span className="text-xs text-gray-500">
                  {new Date(transaction.date).toLocaleDateString()}
                </span>
              </div>
              <span className="text-sm font-medium text-red-600">
                R$ {Math.abs(transaction.value).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500 text-sm">No recent transactions.</p>
        </div>
      )}
    </div>
  );
};

export default memo(LatestTransactions);
