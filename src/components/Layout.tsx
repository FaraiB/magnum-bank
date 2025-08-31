import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearUser } from "../redux/userSlice";

import "./Layout.css";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(clearUser());
    localStorage.removeItem("user_id");
    localStorage.removeItem("auth_token");
  };

  return (
    <div className="layout-container">
      <nav className="main-nav">
        {/* <h1 className="logo">Magnum Bank</h1> */}
        <Link to="/">
          <img src="src/assets/logo-magnum.png" alt="Magnum Bank" />
        </Link>
        <div className="nav-links">
          <Link to="/" className="nav-link">
            Home
          </Link>
          <Link to="/transactions" className="nav-link">
            Transactions
          </Link>
          <Link to="/history" className="nav-link">
            History
          </Link>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </nav>
      <main className="main-content">{children}</main>
    </div>
  );
};

export default Layout;
