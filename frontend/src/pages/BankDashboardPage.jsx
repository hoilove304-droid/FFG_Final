import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { apiUrl } from "../services/api";
import "../styles/BankDashboardPage.css";

const AI_URL = import.meta.env.VITE_AI_URL || "http://localhost:5000";
const POLL_INTERVAL_MS = 30_000;

// ── 은행별 시나리오 데이터 ──────────────────────────────────
// 각 은행 특성에 맞는 샘플 거래로 AI 분석
const BANK_AI_SCENARIOS = {
    "02": { // 하나은행
        hourly: [
            { hour: "00", payload: { txChannel: "WEB",  txType: "TRANSFER", txAmount: 7200000,  txDatetime: "2026-03-19T00:20", txCountry: "CN", txLocation: "베이징",  deviceType: "PC",     deviceOs: "Windows" } },
            { hour: "04", payload: { txChannel: "ATM",  txType: "WITHDRAW", txAmount: 2800000,  txDatetime: "2026-03-19T04:10", txCountry: "KR", txLocation: "서울",    deviceType: "ATM",    deviceOs: "Windows" } },
            { hour: "08", payload: { txChannel: "APP",  txType: "PAYMENT",  txAmount: 350000,   txDatetime: "2026-03-19T08:30", txCountry: "KR", txLocation: "서울",    deviceType: "MOBILE", deviceOs: "iOS"     } },
            { hour: "12", payload: { txChannel: "WEB",  txType: "TRANSFER", txAmount: 1500000,  txDatetime: "2026-03-19T12:15", txCountry: "KR", txLocation: "부산",    deviceType: "PC",     deviceOs: "MacOS"   } },
            { hour: "16", payload: { txChannel: "APP",  txType: "TRANSFER", txAmount: 3800000,  txDatetime: "2026-03-19T16:40", txCountry: "US", txLocation: "뉴욕",    deviceType: "MOBILE", deviceOs: "Android" } },
            { hour: "20", payload: { txChannel: "WEB",  txType: "WITHDRAW", txAmount: 5200000,  txDatetime: "2026-03-19T20:50", txCountry: "RU", txLocation: "모스크바", deviceType: "PC",     deviceOs: "Linux"   } },
        ],
        monthly: [
            { month: "1월", payload: { txChannel: "WEB",  txType: "TRANSFER", txAmount: 2900000,  txDatetime: "2026-01-12T10:00", txCountry: "KR", txLocation: "서울", deviceType: "PC",     deviceOs: "Windows" } },
            { month: "2월", payload: { txChannel: "APP",  txType: "TRANSFER", txAmount: 4200000,  txDatetime: "2026-02-08T14:00", txCountry: "CN", txLocation: "베이징", deviceType: "MOBILE", deviceOs: "Android" } },
            { month: "3월", payload: { txChannel: "WEB",  txType: "PAYMENT",  txAmount: 5100000,  txDatetime: "2026-03-05T02:00", txCountry: "RU", txLocation: "모스크바", deviceType: "PC",   deviceOs: "Linux"   } },
            { month: "4월", payload: { txChannel: "ATM",  txType: "WITHDRAW", txAmount: 3300000,  txDatetime: "2026-04-18T22:00", txCountry: "KR", txLocation: "인천", deviceType: "ATM",    deviceOs: "Windows" } },
            { month: "5월", payload: { txChannel: "APP",  txType: "TRANSFER", txAmount: 6800000,  txDatetime: "2026-05-10T03:00", txCountry: "US", txLocation: "뉴욕",  deviceType: "MOBILE", deviceOs: "iOS"     } },
            { month: "6월", payload: { txChannel: "WEB",  txType: "TRANSFER", txAmount: 8900000,  txDatetime: "2026-06-03T01:00", txCountry: "CN", txLocation: "상하이", deviceType: "PC",    deviceOs: "Windows" } },
        ],
        baseSummary: { total: 128, detected: 17, responded: 15, pending: 5 },
        baseResponse: { email: 10, call: 3, block: 2, review: 5 },
    },
    "03": { // 우리은행
        hourly: [
            { hour: "00", payload: { txChannel: "WEB",  txType: "TRANSFER", txAmount: 6100000,  txDatetime: "2026-03-19T00:45", txCountry: "RU", txLocation: "모스크바", deviceType: "PC",     deviceOs: "Windows" } },
            { hour: "04", payload: { txChannel: "APP",  txType: "TRANSFER", txAmount: 4500000,  txDatetime: "2026-03-19T04:30", txCountry: "CN", txLocation: "베이징",  deviceType: "MOBILE", deviceOs: "Android" } },
            { hour: "08", payload: { txChannel: "WEB",  txType: "PAYMENT",  txAmount: 820000,   txDatetime: "2026-03-19T08:20", txCountry: "KR", txLocation: "서울",    deviceType: "PC",     deviceOs: "MacOS"   } },
            { hour: "12", payload: { txChannel: "APP",  txType: "TRANSFER", txAmount: 2100000,  txDatetime: "2026-03-19T12:50", txCountry: "KR", txLocation: "대전",    deviceType: "MOBILE", deviceOs: "iOS"     } },
            { hour: "16", payload: { txChannel: "WEB",  txType: "TRANSFER", txAmount: 5500000,  txDatetime: "2026-03-19T16:15", txCountry: "US", txLocation: "LA",      deviceType: "PC",     deviceOs: "Windows" } },
            { hour: "20", payload: { txChannel: "ATM",  txType: "WITHDRAW", txAmount: 4700000,  txDatetime: "2026-03-19T20:10", txCountry: "KR", txLocation: "부산",    deviceType: "ATM",    deviceOs: "Windows" } },
        ],
        monthly: [
            { month: "1월", payload: { txChannel: "APP",  txType: "TRANSFER", txAmount: 3100000,  txDatetime: "2026-01-20T09:00", txCountry: "KR", txLocation: "서울",   deviceType: "MOBILE", deviceOs: "Android" } },
            { month: "2월", payload: { txChannel: "WEB",  txType: "PAYMENT",  txAmount: 2800000,  txDatetime: "2026-02-14T15:00", txCountry: "KR", txLocation: "서울",   deviceType: "PC",     deviceOs: "Windows" } },
            { month: "3월", payload: { txChannel: "WEB",  txType: "TRANSFER", txAmount: 7200000,  txDatetime: "2026-03-10T03:00", txCountry: "CN", txLocation: "베이징", deviceType: "PC",     deviceOs: "Linux"   } },
            { month: "4월", payload: { txChannel: "APP",  txType: "TRANSFER", txAmount: 5900000,  txDatetime: "2026-04-22T23:00", txCountry: "RU", txLocation: "모스크바", deviceType: "MOBILE", deviceOs: "iOS"   } },
            { month: "5월", payload: { txChannel: "WEB",  txType: "WITHDRAW", txAmount: 8100000,  txDatetime: "2026-05-08T02:00", txCountry: "US", txLocation: "뉴욕",   deviceType: "PC",     deviceOs: "Windows" } },
            { month: "6월", payload: { txChannel: "ATM",  txType: "WITHDRAW", txAmount: 9300000,  txDatetime: "2026-06-01T01:30", txCountry: "KR", txLocation: "인천",   deviceType: "ATM",    deviceOs: "Windows" } },
        ],
        baseSummary: { total: 146, detected: 21, responded: 18, pending: 7 },
        baseResponse: { email: 8, call: 6, block: 4, review: 7 },
    },
    "04": { // 카카오뱅크
        hourly: [
            { hour: "00", payload: { txChannel: "APP",  txType: "TRANSFER", txAmount: 9100000,  txDatetime: "2026-03-19T00:10", txCountry: "CN", txLocation: "베이징",  deviceType: "MOBILE", deviceOs: "Android" } },
            { hour: "04", payload: { txChannel: "APP",  txType: "PAYMENT",  txAmount: 3200000,  txDatetime: "2026-03-19T04:55", txCountry: "KR", txLocation: "서울",    deviceType: "MOBILE", deviceOs: "iOS"     } },
            { hour: "08", payload: { txChannel: "APP",  txType: "TRANSFER", txAmount: 750000,   txDatetime: "2026-03-19T08:05", txCountry: "KR", txLocation: "서울",    deviceType: "MOBILE", deviceOs: "Android" } },
            { hour: "12", payload: { txChannel: "APP",  txType: "PAYMENT",  txAmount: 4200000,  txDatetime: "2026-03-19T12:30", txCountry: "US", txLocation: "뉴욕",    deviceType: "MOBILE", deviceOs: "iOS"     } },
            { hour: "16", payload: { txChannel: "APP",  txType: "TRANSFER", txAmount: 6600000,  txDatetime: "2026-03-19T16:20", txCountry: "RU", txLocation: "모스크바", deviceType: "MOBILE", deviceOs: "Android" } },
            { hour: "20", payload: { txChannel: "APP",  txType: "WITHDRAW", txAmount: 8300000,  txDatetime: "2026-03-19T20:40", txCountry: "CN", txLocation: "상하이",  deviceType: "MOBILE", deviceOs: "iOS"     } },
        ],
        monthly: [
            { month: "1월", payload: { txChannel: "APP",  txType: "TRANSFER", txAmount: 2200000,  txDatetime: "2026-01-08T11:00", txCountry: "KR", txLocation: "서울",   deviceType: "MOBILE", deviceOs: "iOS"     } },
            { month: "2월", payload: { txChannel: "APP",  txType: "TRANSFER", txAmount: 4800000,  txDatetime: "2026-02-18T02:00", txCountry: "CN", txLocation: "베이징", deviceType: "MOBILE", deviceOs: "Android" } },
            { month: "3월", payload: { txChannel: "APP",  txType: "PAYMENT",  txAmount: 6500000,  txDatetime: "2026-03-12T01:00", txCountry: "RU", txLocation: "모스크바", deviceType: "MOBILE", deviceOs: "iOS"   } },
            { month: "4월", payload: { txChannel: "APP",  txType: "TRANSFER", txAmount: 9700000,  txDatetime: "2026-04-25T23:00", txCountry: "US", txLocation: "뉴욕",   deviceType: "MOBILE", deviceOs: "Android" } },
            { month: "5월", payload: { txChannel: "APP",  txType: "WITHDRAW", txAmount: 7400000,  txDatetime: "2026-05-15T03:30", txCountry: "CN", txLocation: "상하이", deviceType: "MOBILE", deviceOs: "iOS"     } },
            { month: "6월", payload: { txChannel: "APP",  txType: "TRANSFER", txAmount: 11000000, txDatetime: "2026-06-07T00:50", txCountry: "RU", txLocation: "모스크바", deviceType: "MOBILE", deviceOs: "Android"} },
        ],
        baseSummary: { total: 173, detected: 26, responded: 20, pending: 9 },
        baseResponse: { email: 11, call: 5, block: 4, review: 9 },
    },
};

