import React, { useState, memo } from "react";

export type TransactionFormData = {
  recipientName: string;
  recipientCpf: string;
  amount: number;
  transactionType: string;
  transactionDate: string;
  bank: string;
  branch: string;
  account: string;
  pixKey: string;
};

type TransactionFormProps = {
  userBalance: number;
  onSubmit: (data: TransactionFormData) => void;
  error?: string;
};

const TransactionForm: React.FC<TransactionFormProps> = memo(
  ({ onSubmit, error }) => {
    const [recipientName, setRecipientName] = useState("");
    const [recipientCpf, setRecipientCpf] = useState("");
    const [amountInput, setAmountInput] = useState("");
    const [transactionType, setTransactionType] = useState("PIX");
    const [bank, setBank] = useState("");
    const [branch, setBranch] = useState("");
    const [account, setAccount] = useState("");
    const [pixKey, setPixKey] = useState("");

    const today = new Date().toISOString().substring(0, 10);
    const [transactionDate, setTransactionDate] = useState(today);

    const formatCurrency = (value: string) => {
      const digits = value.replace(/\D/g, "");
      if (!digits) {
        return "";
      }
      const numberValue = parseInt(digits, 10);
      const formatted = (numberValue / 100).toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
      return formatted;
    };

    const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { value } = e.target;
      const rawDigits = value.replace(/\D/g, "");
      setAmountInput(rawDigits);
    };

    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();

      const amount = parseFloat(amountInput) / 100;

      const formData: TransactionFormData = {
        recipientName,
        recipientCpf,
        amount,
        transactionType,
        transactionDate,
        bank,
        branch,
        account,
        pixKey,
      };

      onSubmit(formData);
    };

    return (
      <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
        <h3 className="text-lg font-medium text-gray-900 mb-6">
          Transaction Details
        </h3>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4">
              <p className="text-red-700 text-sm font-medium">{error}</p>
            </div>
          )}

          <div className="space-y-1">
            <label
              htmlFor="recipientName"
              className="block text-sm font-medium text-gray-700"
            >
              Recipient Name
            </label>
            <input
              type="text"
              id="recipientName"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              required
              className="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              placeholder="Enter recipient's full name"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="recipientCpf"
              className="block text-sm font-medium text-gray-700"
            >
              Recipient CPF/CNPJ
            </label>
            <input
              type="text"
              id="recipientCpf"
              value={recipientCpf}
              onChange={(e) => setRecipientCpf(e.target.value)}
              required
              className="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
              placeholder="000.000.000-00"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700"
            >
              Amount (R$)
            </label>
            <input
              type="text"
              id="amount"
              value={formatCurrency(amountInput)}
              onChange={handleAmountChange}
              placeholder="0,00"
              required
              className="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors text-lg font-medium"
            />
          </div>

          <div className="space-y-1">
            <label
              htmlFor="transactionType"
              className="block text-sm font-medium text-gray-700"
            >
              Transaction Type
            </label>
            <select
              id="transactionType"
              value={transactionType}
              onChange={(e) => setTransactionType(e.target.value)}
              className="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white"
            >
              <option value="PIX">PIX</option>
              <option value="TED">TED</option>
            </select>
          </div>

          <div className="space-y-1">
            <label
              htmlFor="transactionDate"
              className="block text-sm font-medium text-gray-700"
            >
              Date
            </label>
            <input
              type="date"
              id="transactionDate"
              value={transactionDate}
              onChange={(e) => setTransactionDate(e.target.value)}
              min={today}
              required
              className="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors"
            />
          </div>

          {transactionType === "PIX" && (
            <div className="space-y-1 p-4 bg-gray-50 rounded-md border border-gray-200">
              <label
                htmlFor="pixKey"
                className="block text-sm font-medium text-gray-700"
              >
                PIX Key
              </label>
              <input
                type="text"
                id="pixKey"
                value={pixKey}
                onChange={(e) => setPixKey(e.target.value)}
                required
                className="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white"
                placeholder="Email, phone, CPF, or random key"
              />
            </div>
          )}

          {transactionType === "TED" && (
            <div className="space-y-4 p-4 bg-gray-50 rounded-md border border-gray-200">
              <h4 className="text-sm font-medium text-gray-900 mb-3">
                Bank Details
              </h4>

              <div className="space-y-1">
                <label
                  htmlFor="bank"
                  className="block text-sm font-medium text-gray-700"
                >
                  Bank
                </label>
                <input
                  type="text"
                  id="bank"
                  value={bank}
                  onChange={(e) => setBank(e.target.value)}
                  required
                  className="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white"
                  placeholder="Bank name or code"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label
                    htmlFor="branch"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Branch
                  </label>
                  <input
                    type="text"
                    id="branch"
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    required
                    className="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white"
                    placeholder="0000"
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="account"
                    className="block text-sm font-medium text-gray-700"
                  >
                    Account
                  </label>
                  <input
                    type="text"
                    id="account"
                    value={account}
                    onChange={(e) => setAccount(e.target.value)}
                    required
                    className="w-full px-3 py-3 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-colors bg-white"
                    placeholder="00000-0"
                  />
                </div>
              </div>
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-medium py-3 px-4 rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-sm"
          >
            Transfer
          </button>
        </form>
      </div>
    );
  }
);

export default memo(TransactionForm);
