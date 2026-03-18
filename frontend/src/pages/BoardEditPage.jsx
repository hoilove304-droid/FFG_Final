import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getBoardConfig } from "../constants/boardConfig";
import { fetchBoardDetail, updateBoard } from "../services/boardApi";
import "../styles/BoardPage.css";

function BoardEditPage() {
    const { boardKey, boardNo } = useParams();
    const navigate = useNavigate();
    const config = getBoardConfig(boardKey);

    const memberId = localStorage.getItem("memberId") || "";
    const role = localStorage.getItem("role") || "";

    const [loading, setLoading] = useState(true);
    const [submitLoading, setSubmitLoading] = useState(false);
    const [error, setError] = useState("");
    const [form, setForm] = useState({
        title: "",
        content: "",
        writerId: "",
        file: null,
        currentFileName: "",
        deleteFile: false,
    });

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
                    increaseReadcnt: false,
                });

                if (!result) {
                    setError("게시글을 찾을 수 없습니다.");
                    return;
                }

                const canEdit = role === "admin" || result.writerId === memberId;
                if (!canEdit) {
                    setError("수정 권한이 없습니다.");
                    return;
                }

                setForm({
                    title: result.title || "",
                    content: result.content || "",
                    writerId: result.writerId || "",
                    file: null,
                    currentFileName: result.fname || "",
                    deleteFile: false,
                });
            } catch (err) {
                setError(err.message || "게시글 정보를 불러오지 못했습니다.");
            } finally {
                setLoading(false);
            }
        };

        loadDetail();
    }, [boardNo, config, memberId, role]);

    if (!config) {
        return (
            <div className="board_page">
                <div className="board_card">존재하지 않는 게시판입니다.</div>
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
            deleteFile: false,
        }));
    };

    const handleDeleteFileChange = (e) => {
        const checked = e.target.checked;
        setForm((prev) => ({
            ...prev,
            deleteFile: checked,
            file: checked ? null : prev.file,
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

        try {
            setSubmitLoading(true);
            setError("");

            const result = await updateBoard(boardNo, {
                title,
                content,
                boardType: config.boardType,
                memberId,
                role,
                file: form.file,
                deleteFile: form.deleteFile,
            });

            if (!result.success) {
                setError(result.message || "수정에 실패했습니다.");
                return;
            }

            navigate(`/board/${boardKey}/${boardNo}`);
        } catch (err) {
            setError(err.message || "수정 중 오류가 발생했습니다.");
        } finally {
            setSubmitLoading(false);
        }
    };

    return (
        <div className="board_page">
            <div className="board_card">
                {loading ? (
                    <div className="board_empty">게시글을 불러오는 중입니다.</div>
                ) : error && !form.writerId ? (
                    <div className="board_empty error">{error}</div>
                ) : (
                    <>
                        <div className="board_header">
                            <div>
                                <h1 className="board_title">{config.title} 수정</h1>
                                <p className="board_desc">게시글 내용을 수정합니다.</p>
                            </div>
                        </div>

                        <form className="board_write_form" onSubmit={handleSubmit}>
                            <div className="board_form_row">
                                <label>작성자</label>
                                <input type="text" value={form.writerId} readOnly />
                            </div>

                            <div className="board_form_row">
                                <label htmlFor="title">제목</label>
                                <input
                                    id="title"
                                    name="title"
                                    type="text"
                                    value={form.title}
                                    onChange={handleChange}
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
                                    rows={14}
                                />
                            </div>

                            <div className="board_form_row">
                                <label htmlFor="file">새 첨부파일</label>
                                <input
                                    id="file"
                                    name="file"
                                    type="file"
                                    onChange={handleFileChange}
                                />
                            </div>

                            {form.currentFileName && (
                                <div className="board_form_row">
                                    <label>기존 파일</label>
                                    <div>
                                        <div>{form.currentFileName}</div>
                                        <label style={{ display: "inline-flex", gap: "8px", marginTop: "8px" }}>
                                            <input
                                                type="checkbox"
                                                checked={form.deleteFile}
                                                onChange={handleDeleteFileChange}
                                            />
                                            첨부파일 삭제
                                        </label>
                                    </div>
                                </div>
                            )}

                            {error && <div className="board_form_error">{error}</div>}

                            <div className="board_form_actions">
                                <button
                                    type="button"
                                    className="board_cancel_btn"
                                    onClick={() => navigate(`/board/${boardKey}/${boardNo}`)}
                                    disabled={submitLoading}
                                >
                                    취소
                                </button>
                                <button
                                    type="submit"
                                    className="board_submit_btn"
                                    disabled={submitLoading}
                                >
                                    {submitLoading ? "수정 중..." : "수정 완료"}
                                </button>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
}

export default BoardEditPage;