import { useParams } from "react-router-dom";

function CustomerDetailPage() {
    const { bankCode, userId } = useParams();

    return (
        <div>
            <h1>고객 상세 페이지</h1>
            <p>은행 코드: {bankCode}</p>
            <p>고객 ID: {userId}</p>
        </div>
    );
}

export default CustomerDetailPage;