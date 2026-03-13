import { Navigate, useParams } from "react-router-dom";

function CustomerRoute({ children }) {
    const role = localStorage.getItem("role");
    const myBankCode = localStorage.getItem("bankCode");
    const { bankCode } = useParams();

    if (!role) {
        return <Navigate to="/" replace />;
    }

    // 관리자는 모든 고객 상세 가능
    if (role === "admin") {
        return children;
    }

    // 은행 사용자는 자기 은행 코드와 URL bankCode가 같아야만 가능
    if (role === "bank" && myBankCode === bankCode) {
        return children;
    }

    return <Navigate to="/" replace />;
}

export default CustomerRoute;