import { type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearUser } from "../redux/userSlice";
import { t } from "i18next";
import { LanguageSwitcher } from "../i18n/components/LanguageProvider";

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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex justify-end">
            <LanguageSwitcher />
          </div>
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="flex-shrink-0">
              <img
                src="/logo-magnum.png"
                alt="Magnum Bank"
                className="h-8 w-auto"
              />
            </Link>
            <div className="flex items-center space-x-8">
              <Link
                to="/"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                {t("nav.home")}
              </Link>
              <Link
                to="/transactions"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                {t("nav.transactions")}
              </Link>
              <Link
                to="/history"
                className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium transition-colors duration-200"
              >
                {t("nav.history")}
              </Link>
              <button
                onClick={handleLogout}
                className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-md text-sm font-medium transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2"
              >
                {t("nav.logout")}
              </button>
            </div>
          </div>
        </div>
      </nav>
      <main className="flex-1">{children}</main>
    </div>
  );
};

export default Layout;