// 05~09 은행은 기본 시나리오 공유 (간략화)
const DEFAULT_HOURLY = [
    { hour: "00", payload: { txChannel: "WEB",  txType: "TRANSFER", txAmount: 5500000,  txDatetime: "2026-03-19T00:30", txCountry: "CN", txLocation: "베이징",  deviceType: "PC",     deviceOs: "Windows" } },
    { hour: "04", payload: { txChannel: "ATM",  txType: "WITHDRAW", txAmount: 2200000,  txDatetime: "2026-03-19T04:20", txCountry: "KR", txLocation: "서울",    deviceType: "ATM",    deviceOs: "Windows" } },
    { hour: "08", payload: { txChannel: "APP",  txType: "PAYMENT",  txAmount: 450000,   txDatetime: "2026-03-19T08:15", txCountry: "KR", txLocation: "서울",    deviceType: "MOBILE", deviceOs: "iOS"     } },
    { hour: "12", payload: { txChannel: "WEB",  txType: "TRANSFER", txAmount: 1800000,  txDatetime: "2026-03-19T12:40", txCountry: "KR", txLocation: "대전",    deviceType: "PC",     deviceOs: "MacOS"   } },
    { hour: "16", payload: { txChannel: "APP",  txType: "TRANSFER", txAmount: 4100000,  txDatetime: "2026-03-19T16:30", txCountry: "US", txLocation: "뉴욕",    deviceType: "MOBILE", deviceOs: "Android" } },
    { hour: "20", payload: { txChannel: "WEB",  txType: "WITHDRAW", txAmount: 6300000,  txDatetime: "2026-03-19T20:20", txCountry: "RU", txLocation: "모스크바", deviceType: "PC",     deviceOs: "Linux"   } },
];
const DEFAULT_MONTHLY = [
    { month: "1월", payload: { txChannel: "WEB",  txType: "TRANSFER", txAmount: 3500000,  txDatetime: "2026-01-15T10:00", txCountry: "KR", txLocation: "서울",   deviceType: "PC",     deviceOs: "Windows" } },
    { month: "2월", payload: { txChannel: "APP",  txType: "TRANSFER", txAmount: 4600000,  txDatetime: "2026-02-12T14:00", txCountry: "CN", txLocation: "베이징", deviceType: "MOBILE", deviceOs: "Android" } },
    { month: "3월", payload: { txChannel: "WEB",  txType: "PAYMENT",  txAmount: 5800000,  txDatetime: "2026-03-08T02:00", txCountry: "RU", txLocation: "모스크바", deviceType: "PC",   deviceOs: "Linux"   } },
    { month: "4월", payload: { txChannel: "ATM",  txType: "WITHDRAW", txAmount: 3100000,  txDatetime: "2026-04-20T22:00", txCountry: "KR", txLocation: "인천",   deviceType: "ATM",    deviceOs: "Windows" } },
    { month: "5월", payload: { txChannel: "APP",  txType: "TRANSFER", txAmount: 7500000,  txDatetime: "2026-05-11T03:00", txCountry: "US", txLocation: "뉴욕",   deviceType: "MOBILE", deviceOs: "iOS"     } },
    { month: "6월", payload: { txChannel: "WEB",  txType: "TRANSFER", txAmount: 9500000,  txDatetime: "2026-06-04T01:00", txCountry: "CN", txLocation: "상하이", deviceType: "PC",     deviceOs: "Windows" } },
];
const DEFAULT_SUMMARY = { total: 155, detected: 20, responded: 17, pending: 6 };
const DEFAULT_RESPONSE = { email: 9, call: 4, block: 4, review: 6 };

