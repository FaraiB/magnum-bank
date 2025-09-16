import React, { memo } from "react";
import { useTranslation } from "react-i18next";

type BalanceCardProps = {
  balance: number;
};

const BalanceCard: React.FC<BalanceCardProps> = ({ balance }) => {
  const { t } = useTranslation();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200">
      <div className="text-center">
        <h3 className="text-lg font-medium text-gray-700 mb-3">
          {t("home.currentBalance")}
        </h3>
        <p className="text-4xl font-bold text-gray-900">
          R$ {balance.toFixed(2)}
        </p>
      </div>
    </div>
  );
};

export default memo(BalanceCard);
