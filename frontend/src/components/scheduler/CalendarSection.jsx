import { useEffect, useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { fetchSchedules } from "../../services/scheduleApi";

function CalendarSection({ onOpenEvent }) {
    const memberId = localStorage.getItem("memberId") || "";
    const [events, setEvents] = useState([]);

    const loadSchedules = async () => {
        try {
            if (!memberId) return;

            const data = await fetchSchedules(memberId);

            const mapped = data.map((item) => ({
                id: String(item.scheduleId),
                title: item.title,
                start: item.startDate,
                end: item.endDate,
                allDay: item.allDay === "Y",
                extendedProps: {
                    scheduleId: item.scheduleId,
                    content: item.content,
                    userId: item.userId,
                    allDay: item.allDay,
                },
            }));

            setEvents(mapped);
        } catch (error) {
            console.error(error);
            alert("일정 목록을 불러오지 못했습니다.");
        }
    };

    useEffect(() => {
        loadSchedules();
    }, []);

    const handleDateClick = (info) => {
        onOpenEvent({
            selectedDate: info.dateStr,
            selectedEvent: null,
            reloadSchedules: loadSchedules,
        });
    };

    const handleEventClick = (info) => {
        onOpenEvent({
            selectedDate: null,
            selectedEvent: {
                scheduleId: Number(info.event.id),
                title: info.event.title,
                content: info.event.extendedProps.content || "",
                startDate: info.event.startStr,
                endDate: info.event.endStr || info.event.startStr,
                allDay: info.event.allDay ? "Y" : "N",
            },
            reloadSchedules: loadSchedules,
        });
    };

    return (
        <div className="calendar-section">
            <div className="calendar-header">
                <button
                    type="button"
                    onClick={() =>
                        onOpenEvent({
                            selectedDate: null,
                            selectedEvent: null,
                            reloadSchedules: loadSchedules,
                        })
                    }
                >
                    일정 등록
                </button>
            </div>

            <div className="calendar-box real-calendar">
                <FullCalendar
                    plugins={[dayGridPlugin, interactionPlugin]}
                    initialView="dayGridMonth"
                    locale="ko"
                    height="auto"
                    events={events}
                    dateClick={handleDateClick}
                    eventClick={handleEventClick}
                    headerToolbar={{
                        left: "prev,next today",
                        center: "title",
                        right: "",
                    }}
                    buttonText={{
                        today: "오늘",
                    }}
                />
            </div>
        </div>
    );
}

export default CalendarSection;