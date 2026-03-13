import { useParams } from "react-router-dom";

function BankDashboardPage() {
    const { bankCode } = useParams();

    return (
        <div>
            <h1>은행 대시보드</h1>
            <p>은행 코드: {bankCode}</p>
        </div>
    );
}

export default BankDashboardPage;