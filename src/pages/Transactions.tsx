import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { addTransaction, setBalance } from "../redux/userSlice";

const Transactions = () => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [recipientName, setRecipientName] = useState("");
  const [recipientCpf, setRecipientCpf] = useState("");
  const [amount, setAmount] = useState<number | "">("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleTransaction = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (typeof amount !== "number" || amount <= 0) {
      setError("Please enter a valid amount.");
      return;
    }

    if (amount > user.balance) {
      setError("Insufficient funds.");
      return;
    }

    try {
      const newBalance = user.balance - amount;
      const transaction = {
        id: Date.now().toString(),
        type: "PIX/TED",
        date: new Date().toISOString(),
        value: amount,
        balanceAfter: newBalance,
      };
      dispatch(setBalance(newBalance));
      dispatch(addTransaction(transaction));

      setSuccess(
        `Transaction of R$ ${amount.toFixed(2)} to ${recipientName} successful!`
      );

      setRecipientName("");
      setRecipientCpf("");
      setAmount("");
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

        <form onSubmit={handleTransaction} action="transaction-form">
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
            <label htmlFor="amount">Amount:</label>
            <input
              type="text"
              id="amount"
              value={amount}
              onChange={(e) => setAmount(parseFloat(e.target.value) || "")}
              required
            />
          </div>
          <button type="submit" className="action-btn">
            Tansfer
          </button>
        </form>
      </div>
    </div>
  );
};

export default Transactions;
