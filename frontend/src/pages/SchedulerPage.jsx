import { useState } from "react";
import AttendancePanel from "../components/scheduler/AttendancePanel";
import CalendarSection from "../components/scheduler/CalendarSection";
import AttendanceLogModal from "../components/scheduler/AttendanceLogModal";
import EventModal from "../components/scheduler/EventModal";
import "../styles/SchedulerPage.css";

function SchedulerPage() {
    const [showLogModal, setShowLogModal] = useState(false);
    const [showEventModal, setShowEventModal] = useState(false);

    return (
        <div className="scheduler-page">
            <h2>캘린더 / 근태관리</h2>

            <AttendancePanel onOpenLog={() => setShowLogModal(true)} />

            <CalendarSection onOpenEvent={() => setShowEventModal(true)} />

            {showLogModal && (
                <AttendanceLogModal onClose={() => setShowLogModal(false)} />
            )}

            {showEventModal && (
                <EventModal onClose={() => setShowEventModal(false)} />
            )}
        </div>
    );
}

export default SchedulerPage;