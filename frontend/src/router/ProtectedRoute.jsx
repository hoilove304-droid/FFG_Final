import { Navigate } from "react-router-dom";

function ProtectedRoute({ allowedRoles, children }) {
    const role = localStorage.getItem("role");

    if (!role) {
        return <Navigate to="/" replace />;
    }

    if (!allowedRoles.includes(role)) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;