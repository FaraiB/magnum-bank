import React, { memo } from "react";
import "../pages/Home.css";

type BalanceCardProps = {
  balance: number;
};

const BalanceCard: React.FC<BalanceCardProps> = ({ balance }) => {
  return (
    <div className="balance-card">
      <h3>Current Balance</h3>
      <p className="balance-amount">R$ {balance.toFixed(2)}</p>
    </div>
  );
};

export default memo(BalanceCard);
