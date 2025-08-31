import React, { useState, memo } from "react";
import "../pages/Transactions.css";

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
      <form onSubmit={handleSubmit}>
        {error && <p className="error-message">{error}</p>}
        <div className="form-group">
          <label htmlFor="recipientName">Recipient Name:</label>
          <input
            type="text"
            id="recipientName"
            value={recipientName}
            onChange={(e) => setRecipientName(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="recipientCpf">Recipient CPF/CNPJ:</label>
          <input
            type="text"
            id="recipientCpf"
            value={recipientCpf}
            onChange={(e) => setRecipientCpf(e.target.value)}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="amount">Amount (R$):</label>
          <input
            type="text"
            id="amount"
            value={formatCurrency(amountInput)}
            onChange={handleAmountChange}
            placeholder="0,00"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="transactionType">Transaction Type:</label>
          <select
            id="transactionType"
            value={transactionType}
            onChange={(e) => setTransactionType(e.target.value)}
          >
            <option value="PIX">PIX</option>
            <option value="TED">TED</option>
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="transactionDate">Date:</label>
          <input
            type="date"
            id="transactionDate"
            value={transactionDate}
            onChange={(e) => setTransactionDate(e.target.value)}
            min={today}
            required
          />
        </div>

        {transactionType === "PIX" && (
          <div className="form-group">
            <label htmlFor="pixKey">PIX Key:</label>
            <input
              type="text"
              id="pixKey"
              value={pixKey}
              onChange={(e) => setPixKey(e.target.value)}
              required
            />
          </div>
        )}

        {transactionType === "TED" && (
          <>
            <div className="form-group">
              <label htmlFor="bank">Bank:</label>
              <input
                type="text"
                id="bank"
                value={bank}
                onChange={(e) => setBank(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="branch">Branch:</label>
              <input
                type="text"
                id="branch"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="account">Account:</label>
              <input
                type="text"
                id="account"
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                required
              />
            </div>
          </>
        )}

        <button type="submit" className="action-btn">
          Transfer
        </button>
      </form>
    );
  }
);

export default memo(TransactionForm);
