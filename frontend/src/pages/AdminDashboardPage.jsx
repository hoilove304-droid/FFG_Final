import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/AdminDashboardPage.css";
import { createMember } from "../services/memberApi";

const AI_URL = import.meta.env.VITE_AI_URL || "http://localhost:5000";
const POLL_INTERVAL_MS = 30_000;

// ── 패턴별 대표 샘플 시나리오 ────────────────────────────────
// baseCount: AI 위험도에 따라 최종 건수를 산출할 기준값
const SAMPLE_SCENARIOS = [
    {
        label: "[고위험] 반복 로그인 실패 후 성공", level: "high", baseCount: 48,
        payload: { txChannel: "WEB", txType: "TRANSFER", txAmount: 9800000, txDatetime: "2026-03-19T03:15", txCountry: "CN", txLocation: "베이징", deviceType: "PC", deviceOs: "Linux" },
    },
    {
        label: "[고위험] 단시간 다계좌 이체", level: "high", baseCount: 37,
        payload: { txChannel: "APP", txType: "TRANSFER", txAmount: 4500000, txDatetime: "2026-03-19T02:40", txCountry: "KR", txLocation: "서울", deviceType: "MOBILE", deviceOs: "Android" },
    },
    {
        label: "[고위험] 해외 IP 로그인 후 고액 이체", level: "high", baseCount: 29,
        payload: { txChannel: "WEB", txType: "TRANSFER", txAmount: 12000000, txDatetime: "2026-03-19T23:55", txCountry: "RU", txLocation: "모스크바", deviceType: "PC", deviceOs: "Windows" },
    },
    {
        label: "[중위험] 해외 로그인", level: "mid", baseCount: 23,
        payload: { txChannel: "WEB", txType: "PAYMENT", txAmount: 320000, txDatetime: "2026-03-19T14:20", txCountry: "US", txLocation: "뉴욕", deviceType: "PC", deviceOs: "MacOS" },
    },
    {
        label: "[중위험] 새벽 고액 출금", level: "mid", baseCount: 19,
        payload: { txChannel: "ATM", txType: "WITHDRAW", txAmount: 2900000, txDatetime: "2026-03-19T04:10", txCountry: "KR", txLocation: "인천", deviceType: "ATM", deviceOs: "Windows" },
    },
    {
        label: "[중위험] 동일 IP 다수 계정 로그인", level: "mid", baseCount: 16,
        payload: { txChannel: "WEB", txType: "TRANSFER", txAmount: 850000, txDatetime: "2026-03-19T11:30", txCountry: "KR", txLocation: "부산", deviceType: "PC", deviceOs: "Windows" },
    },
    {
        label: "[저위험] 신규 수취인 고액 이체", level: "low", baseCount: 11,
        payload: { txChannel: "APP", txType: "TRANSFER", txAmount: 1500000, txDatetime: "2026-03-19T16:00", txCountry: "KR", txLocation: "대전", deviceType: "MOBILE", deviceOs: "iOS" },
    },
    {
        label: "[저위험] 단시간 소액 반복 결제", level: "low", baseCount: 9,
        payload: { txChannel: "APP", txType: "PAYMENT", txAmount: 15000, txDatetime: "2026-03-19T13:45", txCountry: "KR", txLocation: "서울", deviceType: "MOBILE", deviceOs: "Android" },
    },
];

