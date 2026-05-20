import "./PostNewsPage.scss";
import InforBase from "components/shared/User/Post/InforBase/InforBase";


function PostNewsPage() {
    return ( 
        <div className="post-news-page-wrapper">
            <main className="post-news-content">
                <InforBase />
            </main>
        </div>
    );
}
export default PostNewsPage;