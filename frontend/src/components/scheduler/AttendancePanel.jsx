import { useEffect, useState } from "react";
import {
    fetchAttendanceStatus,
    checkIn,
    checkOut,
} from "../../services/attendanceApi";

function AttendancePanel({ onOpenLog }) {
    const [status, setStatus] = useState({
        checkedIn: false,
        checkedOut: false,
        checkinTime: null,
        checkoutTime: null,
    });
    const [loading, setLoading] = useState(false);

    const memberId = localStorage.getItem("memberId") || "";

    const loadStatus = async () => {
        if (!memberId) return;

        try {
            const data = await fetchAttendanceStatus(memberId);
            setStatus(data);
        } catch (error) {
            console.error(error);
            alert("출퇴근 상태를 불러오지 못했습니다.");
        }
    };

    useEffect(() => {
        loadStatus();
    }, []);

    const handleCheckIn = async () => {
        try {
            setLoading(true);
            await checkIn(memberId);
            await loadStatus();
            alert("출근 처리되었습니다.");
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleCheckOut = async () => {
        try {
            setLoading(true);
            await checkOut(memberId);
            await loadStatus();
            alert("퇴근 처리되었습니다.");
        } catch (error) {
            alert(error.message);
        } finally {
            setLoading(false);
        }
    };

    const statusText = !status.checkedIn
        ? "미출근"
        : status.checkedOut
            ? "퇴근 완료"
            : "근무중";

    return (
        <div className="attendance-panel">
            <button
                onClick={handleCheckIn}
                disabled={loading || status.checkedIn}
            >
                출근하기
            </button>

            <button
                onClick={handleCheckOut}
                disabled={loading || !status.checkedIn || status.checkedOut}
            >
                퇴근하기
            </button>

            <button onClick={onOpenLog}>
                근태 로그 보기
            </button>

            <p>
                현재 상태: {statusText}
                {status.checkinTime && ` / 출근 ${status.checkinTime}`}
                {status.checkoutTime && ` / 퇴근 ${status.checkoutTime}`}
            </p>
        </div>
    );
}

export default AttendancePanel;