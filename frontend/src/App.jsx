import { Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";
import BankDashboardPage from "./pages/BankDashboardPage.jsx";
import TxDataInputPage from "./pages/TxDataInputPage.jsx";
import CustomerDetailPage from "./pages/CustomerDetailPage.jsx";

function App() {
    return (
        <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/admin" element={<AdminDashboardPage />} />
            <Route path="/bank/:bankCode" element={<BankDashboardPage />} />
            <Route path="/admin/tx-input" element={<TxDataInputPage />} />
            <Route path="/bank/customer/:userId" element={<CustomerDetailPage />} />
        </Routes>
    );
}

export default App;