import { useSelector } from "react-redux";
import { type RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { useEffect, memo } from "react";
import Layout from "../components/Layout";
import "./Home.css";
import BalanceCard from "../components/BalanceCard";
import LatestTransactions from "../components/LatestTransactions";

const selectLatestTransactions = (state: RootState) =>
  state.user.transactions.slice(0, 3);

const Home = () => {
  const user = useSelector((state: RootState) => state.user);
  const latestTransactions = useSelector(selectLatestTransactions);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.id) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user || !user.id) {
    return null;
  }

  return (
    <Layout>
      <div className="container">
        <div className="content">
          <h2>Welcome, {user.name}</h2>
          <BalanceCard balance={user.balance} />
          <div className="actions">
            <button
              className="action-btn"
              onClick={() => navigate("/transactions")}
            >
              New Transaction
            </button>
            <button className="action-btn" onClick={() => navigate("/history")}>
              Transaction History
            </button>
          </div>
          <LatestTransactions transactions={latestTransactions} />
        </div>
      </div>
    </Layout>
  );
};

export default memo(Home);
