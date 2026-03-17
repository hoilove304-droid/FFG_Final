const BASE_URL = "http://localhost:8080/api";

export async function fetchCustomerDetail(bankCode, userId, txId) {
    const response = await fetch(
        `${BASE_URL}/bank/${bankCode}/customer/${userId}/tx/${txId}`
    );

    if (!response.ok) {
        throw new Error("고객 상세 조회 실패");
    }

    return response.json();
}