const BASE_URL = "http://localhost:8080/api/attendance";

export async function fetchAttendanceStatus(userId) {
    const response = await fetch(`${BASE_URL}/status?userId=${encodeURIComponent(userId)}`);

    if (!response.ok) {
        throw new Error("출퇴근 상태 조회 실패");
    }

    return await response.json();
}

export async function checkIn(userId) {
    const response = await fetch(`${BASE_URL}/checkin`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(result.message || "출근 처리 실패");
    }

    return result;
}

export async function checkOut(userId) {
    const response = await fetch(`${BASE_URL}/checkout`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ userId }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(result.message || "퇴근 처리 실패");
    }

    return result;
}

export async function fetchAttendanceLogs() {
    const response = await fetch(`${BASE_URL}/logs`);

    if (!response.ok) {
        throw new Error("출퇴근 로그 조회 실패");
    }

    return await response.json();
}