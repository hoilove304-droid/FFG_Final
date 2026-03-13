import { Navigate, useParams } from "react-router-dom";

function BankRoute({ children }) {
    const role = localStorage.getItem("role");
    const myBankCode = localStorage.getItem("bankCode");
    const { bankCode } = useParams();

    if (!role) {
        return <Navigate to="/" replace />;
    }

    // 관리자는 모든 은행 대시보드 접근 가능
    if (role === "admin") {
        return children;
    }

    // 은행 사용자는 자기 은행 코드만 접근 가능
    if (role === "bank" && myBankCode === bankCode) {
        return children;
    }

    // 그 외는 차단
    return <Navigate to="/" replace />;
}

export default BankRoute;