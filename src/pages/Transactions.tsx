import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import {
  addTransaction,
  setBalance,
  type Transaction,
} from "../redux/userSlice";

const Transactions = () => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [recipientName, setRecipientName] = useState("");
  const [recipientCpf, setRecipientCpf] = useState("");
  const [amountInput, setAmountInput] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [transactionType, setTransactionType] = useState("PIX");
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [transactionPassword, setTransactionPassword] = useState("");

  const [bank, setBank] = useState("");
  const [branch, setBranch] = useState("");
  const [account, setAccount] = useState("");
  const [pixKey, setPixKey] = useState("");

  const today = new Date().toISOString().substring(0, 10);
  const [transactionDate, setTransactionDate] = useState(today);

  const [transactionSummary, setTransactionSummary] =
    useState<Transaction | null>(null);

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

  const handleTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setTransactionSummary(null);

    const amount = parseFloat(amountInput) / 100;

    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    if (amount > user.balance) {
      setError("Insufficient funds.");
      return;
    }

    setIsPasswordModalOpen(true);
  };

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (transactionPassword === "1234") {
      const amount = parseFloat(amountInput) / 100;
      const transactionValue = -Math.abs(amount);
      const newBalance = user.balance + transactionValue;

      const transaction: Transaction = {
        id: Date.now().toString(),
        type: transactionType,
        date: new Date(transactionDate).toISOString(),
        value: transactionValue,
        balanceAfter: newBalance,
        recipientName,
        recipientCpf,
        ...(transactionType === "TED" && { bank, branch, account }),
        ...(transactionType === "PIX" && { pixKey }),
      };

      try {
        dispatch(addTransaction(transaction));
        dispatch(setBalance(newBalance));
        setSuccess("Transaction successful!");
        setTransactionSummary(transaction);

        setRecipientName("");
        setRecipientCpf("");
        setAmountInput("");
        setTransactionPassword("");
        setBank("");
        setBranch("");
        setAccount("");
        setPixKey("");
        setTransactionDate(today);
        setIsPasswordModalOpen(false);
        setIsSummaryModalOpen(true); // Open the summary modal
      } catch (err) {
        setError("Transaction failed. Please try again");
        setIsPasswordModalOpen(false);
      }
    } else {
      setError("Invalid transaction password.");
      setTransactionPassword("");
    }
  };

  return (
    <div className="container">
      <nav className="navbar">
        <h1>New Transaction</h1>
        <button onClick={() => navigate("/")} className="action-btn">
          Back to Home
        </button>
      </nav>
      <div className="content">
        <div className="balance-card">
          <h3>Your Current Balance</h3>
          <p className="balance-amount">R$ {user.balance.toFixed(2)}</p>
        </div>
        {error && <p className="error-message">{error}</p>}

        <form onSubmit={handleTransaction}>
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
      </div>

      {isPasswordModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Enter Transaction Password</h3>
            <form onSubmit={handlePasswordSubmit}>
              <input
                type="password"
                value={transactionPassword}
                onChange={(e) => setTransactionPassword(e.target.value)}
                required
              />
              <button type="submit" className="action-btn">
                Confirm
              </button>
              <button
                type="button"
                className="action-btn"
                onClick={() => setIsPasswordModalOpen(false)}
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      )}

      {isSummaryModalOpen && (
        <div className="modal-overlay">
          <div className="modal">
            <h3>Transaction Summary</h3>
            {transactionSummary && (
              <div className="transaction-summary">
                <p>
                  <strong>Status:</strong> {success}
                </p>
                <p>
                  <strong>Recipient:</strong> {transactionSummary.recipientName}
                </p>
                <p>
                  <strong>Amount:</strong> R${" "}
                  {Math.abs(transactionSummary.value).toFixed(2)}
                </p>
                <p>
                  <strong>Type:</strong> {transactionSummary.type}
                </p>
                <p>
                  <strong>Date:</strong>{" "}
                  {new Date(transactionSummary.date).toLocaleDateString()}
                </p>
              </div>
            )}
            <button
              className="action-btn"
              onClick={() => setIsSummaryModalOpen(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Transactions;
