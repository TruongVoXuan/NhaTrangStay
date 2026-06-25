import "./AdminHeader.scss";
import { useNavigate } from "react-router-dom";
import logo from "../../../assets/images/logo.png";

const AdminHeader = () => {
    const navigate = useNavigate();

    return (
        <div className="admin-header">
            <div className="header-logo" onClick={() => navigate("/admin/dashboard")}>
                <img className="logo-img" src={logo} alt="logo" />
            </div>
        </div>
    );
}
export default AdminHeader;