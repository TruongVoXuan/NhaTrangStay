import React from "react";
import "./HistoryTransactionPage.scss";
import HistoryTransaction from "components/shared/User/Management/HistoryTransaction/HistoryTransaction";
import SideBar from "components/shared/User/Management/SideBar/SideBar";

const HistoryTransactionPage = () => {
  return (
    <div className="main-history-transaction-container">
      <div className="left-history-transaction-container">
        <SideBar />
      </div>
      <div className="right-history-transaction-container">
        <HistoryTransaction />
      </div>
    </div>
  );
};

export default HistoryTransactionPage;