function getBankScenario(bankCode) {
    return BANK_AI_SCENARIOS[bankCode] || {
        hourly: DEFAULT_HOURLY,
        monthly: DEFAULT_MONTHLY,
        baseSummary: DEFAULT_SUMMARY,
        baseResponse: DEFAULT_RESPONSE,
    };
}

async function callPredict(payload) {
    const res = await fetch(`${AI_URL}/predict`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
    });
    if (!res.ok) throw new Error("AI 서버 오류");
    const data = await res.json();
    if (!data.success) throw new Error(data.error || "AI 분석 실패");
    return data;
}

function BankDashboardPage() {
    const navigate = useNavigate();
    const { bankCode: routeBankCode } = useParams();

    const role          = localStorage.getItem("role")     || "";
    const memberId      = localStorage.getItem("memberId") || "";
    const loginBankCode = localStorage.getItem("bankCode") || "";

    const selectedBankCode = useMemo(() => {
        if (role === "admin") return routeBankCode || "02";
        return loginBankCode || routeBankCode || "02";
    }, [role, routeBankCode, loginBankCode]);

    const selectedBankName = useMemo(() => {
        const map = { "01": "관리자", "02": "하나은행", "03": "우리은행", "04": "카카오뱅크",
                      "05": "국민은행", "06": "토스뱅크", "07": "MG새마을금고",
                      "08": "IBK기업은행", "09": "신한은행" };
        return map[selectedBankCode] || "등록은행X";
    }, [selectedBankCode]);

    const loginDisplayName    = role === "admin" ? "관리자" : selectedBankName;
    const loginDisplayBankCode = role === "admin" ? "-" : loginBankCode;

    // ── 백엔드 이상거래 목록 (기존 유지) ────────────────────
    const [fraudRows, setFraudRows] = useState([]);

    useEffect(() => {
        fetch(apiUrl(`/api/dashboard/${selectedBankCode}`))
            .then((res) => { if (!res.ok) throw new Error("API 실패"); return res.json(); })
            .then((data) => setFraudRows(data.fraudRows || []))
            .catch(() => setFraudRows([]));
    }, [selectedBankCode]);

    // ── AI 상태 ──────────────────────────────────────────────
    const [aiStatus,       setAiStatus]       = useState("idle");
    const [lastUpdated,    setLastUpdated]     = useState(null);
    const [aiSummary,      setAiSummary]       = useState(null);
    const [aiHourly,       setAiHourly]        = useState([]);
    const [aiMonthly,      setAiMonthly]       = useState([]);
    const [aiResponse,     setAiResponse]      = useState(null);
    const [aiFraudRows,    setAiFraudRows]     = useState([]);  // 하단 테이블 AI 판정
    const pollTimerRef = useRef(null);

    const runAiAnalysis = useCallback(async (bankCode) => {
        setAiStatus("loading");
        const scenario = getBankScenario(bankCode);
        try {
            // 1. 시간대별
            const hourlyResults = await Promise.all(
                scenario.hourly.map(async (s) => {
                    const r = await callPredict(s.payload);
                    return { hour: s.hour, count: Math.round(r.fraudProbability / 8), percent: Math.round(r.fraudProbability * 0.7) };
                })
            );
            setAiHourly(hourlyResults);

            // 2. 월별
            const monthlyResults = await Promise.all(
                scenario.monthly.map(async (s) => {
                    const r = await callPredict(s.payload);
                    return { month: s.month, value: Math.round(r.fraudProbability), isFraud: r.isFraud };
                })
            );
            setAiMonthly(monthlyResults);

            // 3. 요약 카드 — AI 결과 기반 보정
            const avgFraudProb = monthlyResults.reduce((a, m) => a + m.value, 0) / monthlyResults.length;
            const ratio        = avgFraudProb / 100;
            const base         = scenario.baseSummary;
            // total도 AI 위험도 비율에 따라 ±15% 범위에서 보정
            setAiSummary({
                total:     Math.round(base.total     * (0.9  + ratio * 0.2)),
                detected:  Math.round(base.detected  * (0.85 + ratio * 0.3)),
                responded: Math.round(base.responded * (0.85 + ratio * 0.3)),
                pending:   Math.round(base.pending   * (0.85 + ratio * 0.3)),
            });

            // 4. 대응 현황 — AI 기반 보정
            const br = scenario.baseResponse;
            setAiResponse({
                email:  Math.round(br.email  * (0.8 + ratio * 0.4)),
                call:   Math.round(br.call   * (0.8 + ratio * 0.4)),
                block:  Math.round(br.block  * (0.8 + ratio * 0.4)),
                review: Math.round(br.review * (0.8 + ratio * 0.4)),
            });

            // 5. 하단 테이블 fraudRows에 AI 판정 추가
            // fraudRows는 백엔드에서 오므로, 각 행의 txAmount/txDatetime으로 AI 예측
            // fraudRows가 비어 있으면 스킵
            setAiFraudRows([]); // 백엔드 응답 후 useEffect에서 처리

            setAiStatus("ok");
            setLastUpdated(new Date());
        } catch (err) {
            console.error("AI 오류:", err);
            setAiStatus("error");
        }
    }, []);

    // 은행 변경 or 마운트 시 AI 실행
    useEffect(() => {
        if (pollTimerRef.current) clearInterval(pollTimerRef.current);
        runAiAnalysis(selectedBankCode);
        pollTimerRef.current = setInterval(() => runAiAnalysis(selectedBankCode), POLL_INTERVAL_MS);
        return () => { if (pollTimerRef.current) clearInterval(pollTimerRef.current); };
    }, [selectedBankCode, runAiAnalysis]);

    // fraudRows가 로드된 후 AI 판정 추가
    useEffect(() => {
        if (fraudRows.length === 0) { setAiFraudRows([]); return; }
        (async () => {
            try {
                const results = await Promise.all(
                    fraudRows.map(async (row) => {
                        const r = await callPredict({
                            txChannel:  "WEB",
                            txType:     "TRANSFER",
                            txAmount:   row.fraudScore ? row.fraudScore * 100000 : 5000000,
                            txDatetime: row.txDatetime ? row.txDatetime.replace(" ", "T").substring(0, 16) : "2026-03-19T10:00",
                            txCountry:  "KR",
                            txLocation: "서울",
                            deviceType: "PC",
                            deviceOs:   "Windows",
                        });
                        return { ...row, aiIsFraud: r.isFraud, aiProb: Math.round(r.fraudProbability) };
                    })
                );
                setAiFraudRows(results);
            } catch {
                setAiFraudRows(fraudRows.map((r) => ({ ...r, aiIsFraud: null, aiProb: null })));
            }
        })();
    }, [fraudRows]);

    // ── 화면에 쓸 데이터 (AI or fallback) ────────────────────
    const summaryCards = [
        { title: "일간 전체 거래수",     value: aiSummary?.total     ?? "—" },
        { title: "일간 이상거래 탐지 건수", value: aiSummary?.detected  ?? "—" },
        { title: "대응 거래 건수",       value: aiSummary?.responded ?? "—" },
        { title: "수동 검토 대기 건수",   value: aiSummary?.pending   ?? "—" },
    ];

    const hourlyBars  = aiHourly.length  > 0 ? aiHourly  : getBankScenario(selectedBankCode).hourly.map((s, i) => ({ hour: s.hour, count: i + 1, percent: (i + 1) * 12 }));
    const monthlyTrend = aiMonthly.length > 0 ? aiMonthly : [];

    const responseStatus = aiResponse ? [
        { label: "이메일",   value: aiResponse.email  },
        { label: "전화",     value: aiResponse.call   },
        { label: "거래차단", value: aiResponse.block  },
        { label: "검토대기", value: aiResponse.review },
    ] : [
        { label: "이메일",   value: "—" },
        { label: "전화",     value: "—" },
        { label: "거래차단", value: "—" },
        { label: "검토대기", value: "—" },
    ];

    // 하단 테이블 — aiFraudRows 우선, 없으면 fraudRows
    const tableRows = aiFraudRows.length > 0 ? aiFraudRows : fraudRows;

    const updatedTimeStr = lastUpdated
        ? `${String(lastUpdated.getHours()).padStart(2,"0")}:${String(lastUpdated.getMinutes()).padStart(2,"0")}`
        : "--:--";

    // ── 월별 SVG ────────────────────────────────────────────
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

    const handleBankChange = (e) => navigate(`/bank/${e.target.value}`);

    return (
        <div className="bank-dashboard-page">

            {/* ── 헤더 ── */}
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
                    {/* AI 뱃지: select 오른쪽 */}
                    <div className={`ai_status_badge_bank ai_status_${aiStatus}`}>
                        {aiStatus === "loading" && <span className="ai_spinner_bank"></span>}
                        {aiStatus === "ok"      && <span className="ai_dot_bank ai_dot_ok"></span>}
                        {aiStatus === "error"   && <span className="ai_dot_bank ai_dot_err"></span>}
                        <span>
                            {aiStatus === "idle"    && "AI 대기"}
                            {aiStatus === "loading" && "AI 분석 중..."}
                            {aiStatus === "ok"      && `AI 연동 완료 · ${updatedTimeStr}`}
                            {aiStatus === "error"   && "AI 서버 연결 실패"}
                        </span>
                    </div>
                </div>
            )}

            {role !== "admin" && (
                <div className="customerList_box">
                    <div className={`ai_status_badge_bank ai_status_${aiStatus}`}>
                        {aiStatus === "loading" && <span className="ai_spinner_bank"></span>}
                        {aiStatus === "ok"      && <span className="ai_dot_bank ai_dot_ok"></span>}
                        {aiStatus === "error"   && <span className="ai_dot_bank ai_dot_err"></span>}
                        <span>
                            {aiStatus === "idle"    && "AI 대기"}
                            {aiStatus === "loading" && "AI 분석 중..."}
                            {aiStatus === "ok"      && `AI 연동 완료 · ${updatedTimeStr}`}
                            {aiStatus === "error"   && "AI 서버 연결 실패"}
                        </span>
                    </div>
                </div>
            )}

            {/* ── 요약 카드 (AI 집계) ── */}
            <div className="error_wrapper_bank">
                {summaryCards.map((card) => (
                    <div className={`error_box_bank${aiStatus === "loading" ? " bank_card_loading" : ""}`} key={card.title}>
                        <h3>{card.title}</h3>
                        <span className="error_cnt_bank">{card.value}</span>
                    </div>
                ))}
            </div>

            {/* ── 차트 + 대응현황 ── */}
            <div className="data_box_bank">
                <div className="graph_box_bank">

                    {/* 시간대별 바 차트 */}
                    <div className="graph_bank">
                        <h3>
                            시간대별 이상거래 그래프
                            {aiStatus === "loading" && <span className="bank_loading_tag">분석 중</span>}
                        </h3>
                        <div className="chart_wrap_bank chart_bar_bank">
                            <div className="bars_bank">
                                {hourlyBars.map((item) => (
                                    <div key={item.hour} className="bar" style={{ "--v": item.percent }}>
                                        <span className="count">{item.count}</span>
                                        <span className="label">{item.hour}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* 월별 SVG 라인 차트 */}
                    <div className="graph_bank">
                        <h3>
                            월별 보안 프로파일링 분석 추이
                            {aiStatus === "loading" && <span className="bank_loading_tag">분석 중</span>}
                        </h3>
                        <div className="chart_wrap_bank chart_line_bank">
                            {aiStatus === "loading" && monthlyTrend.length === 0 ? (
                                <div className="bank_line_placeholder bank_ai_pulse">AI 데이터 불러오는 중...</div>
                            ) : monthlyTrend.length === 0 ? (
                                <div className="bank_line_placeholder">AI 서버 연결 후 표시됩니다</div>
                            ) : (
                                <svg viewBox={`0 0 ${chartW} ${chartH}`} width="100%" height="100%" className="bank_monthly_svg">
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
                                            <text x={d.x} y={d.y - 10} textAnchor="middle" fontSize="9"
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

                {/* 대응 현황 */}
                <div className="report_box_bank">
                    <div className="report_bank">
                        <h3>
                            대응 현황
                            {aiStatus === "loading" && <span className="bank_loading_tag">분석 중</span>}
                        </h3>
                        <table>
                            <tbody>
                            {responseStatus.map((item) => (
                                <tr key={item.label}>
                                    <td>{item.label}:</td>
                                    <td>
                                        <strong style={{ color: "var(--primary-green)" }}>{item.value}</strong>
                                        {aiStatus === "ok" && <span className="ai_val_tag">AI</span>}
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* ── 이상거래 목록 테이블 ── */}
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
                            <th>AI 판정</th>
                        </tr>
                        </thead>
                        <tbody>
                        {tableRows.length > 0 ? (
                            tableRows.map((item) => {
                                const actions = ["이메일 전송", "전화 안내", "거래 차단"];
                                const txKey   = Number(item.txId || 0);
                                const action  = actions[txKey % actions.length];
                                const minutes = (txKey % 5) + 1;

                                return (
                                    <tr
                                        key={item.txId}
                                        className={item.aiIsFraud === 1 ? "table_row_fraud" : ""}
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
                                        <td>
                                            {item.aiIsFraud !== null && item.aiIsFraud !== undefined ? (
                                                <span className={`bank_fraud_badge bank_fraud_badge--${item.aiIsFraud === 1 ? "danger" : "safe"}`}>
                                                    {item.aiIsFraud === 1 ? `사기 ${item.aiProb}%` : `정상 ${item.aiProb}%`}
                                                </span>
                                            ) : (
                                                <span className="bank_fraud_badge bank_fraud_badge--wait">분석중</span>
                                            )}
                                        </td>
                                    </tr>
                                );
                            })
                        ) : (
                            <tr>
                                <td colSpan="10">데이터가 없습니다.</td>
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
