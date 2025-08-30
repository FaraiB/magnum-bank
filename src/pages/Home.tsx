import { useSelector } from "react-redux";
import { type RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { clearUser } from "../redux/userSlice";
import { useDispatch } from "react-redux";
import { useEffect } from "react";

const Home = () => {
  const user = useSelector((state: RootState) => state.user);
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

  // Get the last 3 transactions for the summary
  const latestTransactions = user.transactions.slice(0, 3);

  return (
    <div className="container">
      <nav className="navbar">
        <h1>Magnum Bank</h1>
        <button onClick={handleLogout} className="logout-btn">
          Logout
        </button>
      </nav>
      <div className="content">
        <h2>Welcome, {user.name}</h2>
        <div className="balance-card">
          <h3>Current Balance</h3>
          <p className="balance-amount">R$ {user.balance.toFixed(2)}</p>
        </div>
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

        <div className="transaction-summary">
          <h3>Latest Transactions</h3>
          {latestTransactions.length > 0 ? (
            <ul>
              {latestTransactions.map((transaction) => (
                <li key={transaction.id}>
                  <p>
                    {new Date(transaction.date).toLocaleDateString()} -{" "}
                    {transaction.type}: R${" "}
                    {Math.abs(transaction.value).toFixed(2)}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p>No recent transactions.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Home;
