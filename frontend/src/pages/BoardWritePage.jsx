import { useState } from "react";
import { useNavigate, useParams, useSearchParams } from "react-router-dom";
import { getBoardConfig } from "../constants/boardConfig";
import { createBoard } from "../services/boardApi";
import "../styles/BoardPage.css";

function BoardWritePage() {
    const { boardKey } = useParams();
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const config = getBoardConfig(boardKey);

    const memberId = localStorage.getItem("memberId") || "";
    const role = localStorage.getItem("role") || "";

    const refno = Number(searchParams.get("refno") || 0);
    const parentTitle = searchParams.get("parentTitle") || "";

    const [form, setForm] = useState({
        title: refno > 0 ? `[답글] ${parentTitle}` : "",
        content: "",
        file: null,
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (!config) {
        return (
            <div className="board_page">
                <div className="board_card">존재하지 않는 게시판입니다.</div>
            </div>
        );
    }

    const canWrite = role === "admin" || role === "bank";

    if (!canWrite) {
        return (
            <div className="board_page">
                <div className="board_card">글 작성 권한이 없습니다.</div>
            </div>
        );
    }

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleFileChange = (e) => {
        const file = e.target.files?.[0] || null;
        setForm((prev) => ({
            ...prev,
            file,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const title = form.title.trim();
        const content = form.content.trim();

        if (!title) {
            setError("제목을 입력해 주세요.");
            return;
        }

        if (!content) {
            setError("내용을 입력해 주세요.");
            return;
        }

        if (!memberId) {
            setError("로그인 정보가 없습니다. 다시 로그인해 주세요.");
            return;
        }

        try {
            setLoading(true);
            setError("");

            const result = await createBoard({
                title,
                content,
                writerId: memberId,
                boardType: config.boardType,
                refno,
                file: form.file,
            });

            if (!result.success) {
                setError(result.message || "게시글 등록에 실패했습니다.");
                return;
            }

            navigate(`/board/${boardKey}`);
        } catch (err) {
            setError(err.message || "게시글 등록 중 오류가 발생했습니다.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="board_page">
            <div className="board_card">
                <div className="board_header">
                    <div>
                        <h1 className="board_title">
                            {refno > 0 ? `${config.title} 답글 등록` : `${config.title} 등록`}
                        </h1>
                        <p className="board_desc">
                            {refno > 0 ? "선택한 게시글에 대한 답글을 작성합니다." : "새 게시글을 작성합니다."}
                        </p>
                    </div>
                </div>

                <form className="board_write_form" onSubmit={handleSubmit}>
                    <div className="board_form_row">
                        <label>작성자</label>
                        <input type="text" value={memberId} readOnly />
                    </div>

                    {refno > 0 && (
                        <div className="board_form_row">
                            <label>답글 대상</label>
                            <input type="text" value={parentTitle} readOnly />
                        </div>
                    )}

                    <div className="board_form_row">
                        <label htmlFor="title">제목</label>
                        <input
                            id="title"
                            name="title"
                            type="text"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="제목을 입력하세요"
                            maxLength={200}
                        />
                    </div>

                    <div className="board_form_row">
                        <label htmlFor="content">내용</label>
                        <textarea
                            id="content"
                            name="content"
                            value={form.content}
                            onChange={handleChange}
                            placeholder="내용을 입력하세요"
                            rows={14}
                        />
                    </div>

                    <div className="board_form_row">
                        <label htmlFor="file">첨부파일</label>
                        <input
                            id="file"
                            name="file"
                            type="file"
                            onChange={handleFileChange}
                        />
                    </div>

                    {error && <div className="board_form_error">{error}</div>}

                    <div className="board_form_actions">
                        <button
                            type="button"
                            className="board_cancel_btn"
                            onClick={() => navigate(`/board/${boardKey}`)}
                            disabled={loading}
                        >
                            취소
                        </button>
                        <button
                            type="submit"
                            className="board_submit_btn"
                            disabled={loading}
                        >
                            {loading ? "등록 중..." : "등록"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default BoardWritePage;