import { useSelector } from "react-redux";
import { type RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { clearUser } from "../redux/userSlice";
import { useDispatch } from "react-redux";
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
  const dispatch = useDispatch();

  useEffect(() => {
    if (!user || !user.id) {
      navigate("/login");
    }
  }, [user, navigate]);

  if (!user || !user.id) {
    return null;
  }

  const handleLogout = () => {
    dispatch(clearUser());
    localStorage.removeItem("user_id");
    localStorage.removeItem("auth_token");
  };

  return (
    <Layout>
      <div className="container">
        <nav className="navbar">
          <h1>Magnum Bank</h1>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </nav>
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
