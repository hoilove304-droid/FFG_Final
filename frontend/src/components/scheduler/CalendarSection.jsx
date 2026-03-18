function CalendarSection({ onOpenEvent }) {
    return (
        <div className="calendar-section">
            <div className="calendar-header">
                <button onClick={onOpenEvent}>
                    일정 등록
                </button>
            </div>

            <div className="calendar-box">
                📅 캘린더 자리 (여기에 FullCalendar 들어갈 예정)
            </div>
        </div>
    );
}

export default CalendarSection;