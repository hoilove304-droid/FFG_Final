import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar.jsx";
import "../../styles/reset.css";
import "../../styles/layout.css";

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