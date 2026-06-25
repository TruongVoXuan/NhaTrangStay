import React from 'react';
import './NewPostSection.scss';

const NewPost = () => {
    const posts = Array(11).fill({
        id: Math.random(),
        title: "NHÀ TRỌ GIÁ RẺ THUẬN TIỆN ĐI LẠI PHƯỜNG ABC, KHÁNH HÒA",
        price: "4 triệu/tháng",
        time: "9 phút trước",
        image: "https://img.freepik.com/free-photo/3d-rendering-loft-luxury-living-room-with-bookshelf_105762-2182.jpg"
    });

    return (
        <aside className="new-post">
            <h3>Tin mới đăng</h3>
            
            {posts.map((post, index) => (
                <div key={index} className="post-item">
                    <img src={post.image} alt="room" className="post-image" />
                    
                    <div className="post-info">
                        <div className="post-title" title={post.title}>
                            {post.title}
                        </div>
                        
                        <div className="post-description">
                            <span className="post-price">
                                <strong>{post.price}</strong>
                            </span>
                            <span className="post-time">{post.time}</span>
                        </div>
                    </div>
                </div>
            ))}
        </aside>
    );
};

export default NewPost;