import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import "../styles/Layout.css";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  return (
    <div className="layout-container">
      <nav className="main-nav">
        <h1 className="logo">Magnum Bank</h1>
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
        </div>
      </nav>
      <main className="main-content">{children}</main>
    </div>
  );
};

export default Layout;
