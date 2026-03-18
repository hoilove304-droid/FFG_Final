const BASE_URL = "http://localhost:8080/api";

async function parseResponse(response, defaultMessage) {
    let data = null;

    try {
        data = await response.json();
    } catch {
        // JSON 응답이 아니면 무시
    }

    if (!response.ok) {
        throw new Error(data?.message || defaultMessage);
    }

    return data;
}

export async function fetchBoardList({ boardType, page = 1, keyword = "" }) {
    const query = new URLSearchParams({
        boardType: String(boardType),
        page: String(page),
        keyword,
    });

    const response = await fetch(`${BASE_URL}/boards?${query.toString()}`);
    return parseResponse(response, "게시글 목록 조회 실패");
}

export async function fetchBoardDetail({ boardNo, increaseReadcnt = true }) {
    const query = new URLSearchParams({
        increaseReadcnt: String(increaseReadcnt),
    });

    const response = await fetch(`${BASE_URL}/boards/${boardNo}?${query.toString()}`);
    return parseResponse(response, "게시글 상세 조회 실패");
}

export async function createBoard(payload) {
    const response = await fetch(`${BASE_URL}/boards`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    return parseResponse(response, "게시글 등록 실패");
}

export async function updateBoard(boardNo, payload) {
    const response = await fetch(`${BASE_URL}/boards/${boardNo}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
    });

    return parseResponse(response, "게시글 수정 실패");
}

export async function deleteBoard(boardNo, boardType, memberId, role) {
    const query = new URLSearchParams({
        boardType: String(boardType),
        memberId: memberId || "",
        role: role || "",
    });

    const response = await fetch(`${BASE_URL}/boards/${boardNo}?${query.toString()}`, {
        method: "DELETE",
    });

    return parseResponse(response, "게시글 삭제 실패");
}