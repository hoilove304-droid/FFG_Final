import { useEffect, useState } from "react";
import {
    createSchedule,
    updateSchedule,
    deleteSchedule,
} from "../../services/scheduleApi";

function EventModal({
                        onClose,
                        selectedEvent,
                        selectedDate,
                        onSaved,
                    }) {
    const memberId = localStorage.getItem("memberId") || "";

    const [form, setForm] = useState({
        title: "",
        content: "",
        startDate: "",
        endDate: "",
        allDay: "N",
    });

    const isEditMode = !!selectedEvent;

    useEffect(() => {
        if (selectedEvent) {
            setForm({
                title: selectedEvent.title || "",
                content: selectedEvent.content || "",
                startDate: formatForDatetimeLocal(selectedEvent.startDate),
                endDate: formatForDatetimeLocal(selectedEvent.endDate),
                allDay: selectedEvent.allDay || "N",
            });
            return;
        }

        if (selectedDate) {
            const start = `${selectedDate}T09:00`;
            const end = `${selectedDate}T10:00`;

            setForm({
                title: "",
                content: "",
                startDate: start,
                endDate: end,
                allDay: "N",
            });
        }
    }, [selectedEvent, selectedDate]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleAllDayChange = (e) => {
        const checked = e.target.checked;

        if (checked) {
            const startOnlyDate = form.startDate ? form.startDate.slice(0, 10) : selectedDate || "";
            const endOnlyDate = form.endDate ? form.endDate.slice(0, 10) : selectedDate || "";

            setForm((prev) => ({
                ...prev,
                allDay: "Y",
                startDate: startOnlyDate ? `${startOnlyDate}T00:00` : "",
                endDate: endOnlyDate ? `${endOnlyDate}T23:59` : "",
            }));
        } else {
            const startOnlyDate = form.startDate ? form.startDate.slice(0, 10) : selectedDate || "";
            const endOnlyDate = form.endDate ? form.endDate.slice(0, 10) : selectedDate || "";

            setForm((prev) => ({
                ...prev,
                allDay: "N",
                startDate: startOnlyDate ? `${startOnlyDate}T09:00` : "",
                endDate: endOnlyDate ? `${endOnlyDate}T10:00` : "",
            }));
        }
    };

    const handleSave = async () => {
        try {
            if (!memberId) {
                alert("로그인 사용자 정보가 없습니다.");
                return;
            }

            if (!form.title.trim()) {
                alert("제목을 입력해주세요.");
                return;
            }

            if (!form.startDate || !form.endDate) {
                alert("시작일시와 종료일시를 입력해주세요.");
                return;
            }

            const payload = {
                userId: memberId,
                title: form.title,
                content: form.content,
                startDate: toApiDateTime(form.startDate),
                endDate: toApiDateTime(form.endDate),
                allDay: form.allDay,
            };

            if (isEditMode) {
                await updateSchedule(selectedEvent.scheduleId, payload);
                alert("일정이 수정되었습니다.");
            } else {
                await createSchedule(payload);
                alert("일정이 등록되었습니다.");
            }

            onSaved();
            onClose();
        } catch (error) {
            alert(error.message);
        }
    };

    const handleDelete = async () => {
        try {
            if (!selectedEvent?.scheduleId) return;

            const confirmed = window.confirm("이 일정을 삭제하시겠습니까?");
            if (!confirmed) return;

            await deleteSchedule(selectedEvent.scheduleId);
            alert("일정이 삭제되었습니다.");

            onSaved();
            onClose();
        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <div className="modal">
            <div className="modal-content">
                <h3>{isEditMode ? "일정 수정" : "일정 등록"}</h3>

                <input
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="제목"
                />

                <textarea
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    placeholder="내용"
                />

                <label className="event-all-day">
                    <input
                        type="checkbox"
                        checked={form.allDay === "Y"}
                        onChange={handleAllDayChange}
                    />
                    종일 일정
                </label>

                <input
                    type="datetime-local"
                    name="startDate"
                    value={form.startDate}
                    onChange={handleChange}
                />

                <input
                    type="datetime-local"
                    name="endDate"
                    value={form.endDate}
                    onChange={handleChange}
                />

                <div className="event-modal-buttons">
                    <button onClick={handleSave}>
                        {isEditMode ? "수정" : "저장"}
                    </button>

                    {isEditMode && (
                        <button type="button" onClick={handleDelete}>
                            삭제
                        </button>
                    )}

                    <button type="button" onClick={onClose}>
                        닫기
                    </button>
                </div>
            </div>
        </div>
    );
}

function formatForDatetimeLocal(value) {
    if (!value) return "";
    return value.slice(0, 16);
}

function toApiDateTime(value) {
    if (!value) return "";
    return value.length === 16 ? `${value}:00` : value;
}

export default EventModal;