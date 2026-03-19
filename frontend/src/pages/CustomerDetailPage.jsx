import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCustomerDetail } from "../services/bankApi.js";
import "../styles/CustomerDetailPage.css";

const AI_URL = import.meta.env.VITE_AI_URL || "http://localhost:5000";

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

/**
 * SHAP 값(기여도) → 0~100 이상 점수로 변환
 * SHAP > 0 : 이상거래에 기여 → 점수 높을수록 위험
 * 값 범위를 0~1 스케일로 가정하고 100점 만점으로 환산
 */
function shapToScore(shapVal) {
    if (shapVal === undefined || shapVal === null) return 0;
    // 양수(위험 기여)만 점수화, 음수는 0점
    const clamped = Math.max(0, shapVal);
    return Math.min(100, Math.round(clamped * 100));
}

function CustomerDetailPage() {
    const navigate = useNavigate();
    const { bankCode, userId, txId } = useParams();

    const [detail, setDetail]   = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError]     = useState("");

    // ── AI 상태 ──────────────────────────────────────────────
    const [aiStatus, setAiStatus] = useState("idle"); // idle | loading | ok | error
    const [aiResult, setAiResult] = useState(null);
    const [showShap, setShowShap] = useState(false);
    const isMountedRef            = useRef(true);

    const bankNameMap = {
        "01": "관리자",  "02": "하나은행",   "03": "우리은행",
        "04": "카카오뱅크", "05": "국민은행",  "06": "토스뱅크",
        "07": "MG새마을금고", "08": "IBK기업은행", "09": "신한은행",
    };

    useEffect(() => {
        isMountedRef.current = true;

        async function loadDetail() {
            try {
                setLoading(true);
                setError("");

                const data = await fetchCustomerDetail(bankCode, userId, txId);
                if (!isMountedRef.current) return;
                setDetail(data);

                // 거래 데이터 로드 완료 → AI 자동 분석
                if (data?.currentTransaction) {
                    const tx = data.currentTransaction;
                    setAiStatus("loading");
                    try {
                        const ai = await callPredict({
                            txChannel:  tx.txChannel,
                            txType:     tx.txType,
                            txAmount:   tx.txAmount,
                            txDatetime: tx.txDatetime,
                            txCountry:  tx.txCountry,
                            txLocation: tx.txLocation,
                            deviceType: tx.deviceType,
                            deviceOs:   tx.deviceOs,
                        });
                        if (isMountedRef.current) {
                            setAiResult(ai);
                            setAiStatus("ok");
                        }
                    } catch (aiErr) {
                        console.error("AI 분석 오류:", aiErr);
                        if (isMountedRef.current) setAiStatus("error");
                    }
                }
            } catch (err) {
                console.error(err);
                if (isMountedRef.current) setError("고객 상세 데이터를 불러오지 못했습니다.");
            } finally {
                if (isMountedRef.current) setLoading(false);
            }
        }

        loadDetail();
        return () => { isMountedRef.current = false; };
    }, [bankCode, userId, txId]);

    if (loading) return <div className="customer-detail-page">불러오는 중...</div>;
    if (error)   return <div className="customer-detail-page error-text">{error}</div>;
    if (!detail?.customer) return <div className="customer-detail-page">조회된 고객 정보가 없습니다.</div>;

    const { customer, currentTransaction, recentTransactions } = detail;

    // ── AI shapDetail → 이상거래 점수 4항목 계산 ─────────────
    const shap = aiResult?.shapDetail ?? {};

    const timeScore     = aiStatus === "ok" ? shapToScore(shap["거래시간(시)"])                            : (detail.score?.timeScore     ?? 0);
    const amountScore   = aiStatus === "ok" ? shapToScore(shap["거래금액"])                               : (detail.score?.amountScore   ?? 0);
    const locationScore = aiStatus === "ok" ? shapToScore((shap["거래지역"] ?? 0) + (shap["거래국가"] ?? 0)) : (detail.score?.locationScore ?? 0);
    const deviceScore   = aiStatus === "ok" ? shapToScore((shap["디바이스타입"] ?? 0) + (shap["디바이스OS"] ?? 0)) : (detail.score?.deviceScore ?? 0);
    const totalScore    = timeScore + amountScore + locationScore + deviceScore;

    // ── AI 결과 → summary 비교 보강 ──────────────────────────
    // AI 판정 결과를 "주 사용 국가 비교" 행에 추가 표시
    const aiJudgeText = aiStatus === "ok" && aiResult
        ? `${aiResult.resultText} (${aiResult.fraudProbability}%)`
        : null;

    return (
        <div className="customer-detail-page">
            <div className="detail_top_bar">
                <div className="detail_bank_info">
                    <span>{bankNameMap[bankCode] || "등록은행X"}</span>
                    <span className="divider">|</span>
                    <span>은행코드: {bankCode}</span>
                    <span className="divider">|</span>
                    <span>거래 상세 분석</span>
                </div>
                <button type="button" className="back_btn" onClick={() => navigate(`/bank/${bankCode}`)}>
                    돌아가기
                </button>
            </div>

            <div className="customer_info_box">
                <span>{customer.userId}</span>
                <span className="divider">|</span>
                <span>{customer.name || "-"}</span>
                <span className="divider">|</span>
                <span>{customer.phone || "-"}</span>
                <span className="divider">|</span>
                <span>{customer.email || "-"}</span>
            </div>

            <div className="detail_section">
                <h3>기본 거래 정보</h3>
                <div className="table_wrap">
                    <table>
                        <thead>
                        <tr>
                            <th>거래ID</th><th>고객ID</th><th>거래금액</th><th>거래일시</th>
                            <th>거래채널</th><th>거래유형</th><th>기기유형</th><th>기기OS</th>
                            <th>거래위치</th><th>IP</th><th>위험점수</th>
                        </tr>
                        </thead>
                        <tbody>
                        <tr>
                            <td>{currentTransaction.txId}</td>
                            <td>{currentTransaction.userId}</td>
                            <td>{currentTransaction.txAmount}</td>
                            <td>{currentTransaction.txDatetime}</td>
                            <td>{currentTransaction.txChannel || "-"}</td>
                            <td>{currentTransaction.txType || "-"}</td>
                            <td>{currentTransaction.deviceType || "-"}</td>
                            <td>{currentTransaction.deviceOs || "-"}</td>
                            <td>{currentTransaction.txLocation || "-"}</td>
                            <td>{currentTransaction.ipAddress || "-"}</td>
                            <td>{currentTransaction.fraudScore ?? "-"}</td>
                        </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            <div className="detail_grid">
                {/* ── 평균 vs 현재 거래 비교 ── */}
                <div className="detail_card compare_card">
                    <h3>평균 vs 현재 거래 비교</h3>
                    <table>
                        <tbody>
                        <tr>
                            <td>거래금액</td>
                            <td>{detail.summary?.avgTxAmount ?? "-"}</td>
                            <td>{currentTransaction.txAmount}</td>
                        </tr>
                        <tr>
                            <td>주 사용 국가</td>
                            <td>{detail.summary?.mainCountry ?? "-"}</td>
                            <td>{currentTransaction.txCountry || "-"}</td>
                        </tr>
                        <tr>
                            <td>최근 거래 건수</td>
                            <td>{detail.summary?.recentTxCount ?? 0}</td>
                            <td>선택 거래 1건</td>
                        </tr>
                        {/* AI 판정 결과 행 */}
                        {aiStatus === "ok" && aiResult && (
                            <tr className={aiResult.isFraud ? "ai_row_fraud" : "ai_row_normal"}>
                                <td>AI 종합 판정</td>
                                <td colSpan="2">
                                    <span className={`fraud_badge fraud_badge--${aiResult.isFraud ? "danger" : "safe"}`}>
                                        {aiJudgeText}
                                    </span>
                                </td>
                            </tr>
                        )}
                        {aiStatus === "loading" && (
                            <tr>
                                <td>AI 종합 판정</td>
                                <td colSpan="2"><span className="chart_loading_tag">분석 중</span></td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>

                {/* ── 이상 거래 점수 (AI shapDetail 기반) ── */}
                <div className="detail_card">
                    <h3>
                        이상 거래 점수
                        {aiStatus === "loading" && <span className="chart_loading_tag">AI 분석 중</span>}
                        {aiStatus === "ok"      && <span className="ai_label_tag">AI</span>}
                    </h3>
                    <div className="score_grid">
                        <div className="score_box">
                            <span>거래시간 이상 점수</span>
                            <strong>{timeScore}점</strong>
                        </div>
                        <div className="score_box">
                            <span>거래금액 이상 점수</span>
                            <strong>{amountScore}점</strong>
                        </div>
                        <div className="score_box">
                            <span>거래지역 이상 점수</span>
                            <strong>{locationScore}점</strong>
                        </div>
                        <div className="score_box">
                            <span>기기 이상 점수</span>
                            <strong>{deviceScore}점</strong>
                        </div>
                        <div className={`score_box total ${aiStatus === "ok" && aiResult?.isFraud ? "total_fraud" : ""}`}>
                            <div className="total_row">
                                <div className="total_left">
                                    <span>총점</span>
                                    <strong>{totalScore}점</strong>
                                </div>
                                {aiStatus === "ok" && aiResult && (
                                    <div className="total_right">
                                        <span className={`fraud_badge fraud_badge--${aiResult.isFraud ? "danger" : "safe"}`}>
                                            {aiResult.isFraud ? "사기 의심" : "정상"}
                                        </span>
                                        {aiResult.shapImage && (
                                            <button className="shap_btn" onClick={() => setShowShap(true)}>
                                                📊 근거 보기
                                            </button>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* SHAP 모달 */}
                    {showShap && aiResult?.shapImage && (
                        <div className="shap_modal_overlay" onClick={() => setShowShap(false)}>
                            <div className="shap_modal" onClick={(e) => e.stopPropagation()}>
                                <div className="shap_panel_header">
                                    <span>AI 예측 근거 (SHAP)</span>
                                    <button className="shap_close" onClick={() => setShowShap(false)}>✕</button>
                                </div>
                                <img
                                    src={`data:image/png;base64,${aiResult.shapImage}`}
                                    alt="SHAP 분석 결과"
                                    className="shap_img"
                                />
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="detail_section">
                <h3>최근 거래 이력</h3>
                <div className="table_wrap recent_table_wrap">
                    <table>
                        <thead>
                        <tr>
                            <th>거래ID</th><th>거래유형</th><th>거래금액</th>
                            <th>거래채널</th><th>거래위치</th><th>거래일시</th><th>위험점수</th>
                        </tr>
                        </thead>
                        <tbody>
                        {recentTransactions?.length > 0 ? (
                            recentTransactions.map((item) => (
                                <tr key={item.txId}>
                                    <td>{item.txId}</td>
                                    <td>{item.txType || "-"}</td>
                                    <td>{item.txAmount}</td>
                                    <td>{item.txChannel || "-"}</td>
                                    <td>{item.txLocation || "-"}</td>
                                    <td>{item.txDatetime}</td>
                                    <td>{item.fraudScore ?? "-"}</td>
                                </tr>
                            ))
                        ) : (
                            <tr><td colSpan="7">최근 거래 이력이 없습니다.</td></tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default CustomerDetailPage;
