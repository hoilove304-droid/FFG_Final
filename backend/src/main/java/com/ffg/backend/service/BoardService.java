package com.ffg.backend.service;

import com.ffg.backend.dto.BoardCreateRequestDto;
import com.ffg.backend.dto.BoardDto;
import com.ffg.backend.dto.BoardListResponseDto;
import com.ffg.backend.dto.BoardUpdateRequestDto;
import com.ffg.backend.mapper.BoardMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class BoardService {

  private final BoardMapper boardMapper;

  public BoardService(BoardMapper boardMapper) {
    this.boardMapper = boardMapper;
  }

  public BoardListResponseDto getBoardList(Integer boardType, int page, String keyword) {
    int pageSize = 10;
    int startRow = (page - 1) * pageSize + 1;
    int endRow = page * pageSize;

    List<BoardDto> list = boardMapper.selectBoardList(boardType, keyword, startRow, endRow);
    int totalCount = boardMapper.countBoardList(boardType, keyword);

    int totalPages = (int) Math.ceil((double) totalCount / pageSize);
    if (totalPages == 0) {
      totalPages = 1;
    }

    BoardListResponseDto response = new BoardListResponseDto();
    response.setList(list);
    response.setCurrentPage(page);
    response.setTotalPages(totalPages);
    response.setTotalCount(totalCount);
    response.setPageSize(pageSize);

    return response;
  }

  public int createBoard(BoardCreateRequestDto request) {
    if (request.getRefno() == null) {
      request.setRefno(0L);
    }
    return boardMapper.insertBoard(request);
  }

  public BoardDto getBoardDetail(Long boardNo, boolean increaseReadcnt) {
    if (increaseReadcnt) {
      boardMapper.increaseReadcnt(boardNo);
    }
    return boardMapper.selectBoardDetailByBoardNo(boardNo);
  }

  public boolean canManage(BoardDto board, String memberId, String role) {
    if (board == null) return false;
    if ("admin".equals(role)) return true;
    return board.getWriterId() != null && board.getWriterId().equals(memberId);
  }

  public int updateBoard(Long boardNo, BoardUpdateRequestDto request) {
    return boardMapper.updateBoard(boardNo, request.getTitle(), request.getContent());
  }

  public int deleteBoard(Long boardNo) {
    return boardMapper.deleteBoard(boardNo);
  }
}