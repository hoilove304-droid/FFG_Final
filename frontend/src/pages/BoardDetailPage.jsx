import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBoardConfig } from "../constants/boardConfig";
import { deleteBoard, fetchBoardDetail } from "../services/boardApi";
import "../styles/BoardPage.css";

function BoardDetailPage() {
    const { boardKey, boardNo } = useParams();
    const navigate = useNavigate();
    const config = getBoardConfig(boardKey);

    const memberId = localStorage.getItem("memberId") || "";
    const role = localStorage.getItem("role") || "";

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [detail, setDetail] = useState(null);
    const [deleteLoading, setDeleteLoading] = useState(false);

    useEffect(() => {
        if (!config) {
            setError("잘못된 게시판 경로입니다.");
            setLoading(false);
            return;
        }

        const loadDetail = async () => {
            try {
                setLoading(true);
                setError("");

                const result = await fetchBoardDetail({
                    boardNo,
                    increaseReadcnt: true,
                });

                if (!result) {
                    setError("게시글을 찾을 수 없습니다.");
                    return;
                }

                setDetail(result);
            } catch (err) {
                setError(err.message || "게시글 상세 정보를 불러오지 못했습니다.");
            } finally {
                setLoading(false);
            }
        };

        loadDetail();
    }, [boardNo, config]);

    if (!config) {
        return (
            <div className="board_page">
                <div className="board_card">존재하지 않는 게시판입니다.</div>
            </div>
        );
    }

    const canEditOrDelete =
        detail && (role === "admin" || detail.writerId === memberId);

    const handleDelete = async () => {
        if (!detail) return;

        const ok = window.confirm("정말 삭제하시겠습니까?");
        if (!ok) return;

        try {
            setDeleteLoading(true);

            const result = await deleteBoard(
                detail.boardNo,
                config.boardType,
                memberId,
                role
            );

            if (!result.success) {
                alert(result.message || "삭제에 실패했습니다.");
                return;
            }

            alert("삭제되었습니다.");
            navigate(`/board/${boardKey}`);
        } catch (err) {
            alert(err.message || "삭제 중 오류가 발생했습니다.");
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <div className="board_page">
            <div className="board_card">
                {loading ? (
                    <div className="board_empty">게시글을 불러오는 중입니다.</div>
                ) : error ? (
                    <div className="board_empty error">{error}</div>
                ) : !detail ? (
                    <div className="board_empty">게시글이 없습니다.</div>
                ) : (
                    <>
                        <div className="board_detail_header">
                            <div className="board_detail_top">
                                <h1 className="board_title">{detail.title}</h1>
                            </div>

                            <div className="board_detail_meta">
                                <span>작성자: {detail.writerId || "-"}</span>
                                <span>등록일: {detail.regdte || "-"}</span>
                                <span>조회수: {detail.readcnt ?? 0}</span>
                            </div>
                        </div>

                        <div className="board_detail_content">
                            {detail.content || ""}
                        </div>

                        <div className="board_detail_actions">
                            <button
                                type="button"
                                className="board_cancel_btn"
                                onClick={() => navigate(`/board/${boardKey}`)}
                            >
                                목록으로
                            </button>

                            {canEditOrDelete && (
                                <>
                                    <button
                                        type="button"
                                        className="board_edit_btn"
                                        onClick={() => navigate(`/board/${boardKey}/${boardNo}/edit`)}
                                    >
                                        수정
                                    </button>
                                    <button
                                        type="button"
                                        className="board_delete_btn"
                                        onClick={handleDelete}
                                        disabled={deleteLoading}
                                    >
                                        {deleteLoading ? "삭제 중..." : "삭제"}
                                    </button>
                                </>
                            )}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default BoardDetailPage;