import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import BankDashboardPage from "./pages/BankDashboardPage.jsx";
import TxDataInputPage from "./pages/TxDataInputPage.jsx";
import CustomerDetailPage from "./pages/CustomerDetailPage.jsx";
import BoardListPage from "./pages/BoardListPage.jsx";
import BoardWritePage from "./pages/BoardWritePage.jsx";
import BoardDetailPage from "./pages/BoardDetailPage.jsx";
import BoardEditPage from "./pages/BoardEditPage.jsx";
import SchedulerPage from "./pages/SchedulerPage.jsx";
import AppLayout from "./components/layout/AppLayout.jsx";
import ProtectedRoute from "./router/ProtectedRoute.jsx";
import BankRoute from "./router/BankRoute.jsx";
import CustomerRoute from "./router/CustomerRoute.jsx";

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
                    path="/board/:boardKey"
                    element={
                        <ProtectedRoute allowedRoles={["admin", "bank"]}>
                            <BoardListPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/board/:boardKey/write"
                    element={
                        <ProtectedRoute allowedRoles={["admin", "bank"]}>
                            <BoardWritePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/board/:boardKey/:boardNo/edit"
                    element={
                        <ProtectedRoute allowedRoles={["admin", "bank"]}>
                            <BoardEditPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/board/:boardKey/:boardNo"
                    element={
                        <ProtectedRoute allowedRoles={["admin", "bank"]}>
                            <BoardDetailPage />
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