// ── 시간대별 샘플 ─────────────────────────────────────────────
const HOURLY_SCENARIOS = [
    { hour: "00", payload: { txChannel: "WEB", txType: "TRANSFER", txAmount: 8500000, txDatetime: "2026-03-19T00:30", txCountry: "CN", txLocation: "베이징", deviceType: "PC", deviceOs: "Windows" } },
    { hour: "04", payload: { txChannel: "ATM", txType: "WITHDRAW", txAmount: 3000000, txDatetime: "2026-03-19T04:20", txCountry: "KR", txLocation: "서울", deviceType: "ATM", deviceOs: "Windows" } },
    { hour: "08", payload: { txChannel: "APP", txType: "PAYMENT", txAmount: 250000, txDatetime: "2026-03-19T08:10", txCountry: "KR", txLocation: "서울", deviceType: "MOBILE", deviceOs: "iOS" } },
    { hour: "12", payload: { txChannel: "WEB", txType: "TRANSFER", txAmount: 1200000, txDatetime: "2026-03-19T12:05", txCountry: "KR", txLocation: "부산", deviceType: "PC", deviceOs: "MacOS" } },
    { hour: "16", payload: { txChannel: "APP", txType: "TRANSFER", txAmount: 4700000, txDatetime: "2026-03-19T16:45", txCountry: "US", txLocation: "뉴욕", deviceType: "MOBILE", deviceOs: "Android" } },
    { hour: "20", payload: { txChannel: "WEB", txType: "WITHDRAW", txAmount: 5800000, txDatetime: "2026-03-19T20:30", txCountry: "RU", txLocation: "모스크바", deviceType: "PC", deviceOs: "Linux" } },
];

// ── 월별 샘플 ────────────────────────────────────────────────
const MONTHLY_SCENARIOS = [
    { month: "1월", payload: { txChannel: "WEB", txType: "TRANSFER", txAmount: 3200000, txDatetime: "2026-01-15T10:00", txCountry: "KR", txLocation: "서울", deviceType: "PC", deviceOs: "Windows" } },
    { month: "2월", payload: { txChannel: "APP", txType: "TRANSFER", txAmount: 4100000, txDatetime: "2026-02-10T14:30", txCountry: "CN", txLocation: "베이징", deviceType: "MOBILE", deviceOs: "Android" } },
    { month: "3월", payload: { txChannel: "WEB", txType: "PAYMENT", txAmount: 5500000, txDatetime: "2026-03-08T02:15", txCountry: "RU", txLocation: "모스크바", deviceType: "PC", deviceOs: "Linux" } },
    { month: "4월", payload: { txChannel: "ATM", txType: "WITHDRAW", txAmount: 2800000, txDatetime: "2026-04-20T22:00", txCountry: "KR", txLocation: "인천", deviceType: "ATM", deviceOs: "Windows" } },
    { month: "5월", payload: { txChannel: "APP", txType: "TRANSFER", txAmount: 7200000, txDatetime: "2026-05-12T03:40", txCountry: "US", txLocation: "뉴욕", deviceType: "MOBILE", deviceOs: "iOS" } },
    { month: "6월", payload: { txChannel: "WEB", txType: "TRANSFER", txAmount: 9100000, txDatetime: "2026-06-05T01:20", txCountry: "CN", txLocation: "상하이", deviceType: "PC", deviceOs: "Windows" } },
];

// ── 은행별 샘플 (거래 이상 의심 데이터 테이블용) ───────────────
const BANK_SCENARIOS = [
    { bankName: "KB 국민은행",  payload: { txChannel: "WEB", txType: "TRANSFER", txAmount: 8600000, txDatetime: "2026-03-19T02:10", txCountry: "CN", txLocation: "베이징",  deviceType: "PC",     deviceOs: "Windows" } },
    { bankName: "하나은행",     payload: { txChannel: "APP", txType: "TRANSFER", txAmount: 6400000, txDatetime: "2026-03-19T03:40", txCountry: "RU", txLocation: "모스크바", deviceType: "MOBILE", deviceOs: "Android" } },
    { bankName: "새마을금고",   payload: { txChannel: "WEB", txType: "WITHDRAW", txAmount: 13200000, txDatetime: "2026-03-19T01:05", txCountry: "CN", txLocation: "상하이",  deviceType: "PC",     deviceOs: "Linux"   } },
    { bankName: "토스뱅크",    payload: { txChannel: "APP", txType: "PAYMENT",  txAmount: 5500000, txDatetime: "2026-03-19T22:50", txCountry: "US", txLocation: "뉴욕",    deviceType: "MOBILE", deviceOs: "iOS"     } },
    { bankName: "기업은행",    payload: { txChannel: "WEB", txType: "TRANSFER", txAmount: 7200000, txDatetime: "2026-03-19T04:30", txCountry: "KR", txLocation: "인천",    deviceType: "PC",     deviceOs: "Windows" } },
    { bankName: "우리은행",    payload: { txChannel: "ATM", txType: "WITHDRAW", txAmount: 6800000, txDatetime: "2026-03-19T03:15", txCountry: "KR", txLocation: "서울",    deviceType: "ATM",    deviceOs: "Windows" } },
];

