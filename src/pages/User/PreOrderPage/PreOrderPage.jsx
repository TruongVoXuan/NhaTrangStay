import SideBar from "components/shared/User/Management/SideBar/SideBar";
import "./PreOrderPage.scss";
import React from "react";
import PreOrderManage from "components/shared/User/Management/PreOrderManage/PreOrderManage";

const PreOrderPage = () => {
  return (
    <div className="main-pre-order-container">
      <div className="left-infor-container">
        <SideBar />
      </div>
      <div className="right-pre-order-container">
        <PreOrderManage />
      </div>
    </div>
  );
};

export default PreOrderPage;
