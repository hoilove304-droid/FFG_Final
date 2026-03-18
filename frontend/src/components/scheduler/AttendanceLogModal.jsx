import { useEffect, useState } from "react";
import { fetchAttendanceLogs } from "../../services/attendanceApi";

function AttendanceLogModal({ onClose }) {
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const loadLogs = async () => {
            try {
                const data = await fetchAttendanceLogs();
                setLogs(data.logs || []);
            } catch (error) {
                console.error(error);
                alert("근태 로그를 불러오지 못했습니다.");
            }
        };

        loadLogs();
    }, []);

    return (
        <div className="modal">
            <div className="modal-content">
                <h3>근태 로그</h3>

                <ul>
                    {logs.map((log, index) => (
                        <li key={index}>
                            [{log.userId}] {log.type} - {log.time}
                        </li>
                    ))}
                </ul>

                <button onClick={onClose}>닫기</button>
            </div>
        </div>
    );
}

export default AttendanceLogModal;