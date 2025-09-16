import { useSelector } from "react-redux";
import { type RootState } from "../redux/store";
import { useNavigate } from "react-router-dom";
import { useEffect, memo } from "react";
import Layout from "../components/Layout";
import BalanceCard from "../components/BalanceCard";
import LatestTransactions from "../components/LatestTransactions";
import { useTranslation } from "react-i18next";

const selectLatestTransactions = (state: RootState) =>
  state.user.transactions.slice(0, 3);

const Home = () => {
  const user = useSelector((state: RootState) => state.user);
  const latestTransactions = useSelector(selectLatestTransactions);
  const navigate = useNavigate();
  const { t } = useTranslation();

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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <div className="text-center sm:text-left">
            <h2 className="text-3xl font-bold text-gray-900 mb-2">
              {t("home.welcome", { name: user.name })}
            </h2>
            <p className="text-gray-600">{t("home.subtitle")}</p>
          </div>

          <BalanceCard balance={user.balance} />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              className="bg-red-600 hover:bg-red-700 text-white font-medium py-4 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 shadow-sm"
              onClick={() => navigate("/transactions")}
            >
              {t("home.newTransaction")}
            </button>
            <button
              className="bg-gray-800 hover:bg-gray-900 text-white font-medium py-4 px-6 rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 shadow-sm"
              onClick={() => navigate("/history")}
            >
              {t("home.transactionHistory")}
            </button>
          </div>

          <LatestTransactions transactions={latestTransactions} />
        </div>
      </div>
    </Layout>
  );
};

export default memo(Home);
