import SideBar from "components/shared/User/Management/SideBar/SideBar";
import "./ProfilePage.scss";
import React from "react";
import Profile from "components/shared/User/Management/Profile/Profile";

const ProfilePage = () => {
  return (
    <div className="main-infor-container">
      <div className="left-infor-container">
        <SideBar />
      </div>
      <div className="right-infor-container">
        <Profile />
      </div>
    </div>
  );
};

export default ProfilePage;
