import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboardPage.css";
import { createMember } from "../services/memberApi";

function AdminDashboardPage() {
    const navigate = useNavigate();
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);

    const memberId = localStorage.getItem("memberId") || "";
    const bankCode = localStorage.getItem("bankCode") || "";

    const userBankName = useMemo(() => {
        if (bankCode === "01") return "관리자";
        if (bankCode === "02") return "하나은행";
        if (bankCode === "03") return "우리은행";
        if (bankCode === "04") return "카카오뱅크";
        return "등록은행X";
    }, [bankCode]);

    const summaryCards = [
        { title: "총 이상 거래 탐지 건수", value: "152건" },
        { title: "이메일 대응 건수", value: "34건" },
        { title: "전화 대응 건수", value: "51건" },
        { title: "거래차단 대응 건수", value: "67건" },
    ];

    const suspiciousData = [
        { bankName: "KB 국민은행", detectedCount: "86건", highRiskRate: "18%", avgRiskScore: "47점" },
        { bankName: "하나은행", detectedCount: "64건", highRiskRate: "15%", avgRiskScore: "42점" },
        { bankName: "새마을금고", detectedCount: "132건", highRiskRate: "31%", avgRiskScore: "61점" },
        { bankName: "토스뱅크", detectedCount: "55건", highRiskRate: "21%", avgRiskScore: "49점" },
        { bankName: "기업은행", detectedCount: "72건", highRiskRate: "19%", avgRiskScore: "46점" },
        { bankName: "우리은행", detectedCount: "68건", highRiskRate: "17%", avgRiskScore: "44점" },
    ];

    const patternList = [
        { level: "high", text: "[고위험] 반복 로그인 실패 후 성공", count: "48건", risk: 91 },
        { level: "high", text: "[고위험] 단시간 다계좌 이체", count: "37건", risk: 84 },
        { level: "high", text: "[고위험] 해외 IP 로그인 후 고액 이체", count: "29건", risk: 79 },

        { level: "mid", text: "[중위험] 해외 로그인", count: "23건", risk: 56 },
        { level: "mid", text: "[중위험] 새벽 고액 출금", count: "19건", risk: 52 },
        { level: "mid", text: "[중위험] 동일 IP 다수 계정 로그인", count: "16건", risk: 47 },

        { level: "low", text: "[저위험] 신규 수취인 고액 이체", count: "11건", risk: 26 },
        { level: "low", text: "[저위험] 단시간 소액 반복 결제", count: "9건", risk: 22 }
    ];

    const hourlyBars = [
        { hour: "00", count: 3, percent: 5 },
        { hour: "04", count: 4, percent: 7 },
        { hour: "08", count: 9, percent: 15 },
        { hour: "12", count: 12, percent: 20 },
        { hour: "16", count: 18, percent: 30 },
        { hour: "20", count: 14, percent: 23 },
    ];

    const handleMoveTxInput = () => {
        navigate("/admin/tx-input");
    };

    const handleSubmitUserAdd = async (e) => {
        e.preventDefault();

        console.log("전송 데이터:", memberForm);

        try {
            const result = await createMember(memberForm);
            console.log("사용자 추가 응답:", result);

            alert(result.message);

            if (result.success) {
                setIsUserModalOpen(false);
                setMemberForm({
                    memberId: "",
                    pwd: "",
                    role: "bank",
                    bankCode: ""
                });
            }
        } catch (error) {
            console.error("사용자 추가 에러:", error);
            alert(error.message || "사용자 추가 중 오류가 발생했습니다.");
        }
    };

    const [memberForm, setMemberForm] = useState({
        memberId: "",
        pwd: "",
        role: "bank",
        bankCode: ""
    });

    const handleChangeMemberForm = (e) => {
        const { name, value } = e.target;

        setMemberForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    return (
        <div className="main_admin_page">
            <div className="main_admin_header">
                <div className="main_admin_header_left">
                    <h2>FFG</h2>

                    <div className="user_info header_user_info">
                        <span className="user_info_id">{memberId}</span>
                        <span className="user_info_bank">{userBankName}</span>
                    </div>
                </div>

                <div className="main_admin_header_right">
                    <button
                        type="button"
                        className="tx_data_input header_action_btn"
                        onClick={handleMoveTxInput}
                    >
                        <strong>+</strong> 거래 데이터 입력
                    </button>

                    <button
                        type="button"
                        className="user_add_btn"
                        onClick={() => setIsUserModalOpen(true)}
                    >
                        <strong>+</strong> 사용자 추가
                    </button>
                </div>
            </div>

            <div className="error_wrapper">
                {summaryCards.map((card) => (
                    <div className="error_box" key={card.title}>
                        <h3>{card.title}</h3>
                        <span className="error_cnt">{card.value}</span>
                    </div>
                ))}
            </div>

            <div className="data_box">
                <div className="graph_box">
                    <div className="graph">
                        <h3>시간대별 이상거래</h3>
                        <div className="chart_wrap chart_bar">
                            <div className="bars">
                                {hourlyBars.map((item) => (
                                    <div
                                        key={item.hour}
                                        className="bar"
                                        style={{ "--v": item.percent }}
                                    >
                                        <span className="count">{item.count}</span>
                                        <span className="label">{item.hour}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="graph">
                        <h3>월별 보안 프로파일링 분석 추이</h3>
                        <div className="chart_wrap chart_line">
                            <div className="line_placeholder">
                                Chart.js 연결 예정
                            </div>
                        </div>
                    </div>
                </div>

                <div className="report_box">
                    <div className="report">
                        <h3>거래 이상 의심 데이터</h3>
                        <table>
                            <thead>
                            <tr>
                                <th>기관명</th>
                                <th>금일탐지건수</th>
                                <th>고위험비율</th>
                                <th>평균<br />리스크점수</th>
                            </tr>
                            </thead>
                            <tbody>
                            {suspiciousData.map((item) => (
                                <tr key={item.bankName}>
                                    <td>{item.bankName}</td>
                                    <td>{item.detectedCount}</td>
                                    <td>{item.highRiskRate}</td>
                                    <td>{item.avgRiskScore}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    <div className="report">
                        <h3>AI 이상징후 패턴 탐지 결과</h3>

                        <ul className="pattern_list">
                            {patternList.map((item) => (
                                <li
                                    key={`${item.level}-${item.text}`}
                                    className={`pattern_row risk_${item.level}`}
                                >
                                    <div className="left">
                                        <span className="dot"></span>
                                        {item.text}
                                    </div>

                                    <div className="right">
                                        <span className="count">{item.count}</span>
                                        <span className="sep">|</span>
                                        <span className="risk_text">위험도</span>
                                        <span
                                            className="risk_meter"
                                            style={{ "--pct": `${item.risk}%` }}
                                            aria-label={`위험도 ${item.risk}%`}
                                        ></span>
                                    </div>
                                </li>
                            ))}
                        </ul>

                        <div className="report_footer">
                            <span className="live_dot" aria-hidden="true"></span>
                            <span className="report_footer_text">
                                최근 1시간 내 고위험 패턴 2건 추가 발생
                            </span>
                            <span className="report_footer_time">업데이트 14:32</span>
                        </div>
                    </div>
                </div>
            </div>

            {isUserModalOpen && (
                <div className="user_add_modal_overlay">
                    <div className="user_add_modal">
                        <div className="user_add_modal_header">
                            <h3>사용자 추가</h3>
                            <button
                                type="button"
                                className="user_add_close"
                                onClick={() => setIsUserModalOpen(false)}
                            >
                                &times;
                            </button>
                        </div>

                        <form className="user_add_form" onSubmit={handleSubmitUserAdd}>
                            <input
                                type="text"
                                name="memberId"
                                placeholder="아이디"
                                value={memberForm.memberId}
                                onChange={handleChangeMemberForm}
                                required
                            />

                            <input
                                type="password"
                                name="pwd"
                                placeholder="비밀번호"
                                value={memberForm.pwd}
                                onChange={handleChangeMemberForm}
                                required
                            />

                            <input
                                type="text"
                                name="bankCode"
                                placeholder="은행코드"
                                value={memberForm.bankCode}
                                onChange={handleChangeMemberForm}
                                required
                            />

                            <select
                                name="role"
                                value={memberForm.role}
                                onChange={handleChangeMemberForm}
                                required
                            >
                                <option value="admin">관리자</option>
                                <option value="bank">은행관리자</option>
                            </select>

                            <button type="submit">추가</button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}

export default AdminDashboardPage;