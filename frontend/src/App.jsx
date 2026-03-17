import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import BankDashboardPage from "./pages/BankDashboardPage.jsx";
import TxDataInputPage from "./pages/TxDataInputPage.jsx";
import CustomerDetailPage from "./pages/CustomerDetailPage.jsx";
import AppLayout from "./components/layout/AppLayout.jsx";
import ProtectedRoute from "./router/ProtectedRoute.jsx";
import BankRoute from "./router/BankRoute.jsx";
import CustomerRoute from "./router/CustomerRoute.jsx";

function ErrorBoardPage() {
    return <div>분석의뢰 게시판</div>;
}

function NoticeBoardPage() {
    return <div>공지사항 게시판</div>;
}

function CommunityBoardPage() {
    return <div>커뮤니티 게시판</div>;
}

function FaqBoardPage() {
    return <div>FAQ 게시판</div>;
}

function SchedulerPage() {
    return <div>근무스케줄표 페이지</div>;
}

function App() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />

            <Route element={<AppLayout />}>
                <Route
                    path="/admin"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <AdminDashboardPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/admin/tx-input"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <TxDataInputPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/bank/:bankCode"
                    element={
                        <BankRoute>
                            <BankDashboardPage />
                        </BankRoute>
                    }
                />

                <Route
                    path="/bank/:bankCode/customer/:userId/tx/:txId"
                    element={
                        <CustomerRoute>
                            <CustomerDetailPage />
                        </CustomerRoute>
                    }
                />

                <Route
                    path="/board/error"
                    element={
                        <ProtectedRoute allowedRoles={["admin", "bank"]}>
                            <ErrorBoardPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/board/notice"
                    element={
                        <ProtectedRoute allowedRoles={["admin", "bank"]}>
                            <NoticeBoardPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/board/community"
                    element={
                        <ProtectedRoute allowedRoles={["admin", "bank"]}>
                            <CommunityBoardPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/board/faq"
                    element={
                        <ProtectedRoute allowedRoles={["admin", "bank"]}>
                            <FaqBoardPage />
                        </ProtectedRoute>
                    }
                />

                <Route
                    path="/scheduler"
                    element={
                        <ProtectedRoute allowedRoles={["admin"]}>
                            <SchedulerPage />
                        </ProtectedRoute>
                    }
                />
            </Route>
        </Routes>
    );
}

export default App;