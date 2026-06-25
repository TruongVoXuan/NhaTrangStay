import React from "react";
import SideBar from "components/shared/User/Management/SideBar/SideBar";
import ManagePost from "components/shared/User/Management/ManagePost/ManagePost";
import './ManagePostPage.scss'

const ManagePostPage = () => {
  return (
    <div className="main-manage-post-container">
      <div className="left-infor-container">
        <SideBar />
      </div>
      <div className="right-manage-post-container">
        <ManagePost />
      </div>
    </div>
  );
};

export default ManagePostPage;
