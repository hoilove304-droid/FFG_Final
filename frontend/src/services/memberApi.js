const BASE_URL = "http://localhost:8080/api";

export async function createMember(memberData) {
    const response = await fetch(`${BASE_URL}/members`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(memberData),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "사용자 추가 요청 실패");
    }

    return data;
}