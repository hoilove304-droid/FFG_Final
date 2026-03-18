import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../styles/BankDashboardPage.css";

function BankDashboardPage() {
    const navigate = useNavigate();
    const { bankCode: routeBankCode } = useParams();

    const role = localStorage.getItem("role") || "";
    const memberId = localStorage.getItem("memberId") || "";
    const loginBankCode = localStorage.getItem("bankCode") || "";

    const selectedBankCode = useMemo(() => {
        if (role === "admin") {
            return routeBankCode || "02";
        }
        return loginBankCode || routeBankCode || "02";
    }, [role, routeBankCode, loginBankCode]);

    const [fraudRows, setFraudRows] = useState([]);

    const selectedBankName = useMemo(() => {
        switch (selectedBankCode) {
            case "01":
                return "관리자";
            case "02":
                return "하나은행";
            case "03":
                return "우리은행";
            case "04":
                return "카카오뱅크";
            case "05":
                return "국민은행";
            case "06":
                return "토스뱅크";
            case "07":
                return "MG새마을금고";
            case "08":
                return "IBK기업은행";
            case "09":
                return "신한은행";
            default:
                return "등록은행X";
        }
    }, [selectedBankCode]);

    useEffect(() => {
        fetch(`http://localhost:8080/api/dashboard/${selectedBankCode}`)
            .then((res) => {
                if (!res.ok) {
                    throw new Error("대시보드 API 호출 실패");
                }
                return res.json();
            })
            .then((data) => {
                console.log("dashboard data:", data);
                setFraudRows(data.fraudRows || []);
            })
            .catch((err) => {
                console.error("dashboard load error:", err);
                setFraudRows([]);
            });
    }, [selectedBankCode]);

    const loginDisplayName = role === "admin" ? "관리자" : selectedBankName;
    const loginDisplayBankCode = role === "admin" ? "-" : loginBankCode;

    const handleBankChange = (e) => {
        const nextBankCode = e.target.value;
        navigate(`/bank/${nextBankCode}`);
    };

    const bankDashboardData = {
        "02": {
            summaryCards: [
                { title: "일간 전체 거래수", value: 128 },
                { title: "일간 이상거래 탐지 건수", value: 17 },
                { title: "대응 거래 건수", value: 15 },
                { title: "수동 검토 대기 건수", value: 5 },
            ],
            hourlyBars: [
                { hour: "00", count: 2, percent: 18 },
                { hour: "04", count: 1, percent: 10 },
                { hour: "08", count: 4, percent: 36 },
                { hour: "12", count: 6, percent: 58 },
                { hour: "16", count: 3, percent: 28 },
                { hour: "20", count: 5, percent: 48 },
            ],
            monthlyTrend: [
                { month: "1월", value: 8 },
                { month: "2월", value: 12 },
                { month: "3월", value: 10 },
                { month: "4월", value: 16 },
                { month: "5월", value: 14 },
                { month: "6월", value: 18 },
            ],
            responseStatus: [
                { label: "이메일", value: 10 },
                { label: "전화", value: 3 },
                { label: "거래차단", value: 2 },
                { label: "검토대기", value: 5 },
            ],
            fraudRows: [
                {
                    txId: 1111111111,
                    userId: "2001",
                    name: "김민지",
                    pattern: "거래시간 이상",
                    fraudScore: 82.5,
                    txDatetime: "2026-03-16 09:20",
                    responseDatetime: "2026-03-16 09:21",
                    responseTime: "1분",
                    action: "이메일 전송",
                },
                {
                    txId: 1111111112,
                    userId: "2002",
                    name: "서인국",
                    pattern: "해외 접속 의심",
                    fraudScore: 91.2,
                    txDatetime: "2026-03-16 10:05",
                    responseDatetime: "2026-03-16 10:08",
                    responseTime: "3분",
                    action: "전화 안내",
                },
                {
                    txId: 1111111113,
                    userId: "2003",
                    name: "이지민",
                    pattern: "고액 이체",
                    fraudScore: 88.4,
                    txDatetime: "2026-03-16 10:42",
                    responseDatetime: "2026-03-16 10:45",
                    responseTime: "3분",
                    action: "거래 차단",
                },
            ],
        },

        "03": {
            summaryCards: [
                { title: "일간 전체 거래수", value: 146 },
                { title: "일간 이상거래 탐지 건수", value: 21 },
                { title: "대응 거래 건수", value: 18 },
                { title: "수동 검토 대기 건수", value: 7 },
            ],
            hourlyBars: [
                { hour: "00", count: 1, percent: 8 },
                { hour: "04", count: 3, percent: 24 },
                { hour: "08", count: 5, percent: 40 },
                { hour: "12", count: 4, percent: 32 },
                { hour: "16", count: 6, percent: 52 },
                { hour: "20", count: 2, percent: 16 },
            ],
            monthlyTrend: [
                { month: "1월", value: 10 },
                { month: "2월", value: 9 },
                { month: "3월", value: 14 },
                { month: "4월", value: 13 },
                { month: "5월", value: 17 },
                { month: "6월", value: 19 },
            ],
            responseStatus: [
                { label: "이메일", value: 8 },
                { label: "전화", value: 6 },
                { label: "거래차단", value: 4 },
                { label: "검토대기", value: 7 },
            ],
            fraudRows: [
                {
                    txId: 2222222201,
                    userId: "3001",
                    name: "박서준",
                    pattern: "해외 접속 의심",
                    fraudScore: 85.3,
                    txDatetime: "2026-03-16 08:10",
                    responseDatetime: "2026-03-16 08:13",
                    responseTime: "3분",
                    action: "전화 안내",
                },
                {
                    txId: 2222222202,
                    userId: "3002",
                    name: "정유미",
                    pattern: "신규 디바이스 로그인",
                    fraudScore: 77.1,
                    txDatetime: "2026-03-16 11:24",
                    responseDatetime: "2026-03-16 11:28",
                    responseTime: "4분",
                    action: "이메일 전송",
                },
                {
                    txId: 2222222203,
                    userId: "3003",
                    name: "이도현",
                    pattern: "고액 출금",
                    fraudScore: 93.4,
                    txDatetime: "2026-03-16 14:50",
                    responseDatetime: "2026-03-16 14:52",
                    responseTime: "2분",
                    action: "거래 차단",
                },
            ],
        },

        "04": {
            summaryCards: [
                { title: "일간 전체 거래수", value: 173 },
                { title: "일간 이상거래 탐지 건수", value: 26 },
                { title: "대응 거래 건수", value: 20 },
                { title: "수동 검토 대기 건수", value: 9 },
            ],
            hourlyBars: [
                { hour: "00", count: 4, percent: 28 },
                { hour: "04", count: 2, percent: 14 },
                { hour: "08", count: 3, percent: 22 },
                { hour: "12", count: 7, percent: 58 },
                { hour: "16", count: 5, percent: 40 },
                { hour: "20", count: 6, percent: 50 },
            ],
            monthlyTrend: [
                { month: "1월", value: 7 },
                { month: "2월", value: 11 },
                { month: "3월", value: 13 },
                { month: "4월", value: 18 },
                { month: "5월", value: 16 },
                { month: "6월", value: 21 },
            ],
            responseStatus: [
                { label: "이메일", value: 11 },
                { label: "전화", value: 5 },
                { label: "거래차단", value: 4 },
                { label: "검토대기", value: 9 },
            ],
            fraudRows: [
                {
                    txId: 3333333301,
                    userId: "4001",
                    name: "최수빈",
                    pattern: "반복 로그인 실패 후 성공",
                    fraudScore: 89.6,
                    txDatetime: "2026-03-16 07:42",
                    responseDatetime: "2026-03-16 07:45",
                    responseTime: "3분",
                    action: "이메일 전송",
                },
                {
                    txId: 3333333302,
                    userId: "4002",
                    name: "한지민",
                    pattern: "해외 고액 결제",
                    fraudScore: 95.2,
                    txDatetime: "2026-03-16 13:18",
                    responseDatetime: "2026-03-16 13:20",
                    responseTime: "2분",
                    action: "거래 차단",
                },
                {
                    txId: 3333333303,
                    userId: "4003",
                    name: "류준열",
                    pattern: "단시간 다수 이체",
                    fraudScore: 83.8,
                    txDatetime: "2026-03-16 19:05",
                    responseDatetime: "2026-03-16 19:09",
                    responseTime: "4분",
                    action: "전화 안내",
                },
            ],
        },

        "05": {
            summaryCards: [
                { title: "일간 전체 거래수", value: 158 },
                { title: "일간 이상거래 탐지 건수", value: 19 },
                { title: "대응 거래 건수", value: 16 },
                { title: "수동 검토 대기 건수", value: 4 },
            ],
            hourlyBars: [
                { hour: "00", count: 2, percent: 16 },
                { hour: "04", count: 1, percent: 10 },
                { hour: "08", count: 5, percent: 42 },
                { hour: "12", count: 6, percent: 54 },
                { hour: "16", count: 4, percent: 32 },
                { hour: "20", count: 3, percent: 24 },
            ],
            monthlyTrend: [
                { month: "1월", value: 9 },
                { month: "2월", value: 11 },
                { month: "3월", value: 13 },
                { month: "4월", value: 15 },
                { month: "5월", value: 14 },
                { month: "6월", value: 17 },
            ],
            responseStatus: [
                { label: "이메일", value: 9 },
                { label: "전화", value: 4 },
                { label: "거래차단", value: 3 },
                { label: "검토대기", value: 4 },
            ],
        },

        "06": {
            summaryCards: [
                { title: "일간 전체 거래수", value: 142 },
                { title: "일간 이상거래 탐지 건수", value: 23 },
                { title: "대응 거래 건수", value: 19 },
                { title: "수동 검토 대기 건수", value: 6 },
            ],
            hourlyBars: [
                { hour: "00", count: 3, percent: 20 },
                { hour: "04", count: 2, percent: 14 },
                { hour: "08", count: 4, percent: 30 },
                { hour: "12", count: 5, percent: 40 },
                { hour: "16", count: 6, percent: 50 },
                { hour: "20", count: 3, percent: 25 },
            ],
            monthlyTrend: [
                { month: "1월", value: 11 },
                { month: "2월", value: 13 },
                { month: "3월", value: 15 },
                { month: "4월", value: 14 },
                { month: "5월", value: 18 },
                { month: "6월", value: 20 },
            ],
            responseStatus: [
                { label: "이메일", value: 10 },
                { label: "전화", value: 5 },
                { label: "거래차단", value: 4 },
                { label: "검토대기", value: 6 },
            ],
        },

        "07": {
            summaryCards: [
                { title: "일간 전체 거래수", value: 167 },
                { title: "일간 이상거래 탐지 건수", value: 25 },
                { title: "대응 거래 건수", value: 21 },
                { title: "수동 검토 대기 건수", value: 7 },
            ],
            hourlyBars: [
                { hour: "00", count: 2, percent: 14 },
                { hour: "04", count: 3, percent: 20 },
                { hour: "08", count: 5, percent: 34 },
                { hour: "12", count: 7, percent: 52 },
                { hour: "16", count: 4, percent: 30 },
                { hour: "20", count: 6, percent: 46 },
            ],
            monthlyTrend: [
                { month: "1월", value: 10 },
                { month: "2월", value: 12 },
                { month: "3월", value: 14 },
                { month: "4월", value: 17 },
                { month: "5월", value: 16 },
                { month: "6월", value: 19 },
            ],
            responseStatus: [
                { label: "이메일", value: 12 },
                { label: "전화", value: 6 },
                { label: "거래차단", value: 3 },
                { label: "검토대기", value: 7 },
            ],
        },

        "08": {
            summaryCards: [
                { title: "일간 전체 거래수", value: 189 },
                { title: "일간 이상거래 탐지 건수", value: 28 },
                { title: "대응 거래 건수", value: 24 },
                { title: "수동 검토 대기 건수", value: 8 },
            ],
            hourlyBars: [
                { hour: "00", count: 4, percent: 28 },
                { hour: "04", count: 2, percent: 16 },
                { hour: "08", count: 6, percent: 44 },
                { hour: "12", count: 8, percent: 60 },
                { hour: "16", count: 5, percent: 36 },
                { hour: "20", count: 7, percent: 52 },
            ],
            monthlyTrend: [
                { month: "1월", value: 12 },
                { month: "2월", value: 14 },
                { month: "3월", value: 16 },
                { month: "4월", value: 18 },
                { month: "5월", value: 17 },
                { month: "6월", value: 21 },
            ],
            responseStatus: [
                { label: "이메일", value: 13 },
                { label: "전화", value: 5 },
                { label: "거래차단", value: 6 },
                { label: "검토대기", value: 8 },
            ],
        },

        "09": {
            summaryCards: [
                { title: "일간 전체 거래수", value: 175 },
                { title: "일간 이상거래 탐지 건수", value: 22 },
                { title: "대응 거래 건수", value: 18 },
                { title: "수동 검토 대기 건수", value: 5 },
            ],
            hourlyBars: [
                { hour: "00", count: 3, percent: 22 },
                { hour: "04", count: 2, percent: 16 },
                { hour: "08", count: 4, percent: 30 },
                { hour: "12", count: 6, percent: 48 },
                { hour: "16", count: 5, percent: 36 },
                { hour: "20", count: 4, percent: 32 },
            ],
            monthlyTrend: [
                { month: "1월", value: 11 },
                { month: "2월", value: 13 },
                { month: "3월", value: 12 },
                { month: "4월", value: 15 },
                { month: "5월", value: 14 },
                { month: "6월", value: 18 },
            ],
            responseStatus: [
                { label: "이메일", value: 9 },
                { label: "전화", value: 4 },
                { label: "거래차단", value: 5 },
                { label: "검토대기", value: 5 },
            ],
        },
    };

    const currentData = bankDashboardData[selectedBankCode] || bankDashboardData["02"];

    return (
        <div className="bank-dashboard-page">
            <div className="bank_info">
                <span>{loginDisplayName}</span>
                <span>|</span>
                <span>은행코드: {loginDisplayBankCode}</span>
                <span>|</span>
                <span>{role === "admin" ? "admin" : `${selectedBankName} 대시보드`}</span>

                <div className="user_info header_user_info">
                    <span className="user_info_id">{memberId}</span>
                    <span className="user_info_bank">{loginDisplayName}</span>
                </div>
            </div>

            {role === "admin" && (
                <div className="customerList_box">
                    <select value={selectedBankCode} onChange={handleBankChange}>
                        <option value="02">하나은행</option>
                        <option value="03">우리은행</option>
                        <option value="04">카카오뱅크</option>
                        <option value="05">국민은행</option>
                        <option value="06">토스뱅크</option>
                        <option value="07">MG새마을금고</option>
                        <option value="08">IBK기업은행</option>
                        <option value="09">신한은행</option>
                    </select>
                </div>
            )}

            <div className="error_wrapper_bank">
                {currentData.summaryCards.map((card) => (
                    <div className="error_box_bank" key={card.title}>
                        <h3>{card.title}</h3>
                        <span className="error_cnt_bank">{card.value}</span>
                    </div>
                ))}
            </div>

            <div className="data_box_bank">
                <div className="graph_box_bank">
                    <div className="graph_bank">
                        <h3>시간대별 이상거래 그래프</h3>
                        <div className="chart_wrap_bank chart_bar_bank">
                            <div className="bars_bank">
                                {currentData.hourlyBars.map((item) => (
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

                    <div className="graph_bank">
                        <h3>월별 보안 프로파일링 분석 추이률 그래프</h3>
                        <div className="chart_wrap_bank chart_line">
                            <div className="line_area">
                                {currentData.monthlyTrend.map((item, idx) => {
                                    const left =
                                        currentData.monthlyTrend.length === 1
                                            ? 50
                                            : (idx / (currentData.monthlyTrend.length - 1)) * 100;
                                    const bottom = item.value * 4;

                                    return (
                                        <div
                                            key={item.month}
                                            className="dot"
                                            style={{
                                                left: `${left}%`,
                                                bottom: `${bottom}px`,
                                            }}
                                            title={`${item.month} ${item.value}%`}
                                        />
                                    );
                                })}

                                <div className="x_labels">
                                    {currentData.monthlyTrend.map((item) => (
                                        <span key={item.month}>{item.month}</span>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="report_box_bank">
                    <div className="report_bank">
                        <h3>대응 현황</h3>
                        <table>
                            <tbody>
                            {currentData.responseStatus.map((item) => (
                                <tr key={item.label}>
                                    <td>{item.label}:</td>
                                    <td>{item.value}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            <div className="dataList_box">
                <div className="dataList">
                    <table>
                        <thead>
                        <tr>
                            <th>거래 ID</th>
                            <th>고객 ID</th>
                            <th>고객명</th>
                            <th>이상거래 패턴</th>
                            <th>위험도 점수</th>
                            <th>거래 발생 시간</th>
                            <th>대응 시간</th>
                            <th>대응 소요 시간</th>
                            <th>대응 처리 방법</th>
                        </tr>
                        </thead>
                        <tbody>
                        {fraudRows.length > 0 ? (
                            fraudRows.map((item) => {
                                const actions = ["이메일 전송", "전화 안내", "거래 차단"];
                                const txKey = Number(item.txId || 0);
                                const action = actions[txKey % actions.length];
                                const minutes = (txKey % 5) + 1;

                                return (
                                    <tr
                                        key={item.txId}
                                        onDoubleClick={() =>
                                            navigate(`/bank/${selectedBankCode}/customer/${item.userId}/tx/${item.txId}`)
                                        }
                                        style={{ cursor: "pointer" }}
                                    >
                                        <td>{item.txId}</td>
                                        <td>{item.userId}</td>
                                        <td>{item.name}</td>
                                        <td>{item.patternText}</td>
                                        <td>{item.fraudScore}</td>
                                        <td>{item.txDatetime}</td>
                                        <td>{item.txDatetime}</td>
                                        <td>{minutes}분</td>
                                        <td>{action}</td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="9">데이터가 없습니다.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default BankDashboardPage;