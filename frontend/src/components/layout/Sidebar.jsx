import { NavLink, useNavigate } from "react-router-dom";
import logoImg from "../../assets/images/logo.png";

function Sidebar({ onChatClick }) {
    const navigate = useNavigate();

    const role = localStorage.getItem("role");
    const bankCode = localStorage.getItem("bankCode") || "";

    const defaultAdminBankCode = "02";

    const handleLogoClick = () => {
        if (role === "admin") {
            navigate("/admin");
        }
    };

    const handleLogout = () => {
        localStorage.removeItem("memberId");
        localStorage.removeItem("role");
        localStorage.removeItem("bankCode");
        navigate("/");
    };

    const chartPath =
        role === "admin" ? `/bank/${defaultAdminBankCode}` : `/bank/${bankCode}`;

    return (
        <aside className="sidebar">
            <div className="sidebar_top">
                {role === "admin" ? (
                    <button type="button" onClick={handleLogoClick} className="logo_link" title="홈">
                        <img src={logoImg} alt="FFG 로고" />
                    </button>
                ) : (
                    <div className="logo_link disabled_logo">
                        <img src={logoImg} alt="FFG 로고" />
                    </div>
                )}
            </div>

            <nav className="sidebar_nav">
                <NavLink
                    to={chartPath}
                    className={({ isActive }) => `nav_item chart ${isActive ? "active" : ""}`}
                    title="통계"
                />

                <NavLink
                    to="/board/error"
                    className={({ isActive }) => `nav_item error ${isActive ? "active" : ""}`}
                    title="분석의뢰"
                />

                <NavLink
                    to="/board/notice"
                    className={({ isActive }) => `nav_item notice ${isActive ? "active" : ""}`}
                    title="공지사항"
                />

                <NavLink
                    to="/board/community"
                    className={({ isActive }) => `nav_item community ${isActive ? "active" : ""}`}
                    title="커뮤니티"
                />

                <NavLink
                    to="/board/faq"
                    className={({ isActive }) => `nav_item faq ${isActive ? "active" : ""}`}
                    title="FAQ"
                />
            </nav>

            <div className="sidebar_bottom">
                <button
                    type="button"
                    className="nav_item chating chat_button"
                    title="채팅"
                    onClick={onChatClick}
                />

                {role === "admin" ? (
                    <NavLink
                        to="/scheduler"
                        className={({ isActive }) => `nav_item calendar ${isActive ? "active" : ""}`}
                        title="근무스케줄표"
                    />
                ) : (
                    <button
                        type="button"
                        className="nav_item calendar disabled_nav"
                        title="근무스케줄표"
                        disabled
                    />
                )}

                <button type="button" className="nav_item logout" onClick={handleLogout}>
                    Logout
                </button>
            </div>
        </aside>
    );
}

export default Sidebar;