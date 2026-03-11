import { useParams } from "react-router-dom";

function BankDashboardPage() {
    const { bankCode } = useParams();
    return <div>은행 대시보드 - 은행 코드: {bankCode}</div>;
}

export default BankDashboardPage;