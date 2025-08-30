import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { addTransaction, setBalance } from "../redux/userSlice";

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

    const amount = parseFloat(amountInput) / 100;

    if (isNaN(amount) || amount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    if (amount > user.balance) {
      setError("Insufficient funds.");
      return;
    }

    const transactionValue = -Math.abs(amount);
    const newBalance = user.balance + transactionValue;

    const transaction = {
      id: Date.now().toString(),
      type: transactionType,
      date: new Date().toISOString(),
      value: transactionValue,
      balanceAfter: newBalance,
    };

    try {
      dispatch(addTransaction(transaction));
      dispatch(setBalance(newBalance));

      setSuccess(
        `Transaction of R$ ${Math.abs(transactionValue).toFixed(
          2
        )} to ${recipientName} successful!`
      );

      setRecipientName("");
      setRecipientCpf("");
      setAmountInput("");
    } catch (err) {
      setError("Transaction failed. Please try again");
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
        {success && <p className="success-message">{success}</p>}

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
          <button type="submit" className="action-btn">
            Transfer
          </button>
        </form>
      </div>
    </div>
  );
};

export default Transactions;
