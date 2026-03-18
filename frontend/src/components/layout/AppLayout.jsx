import { Outlet } from "react-router-dom";
import { useState } from "react";
import Sidebar from "./Sidebar.jsx";
import ChatModal from "../chat/ChatModal.jsx";
import "../../styles/Reset.css";
import "../../styles/Layout.css";

function AppLayout() {
    const [isChatOpen, setIsChatOpen] = useState(false);

    const openChatModal = () => {
        setIsChatOpen(true);
    };

    const closeChatModal = () => {
        setIsChatOpen(false);
    };

    return (
        <div className="app_container">
            <Sidebar onChatClick={openChatModal} />

            <main className="content">
                <Outlet />
            </main>

            {isChatOpen && <ChatModal onClose={closeChatModal} />}
        </div>
    );
}

export default AppLayout;