import { useEffect, useState } from "react";
import { Link, useNavigate, useParams, useSearchParams } from "react-router-dom";
import { fetchBoardList } from "../services/boardApi";
import { getBoardConfig } from "../constants/boardConfig";
import "../styles/BoardPage.css";

function BoardListPage() {
    const { boardKey } = useParams();
    const navigate = useNavigate();
    const [searchParams, setSearchParams] = useSearchParams();

    const config = getBoardConfig(boardKey);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [data, setData] = useState({
        list: [],
        currentPage: 1,
        totalPages: 1,
        totalCount: 0,
        pageSize: 10,
    });
    const [keywordInput, setKeywordInput] = useState(searchParams.get("keyword") || "");

    const page = Number(searchParams.get("page") || 1);
    const keyword = searchParams.get("keyword") || "";

    useEffect(() => {
        setKeywordInput(keyword);
    }, [keyword]);

    useEffect(() => {
        if (!config) {
            setError("잘못된 게시판 경로입니다.");
            setLoading(false);
            return;
        }

        const loadBoardList = async () => {
            try {
                setLoading(true);
                setError("");

                const result = await fetchBoardList({
                    boardType: config.boardType,
                    page,
                    keyword,
                });

                setData(result);
            } catch (err) {
                setError(err.message || "게시글 목록을 불러오지 못했습니다.");
            } finally {
                setLoading(false);
            }
        };

        loadBoardList();
    }, [config, page, keyword]);

    if (!config) {
        return (
            <div className="board_page">
                <div className="board_card">존재하지 않는 게시판입니다.</div>
            </div>
        );
    }

    const handleSearch = (e) => {
        e.preventDefault();

        const trimmed = keywordInput.trim();

        const nextParams = {};
        if (trimmed) nextParams.keyword = trimmed;
        nextParams.page = "1";

        setSearchParams(nextParams);
    };

    const handlePageMove = (nextPage) => {
        const nextParams = {};
        if (keyword) nextParams.keyword = keyword;
        nextParams.page = String(nextPage);
        setSearchParams(nextParams);
    };

    const handleWriteClick = () => {
        navigate(`/board/${boardKey}/write`);
    };

    const role = localStorage.getItem("role") || "";
    const canWrite = role === "admin" || role === "bank";

    const pages = [];
    for (let i = 1; i <= data.totalPages; i += 1) {
        pages.push(i);
    }

    return (
        <div className="board_page">
            <div className="board_card">
                <div className="board_header">
                    <div>
                        <h1 className="board_title">{config.title}</h1>
                        <p className="board_desc">총 {data.totalCount}건</p>
                    </div>

                    {canWrite && (
                        <button type="button" className="board_write_btn" onClick={handleWriteClick}>
                            글쓰기
                        </button>
                    )}
                </div>

                <form className="board_search" onSubmit={handleSearch}>
                    <input
                        type="text"
                        value={keywordInput}
                        onChange={(e) => setKeywordInput(e.target.value)}
                        placeholder="제목 검색"
                    />
                    <button type="submit">검색</button>
                </form>

                {loading ? (
                    <div className="board_empty">게시글을 불러오는 중입니다.</div>
                ) : error ? (
                    <div className="board_empty error">{error}</div>
                ) : data.list.length === 0 ? (
                    <div className="board_empty">등록된 게시글이 없습니다.</div>
                ) : (
                    <>
                        <table className="board_table">
                            <thead>
                            <tr>
                                <th className="col_no">번호</th>
                                <th className="col_title">제목</th>
                                <th className="col_writer">작성자</th>
                                <th className="col_readcnt">조회수</th>
                                <th className="col_date">등록일</th>
                            </tr>
                            </thead>
                            <tbody>
                            {data.list.map((item) => (
                                <tr key={item.boardNo}>
                                    <td>{item.boardNo}</td>
                                    <td className="board_title_cell">
                                        <Link to={`/board/${boardKey}/${item.boardNo}`}>
                                            {item.title}
                                        </Link>
                                    </td>
                                    <td>{item.writerId || "-"}</td>
                                    <td>{item.readcnt ?? 0}</td>
                                    <td>{item.regdte || "-"}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>

                        <div className="board_pagination">
                            <button
                                type="button"
                                onClick={() => handlePageMove(page - 1)}
                                disabled={page <= 1}
                            >
                                이전
                            </button>

                            {pages.map((pageNo) => (
                                <button
                                    key={pageNo}
                                    type="button"
                                    className={pageNo === page ? "active" : ""}
                                    onClick={() => handlePageMove(pageNo)}
                                >
                                    {pageNo}
                                </button>
                            ))}

                            <button
                                type="button"
                                onClick={() => handlePageMove(page + 1)}
                                disabled={page >= data.totalPages}
                            >
                                다음
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
}

export default BoardListPage;