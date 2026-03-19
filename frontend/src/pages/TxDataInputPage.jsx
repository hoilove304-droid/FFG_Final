import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../services/api";
import "../styles/TxDataInputPage.css";

// Flask AI 서버 주소
const AI_URL = import.meta.env.VITE_AI_URL || "http://localhost:5000";

function TxDataInputPage() {
    const navigate = useNavigate();

    const [form, setForm] = useState({
        userId: "",
        bankCode: "",
        txChannel: "",
        txType: "",
        txAmount: "",
        txDatetime: "",
        txCountry: "",
        txLocation: "",
        deviceType: "",
        deviceOs: "",
        deviceId: "",
        ipAddress: "",
    });

    const [aiResult, setAiResult] = useState({
        visible: false,
        loading: false,
        resultText: "",
        isFraud: null,
        fraudProbability: null,
        shapImage: "",
        shapDetail: null,
        error: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const validateForm = () => {
        if (!form.userId.trim()) {
            alert("사용자 ID는 필수 입력입니다.");
            return false;
        }
        if (!form.bankCode) {
            alert("은행 코드는 필수 입력입니다.");
            return false;
        }
        if (!form.txChannel) {
            alert("거래 채널은 필수 입력입니다.");
            return false;
        }
        if (!form.txType) {
            alert("거래 유형은 필수 입력입니다.");
            return false;
        }
        if (!form.txAmount || Number(form.txAmount) <= 0) {
            alert("거래 금액은 0보다 큰 값으로 입력해주세요.");
            return false;
        }
        if (!form.txDatetime) {
            alert("거래 일시는 필수 입력입니다.");
            return false;
        }
        return true;
    };

    const resetForm = () => {
        setForm({
            userId: "",
            bankCode: "",
            txChannel: "",
            txType: "",
            txAmount: "",
            txDatetime: "",
            txCountry: "",
            txLocation: "",
            deviceType: "",
            deviceOs: "",
            deviceId: "",
            ipAddress: "",
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const response = await fetch(apiUrl("/api/tx"), {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    userId:     form.userId,
                    bankCode:   form.bankCode,
                    txChannel:  form.txChannel,
                    txType:     form.txType,
                    txAmount:   Number(form.txAmount),
                    txDatetime: form.txDatetime,
                    txCountry:  form.txCountry,
                    txLocation: form.txLocation,
                    deviceType: form.deviceType,
                    deviceOs:   form.deviceOs,
                    deviceId:   form.deviceId,
                    ipAddress:  form.ipAddress,
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "거래 데이터 저장 실패");
            }

            alert("거래 데이터가 DB에 저장되었습니다.");
            resetForm();
        } catch (error) {
            console.error("거래 데이터 저장 오류:", error);
            alert(error.message || "거래 데이터 저장 중 오류가 발생했습니다.");
        }
    };

    // ── AI 분석 (Flask 실제 호출) ─────────────────────────
    const handleAiAnalyze = async () => {
        if (!validateForm()) return;

        setAiResult({
            visible: true,
            loading: true,
            resultText: "",
            isFraud: null,
            fraudProbability: null,
            shapImage: "",
            shapDetail: null,
            error: "",
        });

        try {
            const res = await fetch(`${AI_URL}/predict`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    txChannel:  form.txChannel,
                    txType:     form.txType,
                    txAmount:   Number(form.txAmount),
                    txDatetime: form.txDatetime,
                    txCountry:  form.txCountry,
                    txLocation: form.txLocation,
                    deviceType: form.deviceType,
                    deviceOs:   form.deviceOs,
                }),
            });

            if (!res.ok) throw new Error("AI 서버 응답 오류");
            const data = await res.json();
            if (!data.success) throw new Error(data.error || "AI 분석 실패");

            setAiResult({
                visible:          true,
                loading:          false,
                resultText:       data.resultText,
                isFraud:          data.isFraud,
                fraudProbability: data.fraudProbability,
                shapImage:        data.shapImage,
                shapDetail:       data.shapDetail,
                error:            "",
            });
        } catch (error) {
            setAiResult({
                visible: true,
                loading: false,
                resultText: "",
                isFraud: null,
                fraudProbability: null,
                shapImage: "",
                shapDetail: null,
                error: error.message || "분석 요청 중 오류가 발생했습니다.",
            });
        }
    };

    return (
        <div className="tx-page">
            <div className="tx-page__inner">
                <div className="tx-page__header">
                    <div className="tx-page__header-text">
                        <h2>거래 데이터 입력</h2>
                        <p>이상거래 탐지를 위한 거래 정보를 입력합니다.</p>
                    </div>
                    <button
                        type="button"
                        className="tx-page__back-btn"
                        onClick={() => navigate("/admin")}
                    >
                        돌아가기
                    </button>
                </div>

                <div className="tx-layout">
                    {/* ── 왼쪽: 입력 폼 ── */}
                    <section className="tx-left-panel">
                        <form className="tx-form" onSubmit={handleSubmit}>
                            <div className="tx-form__grid">
                                <div className="tx-form__group">
                                    <label htmlFor="userId">
                                        사용자 ID <span className="required">*</span>
                                    </label>
                                    <input
                                        id="userId"
                                        name="userId"
                                        value={form.userId}
                                        onChange={handleChange}
                                        placeholder="예: 2001"
                                    />
                                </div>

                                <div className="tx-form__group">
                                    <label htmlFor="bankCode">
                                        은행 코드 <span className="required">*</span>
                                    </label>
                                    <select
                                        id="bankCode"
                                        name="bankCode"
                                        value={form.bankCode}
                                        onChange={handleChange}
                                    >
                                        <option value="">선택하세요</option>
                                        <option value="02">하나은행</option>
                                        <option value="03">우리은행</option>
                                        <option value="04">카카오뱅크</option>
                                        <option value="01">관리자</option>
                                    </select>
                                </div>

                                <div className="tx-form__group">
                                    <label htmlFor="txChannel">
                                        거래 채널 <span className="required">*</span>
                                    </label>
                                    <select
                                        id="txChannel"
                                        name="txChannel"
                                        value={form.txChannel}
                                        onChange={handleChange}
                                    >
                                        <option value="">선택하세요</option>
                                        <option value="WEB">WEB</option>
                                        <option value="MOBILE">MOBILE</option>
                                        <option value="ATM">ATM</option>
                                    </select>
                                </div>

                                <div className="tx-form__group">
                                    <label htmlFor="txType">
                                        거래 유형 <span className="required">*</span>
                                    </label>
                                    <select
                                        id="txType"
                                        name="txType"
                                        value={form.txType}
                                        onChange={handleChange}
                                    >
                                        <option value="">선택하세요</option>
                                        <option value="TRANSFER">이체</option>
                                        <option value="WITHDRAW">출금</option>
                                        <option value="DEPOSIT">입금</option>
                                        <option value="PAYMENT">결제</option>
                                    </select>
                                </div>

                                <div className="tx-form__group">
                                    <label htmlFor="txAmount">
                                        거래 금액 <span className="required">*</span>
                                    </label>
                                    <input
                                        id="txAmount"
                                        name="txAmount"
                                        type="number"
                                        min="1"
                                        value={form.txAmount}
                                        onChange={handleChange}
                                        placeholder="예: 500000"
                                    />
                                </div>

                                <div className="tx-form__group">
                                    <label htmlFor="txDatetime">
                                        거래 일시 <span className="required">*</span>
                                    </label>
                                    <input
                                        id="txDatetime"
                                        name="txDatetime"
                                        type="datetime-local"
                                        value={form.txDatetime}
                                        onChange={handleChange}
                                    />
                                </div>

                                <div className="tx-form__group">
                                    <label htmlFor="txCountry">거래 국가</label>
                                    <input
                                        id="txCountry"
                                        name="txCountry"
                                        value={form.txCountry}
                                        onChange={handleChange}
                                        placeholder="예: KR"
                                    />
                                </div>

                                <div className="tx-form__group">
                                    <label htmlFor="txLocation">거래 위치</label>
                                    <input
                                        id="txLocation"
                                        name="txLocation"
                                        value={form.txLocation}
                                        onChange={handleChange}
                                        placeholder="예: 서울 강남구"
                                    />
                                </div>

                                <div className="tx-form__group">
                                    <label htmlFor="deviceType">디바이스 타입</label>
                                    <select
                                        id="deviceType"
                                        name="deviceType"
                                        value={form.deviceType}
                                        onChange={handleChange}
                                    >
                                        <option value="">선택하세요</option>
                                        <option value="MOBILE">MOBILE</option>
                                        <option value="PC">PC</option>
                                        <option value="ATM">ATM</option>
                                    </select>
                                </div>

                                <div className="tx-form__group">
                                    <label htmlFor="deviceOs">디바이스 OS</label>
                                    <input
                                        id="deviceOs"
                                        name="deviceOs"
                                        value={form.deviceOs}
                                        onChange={handleChange}
                                        placeholder="예: Android / Windows"
                                    />
                                </div>

                                <div className="tx-form__group">
                                    <label htmlFor="deviceId">디바이스 ID</label>
                                    <input
                                        id="deviceId"
                                        name="deviceId"
                                        value={form.deviceId}
                                        onChange={handleChange}
                                        placeholder="예: DEV-0001"
                                    />
                                </div>

                                <div className="tx-form__group">
                                    <label htmlFor="ipAddress">IP 주소</label>
                                    <input
                                        id="ipAddress"
                                        name="ipAddress"
                                        value={form.ipAddress}
                                        onChange={handleChange}
                                        placeholder="예: 192.168.0.1"
                                    />
                                </div>
                            </div>

                            <div className="tx-form__notice">
                                <span className="required">*</span> 표시는 필수 입력 항목입니다.
                            </div>

                            <div className="tx-form__buttons">
                                <button
                                    type="button"
                                    className="tx-form__analyze"
                                    onClick={handleAiAnalyze}
                                >
                                    AI 분석 요청
                                </button>
                                <button type="submit" className="tx-form__submit">
                                    거래 데이터 입력
                                </button>
                            </div>
                        </form>
                    </section>

                    {/* ── 오른쪽: AI 결과 ── */}
                    <section className="tx-right-panel">
                        <div className="right-card">
                            <h3 className="right-card__title">AI 분석 결과</h3>

                            {!aiResult.visible ? (
                                <div className="empty-box">아직 분석 결과가 없습니다.</div>
                            ) : aiResult.loading ? (
                                <div className="empty-box">AI 분석 중입니다...</div>
                            ) : aiResult.error ? (
                                <div className="error-box">{aiResult.error}</div>
                            ) : (
                                <div className="ai-result-box__summary">
                                    <p>
                                        <strong>분석 결과:</strong>{" "}
                                        <span
                                            className={
                                                aiResult.isFraud === 1
                                                    ? "ai-result-box__badge ai-result-box__badge--danger"
                                                    : "ai-result-box__badge ai-result-box__badge--safe"
                                            }
                                        >
                                            {aiResult.resultText}
                                        </span>
                                    </p>
                                    <p>
                                        <strong>사기 확률:</strong>{" "}
                                        <span style={{
                                            color: aiResult.isFraud === 1 ? "#e74c3c" : "#27ae60",
                                            fontWeight: "bold"
                                        }}>
                                            {aiResult.fraudProbability}%
                                        </span>
                                    </p>
                                    <div className="ai-result-box__report">
                                        <h4>예측 근거 시각화 (SHAP)</h4>
                                        {aiResult.shapImage ? (
                                            <img
                                                src={`data:image/png;base64,${aiResult.shapImage}`}
                                                alt="SHAP 분석 결과"
                                                style={{ width: "100%", borderRadius: "6px" }}
                                            />
                                        ) : (
                                            <div className="ai-result-box__placeholder">
                                                SHAP 이미지 없음
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default TxDataInputPage;
