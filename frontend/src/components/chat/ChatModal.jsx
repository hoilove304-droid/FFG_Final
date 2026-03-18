import { useEffect, useRef, useState } from "react";
import { apiUrl } from "../../services/api";
import "../../styles/ChatModal.css";

function ChatModal({ onClose }) {
    const [friends, setFriends] = useState([]);
    const [selectedFriend, setSelectedFriend] = useState(null);
    const [messages, setMessages] = useState([]);
    const [inputMessage, setInputMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [messageLoading, setMessageLoading] = useState(false);
    const [sending, setSending] = useState(false);
    const [error, setError] = useState("");
    const [messageError, setMessageError] = useState("");

    const memberId = localStorage.getItem("memberId") || "";
    const messageAreaRef = useRef(null);

    const fetchChatUsers = async (showLoading = false) => {
        try {
            if (showLoading) {
                setLoading(true);
            }
            setError("");

            const response = await fetch(
                apiUrl(`/api/chat/users?memberId=${memberId}`)
            );

            if (!response.ok) {
                throw new Error("친구 목록 조회 실패");
            }

            const data = await response.json();

            setFriends((prev) => {
                const prevJson = JSON.stringify(prev);
                const nextJson = JSON.stringify(data);
                return prevJson === nextJson ? prev : data;
            });

            if (data.length > 0) {
                setSelectedFriend((prev) => {
                    if (!prev) {
                        return data[0];
                    }
                    const matched = data.find((item) => item.memberId === prev.memberId);
                    return matched || data[0];
                });
            } else {
                setSelectedFriend(null);
            }
        } catch (err) {
            setError(err.message || "오류가 발생했습니다.");
        } finally {
            if (showLoading) {
                setLoading(false);
            }
        }
    };

    const fetchChatHistory = async (targetId, isPolling = false) => {
        if (!memberId || !targetId) {
            setMessages([]);
            return;
        }

        try {
            if (!isPolling) {
                setMessageLoading(true);
            }
            setMessageError("");

            const response = await fetch(
                apiUrl(`/api/chat/history?myId=${memberId}&targetId=${targetId}`)
            );

            if (!response.ok) {
                throw new Error("대화 내역 조회 실패");
            }

            const data = await response.json();
            setMessages(data);
        } catch (err) {
            setMessageError(err.message || "대화 내역을 불러오지 못했습니다.");
            if (!isPolling) {
                setMessages([]);
            }
        } finally {
            if (!isPolling) {
                setMessageLoading(false);
            }
        }
    };

    const markMessagesAsRead = async (targetId) => {
        if (!memberId || !targetId) {
            return;
        }

        try {
            await fetch(
                apiUrl(`/api/chat/read?myId=${memberId}&targetId=${targetId}`),
                {
                    method: "POST",
                }
            );
        } catch (err) {
            console.error("읽음 처리 실패:", err);
        }
    };

    useEffect(() => {
        if (memberId) {
            fetchChatUsers(true);
        } else {
            setLoading(false);
            setError("로그인 사용자 정보가 없습니다.");
        }
    }, [memberId]);

    useEffect(() => {
        const run = async () => {
            if (selectedFriend?.memberId) {
                await markMessagesAsRead(selectedFriend.memberId);
                await fetchChatHistory(selectedFriend.memberId);
                await fetchChatUsers(false);
            } else {
                setMessages([]);
            }
        };

        run();
    }, [memberId, selectedFriend?.memberId]);

    useEffect(() => {
        if (!selectedFriend?.memberId || !memberId) {
            return undefined;
        }

        const intervalId = setInterval(async () => {
            await markMessagesAsRead(selectedFriend.memberId);
            await fetchChatHistory(selectedFriend.memberId, true);
            await fetchChatUsers(false);
        }, 2000);

        return () => {
            clearInterval(intervalId);
        };
    }, [memberId, selectedFriend?.memberId]);

    useEffect(() => {
        if (!messageAreaRef.current) {
            return;
        }

        messageAreaRef.current.scrollTop = messageAreaRef.current.scrollHeight;
    }, [messages]);

    const formatSendTime = (sendTime) => {
        if (!sendTime) return "";

        const date = new Date(sendTime);

        if (Number.isNaN(date.getTime())) {
            return "";
        }

        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, "0");
        const day = String(date.getDate()).padStart(2, "0");
        const hours = String(date.getHours()).padStart(2, "0");
        const minutes = String(date.getMinutes()).padStart(2, "0");

        return `${year}-${month}-${day} ${hours}:${minutes}`;
    };

    const handleSendMessage = async () => {
        if (!selectedFriend?.memberId) {
            return;
        }

        const trimmedMessage = inputMessage.trim();

        if (!trimmedMessage) {
            return;
        }

        try {
            setSending(true);

            const response = await fetch(apiUrl("/api/chat/send"), {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    senderId: memberId,
                    receiverId: selectedFriend.memberId,
                    message: trimmedMessage,
                }),
            });

            if (!response.ok) {
                throw new Error("메시지 전송 실패");
            }

            const result = await response.json();

            if (!result.success) {
                throw new Error(result.message || "메시지 전송 실패");
            }

            setInputMessage("");
            await fetchChatHistory(selectedFriend.memberId);
            await fetchChatUsers(false);
        } catch (err) {
            alert(err.message || "메시지 전송 중 오류가 발생했습니다.");
        } finally {
            setSending(false);
        }
    };

    const handleInputKeyDown = async (e) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            await handleSendMessage();
        }
    };

    const handleSelectFriend = async (friend) => {
        setSelectedFriend(friend);
    };

    const truncateMessage = (text) => {
        if (!text) return "대화 내역이 없습니다.";
        return text.length > 22 ? `${text.slice(0, 22)}...` : text;
    };

    return (
        <div className="chat_modal_overlay" onClick={onClose}>
            <div className="chat_modal_panel" onClick={(e) => e.stopPropagation()}>
                <div className="chat_modal_header">
                    <h3>실시간 채팅</h3>
                    <button type="button" className="chat_close_btn" onClick={onClose}>
                        ×
                    </button>
                </div>

                <div className="chat_modal_body">
                    <aside className="chat_friend_list">
                        <div className="chat_friend_list_title">친구 목록</div>

                        {loading && <div className="chat_status_box">불러오는 중...</div>}
                        {error && <div className="chat_status_box error">{error}</div>}

                        {!loading && !error && (
                            <ul>
                                {friends.length === 0 ? (
                                    <li className="chat_empty_friend">표시할 사용자가 없습니다.</li>
                                ) : (
                                    friends.map((friend) => {
                                        const isSelected =
                                            selectedFriend?.memberId === friend.memberId;
                                        const unreadCount = friend.unreadCount || 0;

                                        return (
                                            <li
                                                key={friend.memberId}
                                                className={`chat_friend_item ${
                                                    isSelected ? "selected" : ""
                                                }`}
                                            >
                                                <button
                                                    type="button"
                                                    onClick={() => handleSelectFriend(friend)}
                                                >
                                                    <div className="chat_friend_top">
                                                        <span className="friend_id">
                                                            {friend.memberId}
                                                        </span>
                                                        {unreadCount > 0 && (
                                                            <span className="chat_unread_badge">
                                                                {unreadCount}
                                                            </span>
                                                        )}
                                                    </div>

                                                    <span className="friend_bank">
                                                        권한: {friend.role} / 은행코드: {friend.bankCode}
                                                    </span>

                                                    <span className="chat_last_message">
                                                        {truncateMessage(friend.lastMessage)}
                                                    </span>
                                                </button>
                                            </li>
                                        );
                                    })
                                )}
                            </ul>
                        )}
                    </aside>

                    <section className="chat_room">
                        <div className="chat_room_header">
                            {selectedFriend
                                ? `${selectedFriend.memberId} 님과의 대화`
                                : "대화방"}
                        </div>

                        <div className="chat_message_area" ref={messageAreaRef}>
                            {!selectedFriend ? (
                                <div className="chat_empty_message">
                                    대화할 사용자를 선택해 주세요.
                                </div>
                            ) : messageLoading ? (
                                <div className="chat_empty_message">대화 내역 불러오는 중...</div>
                            ) : messageError ? (
                                <div className="chat_empty_message">{messageError}</div>
                            ) : messages.length === 0 ? (
                                <div className="chat_empty_message">
                                    아직 대화 내역이 없습니다.
                                </div>
                            ) : (
                                messages.map((msg) => (
                                    <div
                                        key={msg.chatId}
                                        className={`chat_message_row ${
                                            msg.senderId === memberId ? "mine" : "other"
                                        }`}
                                    >
                                        <div className="chat_message_content">
                                            <div className="chat_message_bubble">
                                                {msg.message}
                                            </div>
                                            <div className="chat_message_time">
                                                {formatSendTime(msg.sendTime)}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>

                        <div className="chat_input_area">
                            <input
                                type="text"
                                value={inputMessage}
                                onChange={(e) => setInputMessage(e.target.value)}
                                onKeyDown={handleInputKeyDown}
                                placeholder={
                                    selectedFriend
                                        ? `${selectedFriend.memberId} 님에게 메시지 보내기`
                                        : "먼저 친구를 선택하세요."
                                }
                                disabled={!selectedFriend || sending}
                                maxLength={1000}
                            />
                            <button
                                type="button"
                                onClick={handleSendMessage}
                                disabled={!selectedFriend || sending || !inputMessage.trim()}
                            >
                                {sending ? "전송중" : "전송"}
                            </button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

export default ChatModal;