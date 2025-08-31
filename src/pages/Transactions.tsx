import { useState, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { type RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import {
  addTransaction,
  setBalance,
  type Transaction,
} from "../redux/userSlice";
import Layout from "../components/Layout";
import "./Transactions.css";
import PasswordModal from "../components/PasswordModal";
import SummaryModal from "../components/SummaryModal";
import BalanceCard from "../components/BalanceCard";
import TransactionForm, {
  type TransactionFormData,
} from "../components/TransactionForm";

const Transactions = () => {
  const user = useSelector((state: RootState) => state.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [isSummaryModalOpen, setIsSummaryModalOpen] = useState(false);
  const [transactionSummary, setTransactionSummary] =
    useState<Transaction | null>(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [formKey, setFormKey] = useState(0);

  const handleTransactionFormSubmit = (data: TransactionFormData) => {
    setError("");

    if (data.amount > user.balance) {
      setError("Insufficient funds.");
      return;
    }

    setTransactionSummary({
      id: Date.now().toString(),
      type: data.transactionType,
      date: new Date(data.transactionDate).toISOString(),
      value: -Math.abs(data.amount),
      balanceAfter: user.balance - data.amount,
      recipientName: data.recipientName,
      recipientCpf: data.recipientCpf,
      ...(data.transactionType === "TED" && {
        bank: data.bank,
        branch: data.branch,
        account: data.account,
      }),
      ...(data.transactionType === "PIX" && {
        pixKey: data.pixKey,
      }),
    });

    setIsPasswordModalOpen(true);
  };

  const handlePasswordSubmit = () => {
    if (!transactionSummary) return;

    try {
      dispatch(addTransaction(transactionSummary));
      dispatch(setBalance(transactionSummary.balanceAfter));
      setSuccess("Transaction successful!");
      setIsPasswordModalOpen(false);
      setIsSummaryModalOpen(true);
      setFormKey((prevKey) => prevKey + 1);
      setError(""); // Clear any previous error message
    } catch (err) {
      setError("Transaction failed. Please try again");
      setIsPasswordModalOpen(false);
    }
  };

  return (
    <Layout>
      <div className="container">
        <nav className="navbar">
          <h1>New Transaction</h1>
          <button onClick={() => navigate("/")} className="action-btn">
            Back to Home
          </button>
        </nav>
        <div className="content">
          <BalanceCard balance={user.balance} />
          <TransactionForm
            key={formKey}
            userBalance={user.balance}
            onSubmit={handleTransactionFormSubmit}
            error={error}
          />
        </div>

        <PasswordModal
          isOpen={isPasswordModalOpen}
          onClose={() => {
            setIsPasswordModalOpen(false);
            setError("");
          }}
          onSubmit={handlePasswordSubmit}
        />
        <SummaryModal
          isOpen={isSummaryModalOpen}
          onClose={() => setIsSummaryModalOpen(false)}
          transaction={transactionSummary}
          status={success}
        />
      </div>
    </Layout>
  );
};

export default memo(Transactions);
