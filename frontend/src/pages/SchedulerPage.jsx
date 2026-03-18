import { useState } from "react";
import AttendancePanel from "../components/scheduler/AttendancePanel";
import CalendarSection from "../components/scheduler/CalendarSection";
import AttendanceLogModal from "../components/scheduler/AttendanceLogModal";
import EventModal from "../components/scheduler/EventModal";
import "../styles/SchedulerPage.css";

function SchedulerPage() {
    const [showLogModal, setShowLogModal] = useState(false);
    const [showEventModal, setShowEventModal] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const [reloadSchedules, setReloadSchedules] = useState(() => () => {});

    const handleOpenEventModal = ({ selectedDate, selectedEvent, reloadSchedules }) => {
        setSelectedDate(selectedDate || null);
        setSelectedEvent(selectedEvent || null);
        setReloadSchedules(() => reloadSchedules || (() => {}));
        setShowEventModal(true);
    };

    const handleCloseEventModal = () => {
        setShowEventModal(false);
        setSelectedDate(null);
        setSelectedEvent(null);
    };

    return (
        <div className="scheduler-page">
            <h2>캘린더 / 근태관리</h2>

            <AttendancePanel onOpenLog={() => setShowLogModal(true)} />

            <CalendarSection onOpenEvent={handleOpenEventModal} />

            {showLogModal && (
                <AttendanceLogModal onClose={() => setShowLogModal(false)} />
            )}

            {showEventModal && (
                <EventModal
                    onClose={handleCloseEventModal}
                    selectedDate={selectedDate}
                    selectedEvent={selectedEvent}
                    onSaved={reloadSchedules}
                />
            )}
        </div>
    );
}

export default SchedulerPage;