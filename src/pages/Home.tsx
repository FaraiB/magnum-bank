import React from "react";
import { useSelector } from "react-redux";
import type { RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { clearUser } from "../redux/userSlice";
import { useDispatch } from "react-redux";

const Home = () => {
  const user = useSelector((state: RootState) => state.user);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  if (!user.id) {
    navigate("/login");
    return null;
  }

  const handleLogout = () => {
    dispatch(clearUser());
    localStorage.removeItem("user_id");
    navigate("/login");
  };
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
      </div>
    </div>
  );
};

export default Home;
