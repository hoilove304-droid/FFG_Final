import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import "../../styles/Reset.css";
import "../../styles/Layout.css";

function AppLayout(){
    return(
        <div className="app_container">
            <Sidebar />

            <main className="content">
                <Outlet />
            </main>
        </div>
    );
}

export default AppLayout;