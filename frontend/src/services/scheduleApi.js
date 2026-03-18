import { apiUrl } from "./api";

export async function fetchSchedules(userId) {
    const response = await fetch(
        apiUrl(`/api/schedules?userId=${encodeURIComponent(userId)}`)
    );

    if (!response.ok) {
        throw new Error("일정 목록 조회 실패");
    }

    return await response.json();
}

export async function fetchScheduleDetail(scheduleId) {
    const response = await fetch(
        apiUrl(`/api/schedules/${scheduleId}`)
    );

    if (!response.ok) {
        throw new Error("일정 상세 조회 실패");
    }

    return await response.json();
}

export async function createSchedule(scheduleData) {
    const response = await fetch(apiUrl("/api/schedules"), {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(scheduleData),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(result.message || "일정 등록 실패");
    }

    return result;
}

export async function updateSchedule(scheduleId, scheduleData) {
    const response = await fetch(
        apiUrl(`/api/schedules/${scheduleId}`),
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(scheduleData),
        }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(result.message || "일정 수정 실패");
    }

    return result;
}

export async function deleteSchedule(scheduleId) {
    const response = await fetch(
        apiUrl(`/api/schedules/${scheduleId}`),
        {
            method: "DELETE",
        }
    );

    const result = await response.json();

    if (!response.ok || !result.success) {
        throw new Error(result.message || "일정 삭제 실패");
    }

    return result;
}