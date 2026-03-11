import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/reset.css";
import "../styles/layout.css";
import "../styles/a01_login.css";
import logoImg from "../assets/logo.png"



function LoginPage(){
    const navigate = useNavigate();

    const [bankCode, setBankCode] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [keepLogin, setKeepLogin] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [isSupportModalOpen, setIsSupportModalOpen] = useState(false);
    const [supportMessage, setSupportMessage] = useState("");
    const [errorMessage, setErrorMessage] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();

        if (!bankCode || !username || !password) {
            setErrorMessage("모든 항목을 입력해주세요.");
            return;
        }

        try {
            const response = await fetch("http://localhost:8080/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    memberId: username,
                    pwd: password,
                }),
            });

            const data = await response.json();

            console.log("로그인 응답:", data);

            if (data.success) {
                setErrorMessage("");

                if (data.role === "admin") {
                    navigate("/admin");
                } else if (data.role === "bank") {
                    navigate(`/bank/${data.bankCode}`);
                } else {
                    setErrorMessage("권한 정보가 올바르지 않습니다.");
                }
            } else {
                setErrorMessage(data.message || "로그인에 실패했습니다.");
            }
        } catch (error) {
            console.error("로그인 요청 오류:", error);
            setErrorMessage("서버 연결 중 오류가 발생했습니다.");
        }
    };

    const handleSupportSubmit = (e) => {
        e.preventDefault();

        console.log("지원센터 문의:", supportMessage);

        alert("문의 접수 가정");
        setSupportMessage("");
        setIsSupportModalOpen(false);
    };

    const closeModalOnBackdrop = (e) => {
        if(e.target.className === "support_modal"){
            setIsSupportModalOpen(false);
        }
    };

    return (
        <div id="login_page">
            <div className="app_container">
                <div className="page">
                    <div className="login_card">
                        <div className="login_header">
                            <div className="logo_badge">
                                <img className="logo_img" src={logoImg} alt="FFG 로고" />
                            </div>
                            <div className="brand_text">
                                <h1>Fin Flow Guard</h1>
                                <p>AI Financial Security</p>
                            </div>
                        </div>

                        <form className="login_form" onSubmit={handleLogin}>
                            <label>
                                <span>은행 코드</span>
                                <input
                                    type="text"
                                    name="bankCode"
                                    placeholder="예: 00"
                                    value={bankCode}
                                    onChange={(e) => setBankCode(e.target.value)}
                                    required
                                />
                            </label>

                            <label>
                                <span>아이디</span>
                                <input
                                    type="text"
                                    name="username"
                                    placeholder="아이디를 입력하세요"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </label>

                            <label>
                                <span>비밀번호</span>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    name="password"
                                    placeholder="비밀번호를 입력하세요"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </label>

                            <div className="options">
                                <label className="checkbox">
                                    <input
                                        type="checkbox"
                                        checked={keepLogin}
                                        onChange={(e) => setKeepLogin(e.target.checked)}
                                    />
                                    로그인 유지
                                </label>

                                <label className="checkbox">
                                    <input
                                        type="checkbox"
                                        checked={showPassword}
                                        onChange={(e) => setShowPassword(e.target.checked)}
                                    />
                                    비밀번호 보기
                                </label>
                            </div>

                            <button type="submit" className="login_btn">
                                로그인
                            </button>

                            {errorMessage && (
                                <div className="error-message">{errorMessage}</div>
                            )}

                            <div className="login_footer">
                                <span>접속 문제가 있나요?</span>
                                <button
                                    type="button"
                                    className="support_btn"
                                    onClick={() => setIsSupportModalOpen(true)}
                                >
                                    지원센터
                                </button>
                            </div>
                        </form>
                    </div>

                    {isSupportModalOpen && (
                        <div className="support_modal" onClick={closeModalOnBackdrop}>
                            <div className="support_modal_content">
                                <h3>지원센터 문의</h3>

                                <form onSubmit={handleSupportSubmit}>
                <textarea
                    name="message"
                    placeholder="로그인 문제를 입력해주세요"
                    value={supportMessage}
                    onChange={(e) => setSupportMessage(e.target.value)}
                    required
                ></textarea>

                                    <div className="support_buttons">
                                        <button type="submit">문의 보내기</button>
                                        <button
                                            type="button"
                                            onClick={() => setIsSupportModalOpen(false)}
                                        >
                                            취소
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default LoginPage;