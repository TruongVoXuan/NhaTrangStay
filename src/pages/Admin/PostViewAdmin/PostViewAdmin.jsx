import React, { useEffect, useState } from "react";
import { useParams,useLocation  } from "react-router-dom";
import { userAPI } from "lib/apiService";

import "./PostViewAdmin.scss";
import ava from "assets/images/avatar1.png";
import { useNavigate } from "react-router-dom";
const PostViewAdmin = () => {


const navigate = useNavigate();

  const { id } = useParams();
const location = useLocation();
const user = location.state?.user;
  const [posts, setPosts] = useState([]);
const [userInfo, setUserInfo] = useState(null);
  useEffect(() => {
  const fetchPosts = async () => {
    try {
      //  posts
      const resPosts = await userAPI.getPostsByUser(id);
      const postData = resPosts.data?.content || resPosts.data || [];
      setPosts(postData);

      //  user
      const resUser = await userAPI.getById(id);

      console.log("USER API:", resUser.data); // debug

      const userData = resUser.data?.data || resUser.data;
      setUserInfo(userData);

    } catch (err) {
      console.error(" Lỗi load:", err);
    }
  };

  fetchPosts();
}, [id]);

  return (
    <div className="admin-posts">
  <h2 className="page-title">
  Danh sách bài đăng của{" "}
  {user?.fullName || user?.username || "User"}
</h2>

      <div className="post-list">
        {posts.length === 0 ? (
          <p>Không có bài đăng</p>
        ) : (
          posts.map((p) => (
            <div
  className="post-card"
  key={p.id}
  onClick={() => navigate(`/post/${p.id}`)}
>
              <img src={p.images?.[0]?.url || ava} alt="" />

              <div className="info">
                <h4>{p.title}</h4>
                <p className="price">{p.price} VND</p>
                <p className="address">{p.address}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PostViewAdmin;