async function callPredict(payload) {
    const res = await fetch(`${AI_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("AI 서버 응답 오류");
    const data = await res.json();
    if (!data.success) throw new Error(data.error || "AI 분석 실패");
    return data;
}

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

    // ── AI 상태 ──────────────────────────────────────────────
    const [aiStatus, setAiStatus]           = useState("idle");
    const [lastUpdated, setLastUpdated]     = useState(null);
    const [aiPatternList, setAiPatternList] = useState([]);
    const [aiSummaryCards, setAiSummaryCards] = useState(null);
    const [aiHourlyBars, setAiHourlyBars]   = useState([]);
    const [aiMonthlyTrend, setAiMonthlyTrend] = useState([]);
    const [aiBankRows, setAiBankRows]       = useState([]);
    const [selectedPattern, setSelectedPattern] = useState(null);
    const pollTimerRef = useRef(null);

    const runAiAnalysis = useCallback(async () => {
        setAiStatus("loading");
        try {
            // ── 1. 패턴별 결과 ─────────────────────────────
            const patternResults = await Promise.all(
                SAMPLE_SCENARIOS.map(async (s) => {
                    const r = await callPredict(s.payload);
                    // count: AI 위험도(fraudProbability)를 baseCount에 반영해 동적 산출
                    // 위험도가 높을수록 baseCount 기준으로 ±20% 범위 내 보정
                    const aiRatio  = r.fraudProbability / 100;
                    const aiCount  = Math.round(s.baseCount * (0.8 + aiRatio * 0.4));
                    return {
                        level:      s.level,
                        text:       s.label,
                        count:      `${aiCount}건`,
                        risk:       Math.round(r.fraudProbability),
                        isFraud:    r.isFraud,
                        shapImage:  r.shapImage,
                        shapDetail: r.shapDetail,
                    };
                })
            );
            setAiPatternList(patternResults);

            // ── 2. 요약 카드 (AI 결과 집계) ────────────────
            // 패턴별 위험도로 탐지 건수 비례 배분 (고위험일수록 많은 건수)
            const totalFraud       = patternResults.filter(p => p.isFraud === 1).length;
            const totalDetected    = patternResults.reduce((a, p) => a + Math.round(p.risk * 1.8), 0);
            const emailCount       = patternResults.filter(p => p.isFraud === 1 && p.level !== "low").length * 7 + 13;
            const callCount        = patternResults.filter(p => p.level === "high").length * 8 + 15;
            const blockCount       = patternResults.filter(p => p.isFraud === 1 && p.risk >= 70).length * 11 + 10;

            setAiSummaryCards([
                { title: "총 이상 거래 탐지 건수", value: `${totalDetected}건` },
                { title: "이메일 대응 건수",       value: `${emailCount}건`    },
                { title: "전화 대응 건수",         value: `${callCount}건`     },
                { title: "거래차단 대응 건수",     value: `${blockCount}건`    },
            ]);

            // ── 3. 시간대별 ────────────────────────────────
            const hourlyResults = await Promise.all(
                HOURLY_SCENARIOS.map(async (s) => {
                    const r = await callPredict(s.payload);
                    return {
                        hour:    s.hour,
                        count:   Math.round(r.fraudProbability / 7),
                        percent: Math.round(r.fraudProbability),
                    };
                })
            );
            setAiHourlyBars(hourlyResults);

            // ── 4. 월별 추이 ───────────────────────────────
            const monthlyResults = await Promise.all(
                MONTHLY_SCENARIOS.map(async (s) => {
                    const r = await callPredict(s.payload);
                    return {
                        month:   s.month,
                        value:   Math.round(r.fraudProbability),
                        isFraud: r.isFraud,
                    };
                })
            );
            setAiMonthlyTrend(monthlyResults);

            // ── 5. 은행별 의심 데이터 (AI 점수 반영) ────────
            const bankResults = await Promise.all(
                BANK_SCENARIOS.map(async (s) => {
                    const r = await callPredict(s.payload);
                    // detectedCount: 위험도 기반 산출
                    const detected      = Math.round(r.fraudProbability * 1.5);
                    // highRiskRate: fraudProbability 자체가 고위험 비율 근사값
                    const highRiskRate  = `${Math.round(r.fraudProbability * 0.35)}%`;
                    // avgRiskScore: fraudProbability * 0.85 → 점수화
                    const avgRiskScore  = `${Math.round(r.fraudProbability * 0.85)}점`;

                    return {
                        bankName:      s.bankName,
                        detectedCount: `${detected}건`,
                        highRiskRate,
                        avgRiskScore,
                        isFraud:       r.isFraud,
                    };
                })
            );
            setAiBankRows(bankResults);

            setAiStatus("ok");
            setLastUpdated(new Date());
        } catch (err) {
            console.error("AI 분석 오류:", err);
            setAiStatus("error");
        }
    }, []);

    useEffect(() => {
        runAiAnalysis();
        pollTimerRef.current = setInterval(runAiAnalysis, POLL_INTERVAL_MS);
        return () => { if (pollTimerRef.current) clearInterval(pollTimerRef.current); };
    }, [runAiAnalysis]);

    // ── 화면 데이터 (AI 결과 or fallback mock) ────────────────
    const summaryCards = aiSummaryCards || [
        { title: "총 이상 거래 탐지 건수", value: "152건" },
        { title: "이메일 대응 건수",       value: "34건"  },
        { title: "전화 대응 건수",         value: "51건"  },
        { title: "거래차단 대응 건수",     value: "67건"  },
    ];

    const patternList = aiPatternList.length > 0 ? aiPatternList : [
        { level: "high", text: "[고위험] 반복 로그인 실패 후 성공",     count: "48건", risk: 91 },
        { level: "high", text: "[고위험] 단시간 다계좌 이체",           count: "37건", risk: 84 },
        { level: "high", text: "[고위험] 해외 IP 로그인 후 고액 이체",  count: "29건", risk: 79 },
        { level: "mid",  text: "[중위험] 해외 로그인",                  count: "23건", risk: 56 },
        { level: "mid",  text: "[중위험] 새벽 고액 출금",               count: "19건", risk: 52 },
        { level: "mid",  text: "[중위험] 동일 IP 다수 계정 로그인",     count: "16건", risk: 47 },
        { level: "low",  text: "[저위험] 신규 수취인 고액 이체",        count: "11건", risk: 26 },
        { level: "low",  text: "[저위험] 단시간 소액 반복 결제",        count: "9건",  risk: 22 },
    ];

    const hourlyBars = aiHourlyBars.length > 0 ? aiHourlyBars : [
        { hour: "00", count: 3,  percent: 5  },
        { hour: "04", count: 4,  percent: 7  },
        { hour: "08", count: 9,  percent: 15 },
        { hour: "12", count: 12, percent: 20 },
        { hour: "16", count: 18, percent: 30 },
        { hour: "20", count: 14, percent: 23 },
    ];

    const suspiciousData = aiBankRows.length > 0 ? aiBankRows : [
        { bankName: "KB 국민은행", detectedCount: "86건",  highRiskRate: "18%", avgRiskScore: "47점" },
        { bankName: "하나은행",    detectedCount: "64건",  highRiskRate: "15%", avgRiskScore: "42점" },
        { bankName: "새마을금고",  detectedCount: "132건", highRiskRate: "31%", avgRiskScore: "61점" },
        { bankName: "토스뱅크",   detectedCount: "55건",  highRiskRate: "21%", avgRiskScore: "49점" },
        { bankName: "기업은행",   detectedCount: "72건",  highRiskRate: "19%", avgRiskScore: "46점" },
        { bankName: "우리은행",   detectedCount: "68건",  highRiskRate: "17%", avgRiskScore: "44점" },
    ];

    const monthlyTrend = aiMonthlyTrend;

    // ── 월별 SVG ────────────────────────────────────────────
    // viewBox를 크게 잡아야 width:100% 확대 시 텍스트가 작게 보임
    const chartW = 700, chartH = 160, padL = 36, padR = 20, padT = 28, padB = 36;
    const innerW = chartW - padL - padR;
    const innerH = chartH - padT - padB;

    const lineDots = useMemo(() => {
        if (monthlyTrend.length === 0) return [];
        const maxVal = Math.max(...monthlyTrend.map((d) => d.value), 1);
        return monthlyTrend.map((d, i) => {
            const x = padL + (monthlyTrend.length === 1 ? innerW / 2 : (i / (monthlyTrend.length - 1)) * innerW);
            const y = padT + innerH - (d.value / maxVal) * innerH;
            return { x, y, ...d };
        });
    }, [monthlyTrend, innerW, innerH]);

    const linePoints = lineDots.map((d) => `${d.x},${d.y}`).join(" ");

    const updatedTimeStr = lastUpdated
        ? `${String(lastUpdated.getHours()).padStart(2, "0")}:${String(lastUpdated.getMinutes()).padStart(2, "0")}`
        : "--:--";

    const newHighRiskCount = aiPatternList.length > 0
        ? aiPatternList.filter((p) => p.level === "high" && p.isFraud === 1).length
        : 2;

    // ── 폼 ──────────────────────────────────────────────────
    const [memberForm, setMemberForm] = useState({ memberId: "", pwd: "", role: "bank", bankCode: "" });

    const handleChangeMemberForm = (e) => {
        const { name, value } = e.target;
        setMemberForm((prev) => ({ ...prev, [name]: value }));
    };

    const handleMoveTxInput = () => navigate("/admin/tx-input");

    const handleSubmitUserAdd = async (e) => {
        e.preventDefault();
        try {
            const result = await createMember(memberForm);
            alert(result.message);
            if (result.success) {
                setIsUserModalOpen(false);
                setMemberForm({ memberId: "", pwd: "", role: "bank", bankCode: "" });
            }
        } catch (error) {
            alert(error.message || "사용자 추가 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className="main_admin_page">

            {/* ── 헤더 ── */}
            <div className="main_admin_header">
                <div className="main_admin_header_left">
                    <h2>FFG</h2>
                    <div className="user_info header_user_info">
                        <span className="user_info_id">{memberId}</span>
                        <span className="user_info_bank">{userBankName}</span>
                    </div>
                    <div className={`ai_status_badge ai_status_${aiStatus}`}>
                        {aiStatus === "loading" && <span className="ai_status_spinner"></span>}
                        {aiStatus === "ok"      && <span className="ai_status_dot"></span>}
                        {aiStatus === "error"   && <span className="ai_status_err_dot"></span>}
                        <span className="ai_status_label">
                            {aiStatus === "idle"    && "AI 대기"}
                            {aiStatus === "loading" && "AI 분석 중..."}
                            {aiStatus === "ok"      && `AI 연동 완료 · 갱신 ${updatedTimeStr}`}
                            {aiStatus === "error"   && "AI 서버 연결 실패"}
                        </span>
                        {aiStatus === "ok" && (
                            <button className="ai_refresh_btn" onClick={runAiAnalysis} title="지금 갱신">↻</button>
                        )}
                    </div>
                </div>

                <div className="main_admin_header_right">
                    <button type="button" className="tx_data_input header_action_btn" onClick={handleMoveTxInput}>
                        <strong>+</strong> 거래 데이터 입력
                    </button>
                    <button type="button" className="user_add_btn" onClick={() => setIsUserModalOpen(true)}>
                        <strong>+</strong> 사용자 추가
                    </button>
                </div>
            </div>

            {/* ── 요약 카드 (AI 집계) ── */}
            <div className="error_wrapper">
                {summaryCards.map((card) => (
                    <div className={`error_box${aiStatus === "loading" ? " error_box--loading" : ""}`} key={card.title}>
                        <h3>{card.title}</h3>
                        <span className="error_cnt">{card.value}</span>
                    </div>
                ))}
            </div>

            {/* ── 본문 2열 ── */}
            <div className="data_box">

                {/* 왼쪽: 차트 */}
                <div className="graph_box">
                    <div className="graph">
                        <h3>
                            시간대별 이상거래
                            {aiStatus === "loading" && <span className="chart_loading_tag">분석 중</span>}
                        </h3>
                        <div className="chart_wrap chart_bar">
                            <div className="bars">
                                {hourlyBars.map((item) => (
                                    <div key={item.hour} className="bar" style={{ "--v": item.percent }}>
                                        <span className="count">{item.count}</span>
                                        <span className="label">{item.hour}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="graph">
                        <h3>
                            월별 보안 프로파일링 분석 추이
                            {aiStatus === "loading" && <span className="chart_loading_tag">분석 중</span>}
                        </h3>
                        <div className="chart_wrap chart_line">
                            {aiStatus === "loading" && monthlyTrend.length === 0 ? (
                                <div className="line_placeholder ai_loading_pulse">AI 데이터 불러오는 중...</div>
                            ) : monthlyTrend.length === 0 ? (
                                <div className="line_placeholder">AI 서버 연결 후 표시됩니다</div>
                            ) : (
                                <svg viewBox={`0 0 ${chartW} ${chartH}`} width="100%" height="100%" className="monthly_svg">
                                    {[0, 0.25, 0.5, 0.75, 1].map((t) => {
                                        const y = padT + innerH * (1 - t);
                                        return <line key={t} x1={padL} y1={y} x2={padL + innerW} y2={y} stroke="rgba(0,0,0,0.08)" strokeWidth="1" />;
                                    })}
                                    {linePoints && (
                                        <polyline points={linePoints} fill="none" stroke="#009688"
                                                  strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
                                    )}
                                    {lineDots.map((d) => (
                                        <g key={d.month}>
                                            <circle cx={d.x} cy={d.y} r="5"
                                                    fill={d.isFraud === 1 ? "#e74c3c" : "#009688"}
                                                    stroke="#fff" strokeWidth="2" />
                                            <text x={d.x} y={d.y - 12} textAnchor="middle" fontSize="9"
                                                  fill={d.isFraud === 1 ? "#e74c3c" : "#009688"} fontWeight="700">
                                                {d.value}%
                                            </text>
                                            <text x={d.x} y={padT + innerH + padB - 6} textAnchor="middle" fontSize="9" fill="#6b7280">
                                                {d.month}
                                            </text>
                                        </g>
                                    ))}
                                </svg>
                            )}
                        </div>
                    </div>
                </div>

                {/* 오른쪽: 리포트 */}
                <div className="report_box">

                    {/* ── 거래 이상 의심 데이터 (AI 점수 반영) ── */}
                    <div className="report">
                        <h3>
                            거래 이상 의심 데이터
                            {aiStatus === "loading" && <span className="chart_loading_tag">분석 중</span>}
                        </h3>
                        <table>
                            <thead>
                            <tr>
                                <th>기관명</th>
                                <th>금일탐지건수</th>
                                <th>고위험비율</th>
                                <th>평균<br />리스크점수</th>
                                {aiBankRows.length > 0 && <th>AI판정</th>}
                            </tr>
                            </thead>
                            <tbody>
                            {suspiciousData.map((item) => (
                                <tr key={item.bankName} className={item.isFraud === 1 ? "row_fraud" : ""}>
                                    <td>{item.bankName}</td>
                                    <td>{item.detectedCount}</td>
                                    <td>{item.highRiskRate}</td>
                                    <td>{item.avgRiskScore}</td>
                                    {aiBankRows.length > 0 && (
                                        <td>
                                            <span className={`fraud_badge fraud_badge--${item.isFraud === 1 ? "danger" : "safe"}`}>
                                                {item.isFraud === 1 ? "사기의심" : "정상"}
                                            </span>
                                        </td>
                                    )}
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>

                    {/* ── AI 이상징후 패턴 탐지 결과 ── */}
                    <div className="report">
                        <h3>AI 이상징후 패턴 탐지 결과</h3>
                        <ul className="pattern_list">
                            {patternList.map((item, idx) => (
                                <li key={`${item.level}-${idx}`} className={`pattern_row risk_${item.level}`}>
                                    <div className="left">
                                        <span className="dot"></span>
                                        {item.text}
                                    </div>
                                    <div className="right">
                                        <span className="count">{item.count}</span>
                                        <span className="sep">|</span>
                                        <span className="risk_text">위험도</span>
                                        <span className="risk_meter" style={{ "--pct": `${item.risk}%` }} aria-label={`위험도 ${item.risk}%`}></span>
                                        <span className="risk_pct">{item.risk}%</span>
                                        {item.isFraud !== undefined && (
                                            <span className={`fraud_badge fraud_badge--${item.isFraud === 1 ? "danger" : "safe"}`}>
                                                {item.isFraud === 1 ? "사기" : "정상"}
                                            </span>
                                        )}
                                        {item.shapImage && (
                                            <button
                                                className="shap_btn"
                                                onClick={() => setSelectedPattern(selectedPattern === idx ? null : idx)}
                                                title="AI 예측 근거 보기"
                                            >📊</button>
                                        )}
                                    </div>
                                    {selectedPattern === idx && item.shapImage && (
                                        <div className="shap_panel">
                                            <div className="shap_panel_header">
                                                <span>AI 예측 근거 (SHAP) — {item.text}</span>
                                                <button className="shap_close" onClick={() => setSelectedPattern(null)}>✕</button>
                                            </div>
                                            <img
                                                src={`data:image/png;base64,${item.shapImage}`}
                                                alt="SHAP 분석 결과"
                                                className="shap_img"
                                            />
                                        </div>
                                    )}
                                </li>
                            ))}
                        </ul>

                        <div className="report_footer">
                            <span className="live_dot" aria-hidden="true"></span>
                            <span className="report_footer_text">
                                최근 1시간 내 고위험 패턴 {newHighRiskCount}건 추가 발생
                            </span>
                            <span className="report_footer_time">
                                {aiStatus === "ok" ? `AI 업데이트 ${updatedTimeStr}` : "업데이트 대기 중"}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* ── 사용자 추가 모달 ── */}
            {isUserModalOpen && (
                <div className="user_add_modal_overlay">
                    <div className="user_add_modal">
                        <div className="user_add_modal_header">
                            <h3>사용자 추가</h3>
                            <button type="button" className="user_add_close" onClick={() => setIsUserModalOpen(false)}>&times;</button>
                        </div>
                        <form className="user_add_form" onSubmit={handleSubmitUserAdd}>
                            <input type="text"     name="memberId" placeholder="아이디"   value={memberForm.memberId} onChange={handleChangeMemberForm} required />
                            <input type="password" name="pwd"      placeholder="비밀번호" value={memberForm.pwd}      onChange={handleChangeMemberForm} required />
                            <input type="text"     name="bankCode" placeholder="은행코드" value={memberForm.bankCode} onChange={handleChangeMemberForm} required />
                            <select name="role" value={memberForm.role} onChange={handleChangeMemberForm} required>
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
