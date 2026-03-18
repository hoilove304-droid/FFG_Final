function EventModal({ onClose }) {
    return (
        <div className="modal">
            <div className="modal-content">
                <h3>일정 등록</h3>

                <input placeholder="제목" />
                <input type="date" />
                <textarea placeholder="내용" />

                <button>저장</button>
                <button onClick={onClose}>닫기</button>
            </div>
        </div>
    );
}

export default EventModal;