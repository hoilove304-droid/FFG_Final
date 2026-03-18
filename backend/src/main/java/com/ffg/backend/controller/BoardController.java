package com.ffg.backend.controller;

import com.ffg.backend.dto.BoardCreateRequestDto;
import com.ffg.backend.dto.BoardDto;
import com.ffg.backend.dto.BoardListResponseDto;
import com.ffg.backend.dto.BoardUpdateRequestDto;
import com.ffg.backend.service.BoardService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/boards")
public class BoardController {

  private final BoardService boardService;

  public BoardController(BoardService boardService) {
    this.boardService = boardService;
  }

  @GetMapping
  public BoardListResponseDto getBoardList(
      @RequestParam Integer boardType,
      @RequestParam(defaultValue = "1") Integer page,
      @RequestParam(defaultValue = "") String keyword
  ) {
    return boardService.getBoardList(boardType, page, keyword);
  }

  @GetMapping("/{boardNo}")
  public BoardDto getBoardDetail(
      @PathVariable Long boardNo,
      @RequestParam(defaultValue = "true") boolean increaseReadcnt
  ) {
    return boardService.getBoardDetail(boardNo, increaseReadcnt);
  }

  @PostMapping
  public Map<String, Object> createBoard(@RequestBody BoardCreateRequestDto request) {
    Map<String, Object> result = new HashMap<>();

    if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
      result.put("success", false);
      result.put("message", "제목을 입력해 주세요.");
      return result;
    }

    if (request.getContent() == null || request.getContent().trim().isEmpty()) {
      result.put("success", false);
      result.put("message", "내용을 입력해 주세요.");
      return result;
    }

    if (request.getBoardType() == null) {
      result.put("success", false);
      result.put("message", "게시판 유형이 없습니다.");
      return result;
    }

    if (request.getWriterId() == null || request.getWriterId().trim().isEmpty()) {
      result.put("success", false);
      result.put("message", "작성자 정보가 없습니다.");
      return result;
    }

    int insertCount = boardService.createBoard(request);

    result.put("success", insertCount > 0);
    result.put("message", insertCount > 0 ? "게시글 등록 완료" : "게시글 등록 실패");
    return result;
  }

  @PutMapping("/{boardNo}")
  public Map<String, Object> updateBoard(
      @PathVariable Long boardNo,
      @RequestBody BoardUpdateRequestDto request
  ) {
    Map<String, Object> result = new HashMap<>();

    BoardDto board = boardService.getBoardDetail(boardNo, false);

    if (board == null) {
      result.put("success", false);
      result.put("message", "게시글이 없습니다.");
      return result;
    }

    if (request.getTitle() == null || request.getTitle().trim().isEmpty()) {
      result.put("success", false);
      result.put("message", "제목을 입력해 주세요.");
      return result;
    }

    if (request.getContent() == null || request.getContent().trim().isEmpty()) {
      result.put("success", false);
      result.put("message", "내용을 입력해 주세요.");
      return result;
    }

    if (!boardService.canManage(board, request.getMemberId(), request.getRole())) {
      result.put("success", false);
      result.put("message", "수정 권한이 없습니다.");
      return result;
    }

    int updateCount = boardService.updateBoard(boardNo, request);

    result.put("success", updateCount > 0);
    result.put("message", updateCount > 0 ? "수정 완료" : "수정 실패");
    return result;
  }

  @DeleteMapping("/{boardNo}")
  public Map<String, Object> deleteBoard(
      @PathVariable Long boardNo,
      @RequestParam String memberId,
      @RequestParam String role
  ) {
    Map<String, Object> result = new HashMap<>();

    BoardDto board = boardService.getBoardDetail(boardNo, false);

    if (board == null) {
      result.put("success", false);
      result.put("message", "게시글이 없습니다.");
      return result;
    }

    if (!boardService.canManage(board, memberId, role)) {
      result.put("success", false);
      result.put("message", "삭제 권한이 없습니다.");
      return result;
    }

    int deleteCount = boardService.deleteBoard(boardNo);

    result.put("success", deleteCount > 0);
    result.put("message", deleteCount > 0 ? "삭제 완료" : "삭제 실패");
    return result;
  }
}