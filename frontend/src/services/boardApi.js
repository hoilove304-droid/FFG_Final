import { apiUrl } from "./api";

export async function fetchBoardList({ boardType, page = 1, keyword = "" }) {
    const params = new URLSearchParams({
        boardType: String(boardType),
        page: String(page),
        keyword,
    });

    const response = await fetch(apiUrl(`/api/boards?${params.toString()}`));

    if (!response.ok) {
        throw new Error("게시글 목록 조회에 실패했습니다.");
    }

    return await response.json();
}

export async function fetchBoardDetail({ boardNo, increaseReadcnt = true }) {
    const params = new URLSearchParams({
        increaseReadcnt: String(increaseReadcnt),
    });

    const response = await fetch(
        apiUrl(`/api/boards/${boardNo}?${params.toString()}`)
    );

    if (!response.ok) {
        throw new Error("게시글 상세 조회에 실패했습니다.");
    }

    return await response.json();
}

export async function createBoard({
                                      title,
                                      content,
                                      writerId,
                                      boardType,
                                      refno = 0,
                                      file = null,
                                  }) {
    const formData = new FormData();

    formData.append("title", title);
    formData.append("content", content);
    formData.append("writerId", writerId);
    formData.append("boardType", String(boardType));
    formData.append("refno", String(refno));

    if (file) {
        formData.append("file", file);
    }

    const response = await fetch(apiUrl("/api/boards"), {
        method: "POST",
        body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "게시글 등록에 실패했습니다.");
    }

    if (!result.success) {
        throw new Error(result.message || "게시글 등록에 실패했습니다.");
    }

    return result;
}

export async function updateBoard({
                                      boardNo,
                                      title,
                                      content,
                                      memberId,
                                      role,
                                      file = null,
                                      deleteFile = false,
                                  }) {
    const formData = new FormData();

    const data = {
        title,
        content,
        memberId,
        role,
        deleteFile,
    };

    formData.append(
        "data",
        new Blob([JSON.stringify(data)], { type: "application/json" })
    );

    if (file) {
        formData.append("file", file);
    }

    const response = await fetch(apiUrl(`/api/boards/${boardNo}`), {
        method: "PUT",
        body: formData,
    });

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "게시글 수정에 실패했습니다.");
    }

    if (!result.success) {
        throw new Error(result.message || "게시글 수정에 실패했습니다.");
    }

    return result;
}

export async function deleteBoard(boardNo, boardType, memberId, role) {
    const params = new URLSearchParams({
        memberId,
        role,
    });

    const response = await fetch(
        apiUrl(`/api/boards/${boardNo}?${params.toString()}`),
        {
            method: "DELETE",
        }
    );

    const result = await response.json();

    if (!response.ok) {
        throw new Error(result.message || "게시글 삭제에 실패했습니다.");
    }

    if (!result.success) {
        throw new Error(result.message || "게시글 삭제에 실패했습니다.");
    }

    return result;
}