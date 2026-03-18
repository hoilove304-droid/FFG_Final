import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiUrl } from "../services/api";
import "../styles/TxDataInputPage.css";

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
        error: "",
    });

    const [txList, setTxList] = useState([]);

    useEffect(() => {
        fetchRecentTxData();
    }, []);

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

    const getBankName = (bankCode) => {
        switch (bankCode) {
            case "01":
                return "관리자";
            case "02":
                return "하나은행";
            case "03":
                return "우리은행";
            case "04":
                return "카카오뱅크";
            default:
                return "-";
        }
    };

    const getTxTypeLabel = (txType) => {
        switch (txType) {
            case "TRANSFER":
                return "이체";
            case "WITHDRAW":
                return "출금";
            case "DEPOSIT":
                return "입금";
            case "PAYMENT":
                return "결제";
            default:
                return txType;
        }
    };

    const formatAmount = (amount) => Number(amount).toLocaleString("ko-KR");

    const formatDateTime = (value) => {
        if (!value) return "";
        return value.replace("T", " ");
    };

    const formatDateTimeForList = (value) => {
        if (!value) return "";

        const date = new Date(value);

        if (isNaN(date.getTime())) {
            return String(value).replace("T", " ");
        }

        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        const hh = String(date.getHours()).padStart(2, "0");
        const mi = String(date.getMinutes()).padStart(2, "0");

        return `${yyyy}-${mm}-${dd} ${hh}:${mi}`;
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

    const fetchRecentTxData = async () => {
        try {
            const response = await fetch(apiUrl("/api/tx/recent"));

            if (!response.ok) {
                throw new Error("최근 거래 데이터 조회 실패");
            }

            const data = await response.json();

            const mapped = data.map((item) => ({
                txId: item.txId,
                userId: item.userId,
                bankName: getBankName(item.bankCode),
                txType: getTxTypeLabel(item.txType),
                txAmount: formatAmount(item.txAmount),
                txDatetime: formatDateTimeForList(item.txDatetime),
            }));

            setTxList(mapped);
        } catch (error) {
            console.error("최근 거래 데이터 불러오기 오류:", error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;

        try {
            const response = await fetch(apiUrl("/api/tx"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    userId: form.userId,
                    bankCode: form.bankCode,
                    txChannel: form.txChannel,
                    txType: form.txType,
                    txAmount: Number(form.txAmount),
                    txDatetime: form.txDatetime,
                    txCountry: form.txCountry,
                    txLocation: form.txLocation,
                    deviceType: form.deviceType,
                    deviceOs: form.deviceOs,
                    deviceId: form.deviceId,
                    ipAddress: form.ipAddress,
                }),
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || "거래 데이터 저장 실패");
            }

            alert("거래 데이터가 DB에 저장되었습니다.");
            resetForm();
            fetchRecentTxData();
        } catch (error) {
            console.error("거래 데이터 저장 오류:", error);
            alert(error.message || "거래 데이터 저장 중 오류가 발생했습니다.");
        }
    };

    const handleAiAnalyze = async () => {
        if (!validateForm()) return;

        setAiResult({
            visible: true,
            loading: true,
            resultText: "",
            isFraud: null,
            fraudProbability: null,
            shapImage: "",
            error: "",
        });

        try {
            await new Promise((resolve) => setTimeout(resolve, 800));

            const amount = Number(form.txAmount);
            const country = (form.txCountry || "").toUpperCase();

            const suspicious =
                amount >= 3000000 ||
                country === "RU" ||
                country === "NG" ||
                form.txChannel === "ATM";

            setAiResult({
                visible: true,
                loading: false,
                resultText: suspicious ? "사기 의심 거래" : "정상 거래",
                isFraud: suspicious ? 1 : 0,
                fraudProbability: suspicious ? 87.4 : 14.8,
                shapImage: "",
                error: "",
            });
        } catch (error) {
            setAiResult({
                visible: true,
                loading: false,
                resultText: "",
                isFraud: null,
                fraudProbability: null,
                shapImage: "",
                error: "분석 요청 중 오류가 발생했습니다.",
            });
        }
    };

    const handleGoBack = () => {
        navigate("/admin");
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
                        onClick={handleGoBack}
                    >
                        돌아가기
                    </button>
                </div>

                <div className="tx-layout">
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

                    <section className="tx-right-panel">
                        <div className="right-card">
                            <h3 className="right-card__title">AI 분석 결과</h3>

                            {!aiResult.visible ? (
                                <div className="empty-box">아직 분석 결과가 없습니다.</div>
                            ) : aiResult.loading ? (
                                <div className="empty-box">분석 중입니다...</div>
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
                                        <strong>사기 확률:</strong> {aiResult.fraudProbability}%
                                    </p>
                                    <div className="ai-result-box__report">
                                        <h4>예측 근거 시각화</h4>
                                        <div className="ai-result-box__placeholder">
                                            SHAP 이미지가 아직 없습니다.
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <div className="right-card">
                            <h3 className="right-card__title">최근 입력 데이터 (5건)</h3>
                            <div className="tx-table-wrap fixed-table">
                                <table className="tx-table">
                                    <thead>
                                    <tr>
                                        <th>거래 ID</th>
                                        <th>사용자 ID</th>
                                        <th>은행</th>
                                        <th>유형</th>
                                        <th>금액</th>
                                        <th>시간</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {txList.length > 0 ? (
                                        txList.slice(0, 5).map((tx) => (
                                            <tr key={tx.txId}>
                                                <td>{tx.txId}</td>
                                                <td>{tx.userId}</td>
                                                <td>{tx.bankName}</td>
                                                <td>{tx.txType}</td>
                                                <td>{tx.txAmount}</td>
                                                <td>{tx.txDatetime}</td>
                                            </tr>
                                        ))
                                    ) : (
                                        <tr>
                                            <td colSpan="6" className="tx-table__empty">
                                                데이터가 없습니다.
                                            </td>
                                        </tr>
                                    )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default TxDataInputPage;