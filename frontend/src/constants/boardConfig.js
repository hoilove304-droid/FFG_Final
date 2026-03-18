export const BOARD_CONFIG = {
    error: {
        title: "분석의뢰 게시판",
        boardType: 1,
    },
    community: {
        title: "커뮤니티 게시판",
        boardType: 2,
    },
    faq: {
        title: "FAQ 게시판",
        boardType: 3,
    },
    notice: {
        title: "공지사항 게시판",
        boardType: 4,
    },
};

export function getBoardConfig(boardKey) {
    return BOARD_CONFIG[boardKey] || null;
}