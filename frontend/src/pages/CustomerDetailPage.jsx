import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchCustomerDetail } from "../services/bankApi.js";
import "../styles/CustomerDetailPage.css";

function CustomerDetailPage() {
    const navigate = useNavigate();
    const { bankCode, userId, txId } = useParams();

    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const bankNameMap = {
        "01": "관리자",
        "02": "하나은행",
        "03": "우리은행",
        "04": "카카오뱅크",
        "05": "국민은행",
        "06": "토스뱅크",
        "07": "MG새마을금고",
        "08": "IBK기업은행",
        "09": "신한은행",
    };

    useEffect(() => {
        let isMounted = true;

        async function loadDetail() {
            try {
                setLoading(true);
                setError("");

                const data = await fetchCustomerDetail(bankCode, userId, txId);

                if (isMounted) {
                    setDetail(data);
                }
            } catch (err) {
                console.error(err);
                if (isMounted) {
                    setError("고객 상세 데이터를 불러오지 못했습니다.");
                }
            } finally {
                if (isMounted) {
                    setLoading(false);
                }
            }
        }

        loadDetail();

        return () => {
            isMounted = false;
        };
    }, [bankCode, userId, txId]);

    if (loading) {
        return <div className="customer-detail-page">불러오는 중...</div>;
    }

    if (error) {
        return <div className="customer-detail-page error-text">{error}</div>;
    }

    if (!detail || !detail.customer) {
        return <div className="customer-detail-page">조회된 고객 정보가 없습니다.</div>;
    }

    const { customer, currentTransaction, recentTransactions } = detail;

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

                <button
                    type="button"
                    className="back_btn"
                    onClick={() => navigate(`/bank/${bankCode}`)}
                >
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
                            <th>거래ID</th>
                            <th>고객ID</th>
                            <th>거래금액</th>
                            <th>거래일시</th>
                            <th>거래채널</th>
                            <th>거래유형</th>
                            <th>기기유형</th>
                            <th>기기OS</th>
                            <th>거래위치</th>
                            <th>IP</th>
                            <th>위험점수</th>
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
                        </tbody>
                    </table>
                </div>

                <div className="detail_card">
                    <h3>이상 거래 점수</h3>
                    <div className="score_grid">
                        <div className="score_box">
                            <span>거래시간 이상 점수</span>
                            <strong>{detail.score?.timeScore ?? 0}점</strong>
                        </div>
                        <div className="score_box">
                            <span>거래금액 이상 점수</span>
                            <strong>{detail.score?.amountScore ?? 0}점</strong>
                        </div>
                        <div className="score_box">
                            <span>거래지역 이상 점수</span>
                            <strong>{detail.score?.locationScore ?? 0}점</strong>
                        </div>
                        <div className="score_box">
                            <span>기기 이상 점수</span>
                            <strong>{detail.score?.deviceScore ?? 0}점</strong>
                        </div>
                        <div className="score_box total">
                            <span>총점</span>
                            <strong>{detail.score?.totalScore ?? 0}점</strong>
                        </div>
                    </div>
                </div>
            </div>

            <div className="detail_section">
                <h3>최근 거래 이력</h3>
                <div className="table_wrap recent_table_wrap ">
                    <table>
                        <thead>
                        <tr>
                            <th>거래ID</th>
                            <th>거래유형</th>
                            <th>거래금액</th>
                            <th>거래채널</th>
                            <th>거래위치</th>
                            <th>거래일시</th>
                            <th>위험점수</th>
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
                            <tr>
                                <td colSpan="7">최근 거래 이력이 없습니다.</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default CustomerDetailPage;