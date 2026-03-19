package com.ffg.backend.controller;

import com.ffg.backend.dto.BoardCreateRequestDto;
import com.ffg.backend.dto.BoardDto;
import com.ffg.backend.dto.BoardListResponseDto;
import com.ffg.backend.dto.BoardUpdateRequestDto;
import com.ffg.backend.service.BoardService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequestMapping("/api/boards")
public class BoardController {

  private final BoardService boardService;

  @Value("${file.upload-dir:C:/FFG/upload}")
  private String uploadDir;

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

  @PostMapping(consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public Map<String, Object> createBoard(
      @RequestParam String title,
      @RequestParam String content,
      @RequestParam String writerId,
      @RequestParam Integer boardType,
      @RequestParam(required = false, defaultValue = "0") Long refno,
      @RequestParam(value = "file", required = false) MultipartFile file
  ) {
    Map<String, Object> result = new HashMap<>();

    try {
      BoardCreateRequestDto request = new BoardCreateRequestDto();
      request.setTitle(title);
      request.setContent(content);
      request.setWriterId(writerId);
      request.setBoardType(boardType);
      request.setRefno(refno);

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

      if (file != null && !file.isEmpty()) {
        saveFileAndSetInfo(file, request);
      }

      int insertCount = boardService.createBoard(request);

      result.put("success", insertCount > 0);
      result.put("message", insertCount > 0 ? "게시글 등록 완료" : "게시글 등록 실패");
      return result;

    } catch (Exception e) {
      e.printStackTrace();
      result.put("success", false);
      result.put("message", "오류: " + e.getMessage());
      return result;
    }
  }

  @PutMapping(value = "/{boardNo}", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
  public Map<String, Object> updateBoard(
      @PathVariable Long boardNo,
      @RequestPart("data") BoardUpdateRequestDto request,
      @RequestPart(value = "file", required = false) MultipartFile file
  ) throws Exception {
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

    if (file != null && !file.isEmpty()) {
      saveFileAndSetInfo(file, request);
    } else if (request.isDeleteFile()) {
      request.setFilepath(null);
      request.setFname(null);
    } else {
      request.setFilepath(board.getFilepath());
      request.setFname(board.getFname());
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

    if (boardService.hasChildBoards(boardNo)) {
      result.put("success", false);
      result.put("message", "답글이 있는 게시글은 삭제할 수 없습니다.");
      return result;
    }

    int deleteCount = boardService.deleteBoard(boardNo);

    result.put("success", deleteCount > 0);
    result.put("message", deleteCount > 0 ? "삭제 완료" : "삭제 실패");
    return result;
  }

  private void saveFileAndSetInfo(MultipartFile file, BoardCreateRequestDto request) throws Exception {
    String savedFileName = saveFile(file);
    request.setFilepath("/uploads/" + savedFileName);
    request.setFname(file.getOriginalFilename());
  }

  private void saveFileAndSetInfo(MultipartFile file, BoardUpdateRequestDto request) throws Exception {
    String savedFileName = saveFile(file);
    request.setFilepath("/uploads/" + savedFileName);
    request.setFname(file.getOriginalFilename());
  }

  private String saveFile(MultipartFile file) throws Exception {
    String originalName = StringUtils.cleanPath(file.getOriginalFilename());
    String extension = "";

    int dotIndex = originalName.lastIndexOf(".");
    if (dotIndex > -1) {
      extension = originalName.substring(dotIndex);
    }

    String savedFileName = UUID.randomUUID() + extension;

    Path uploadPath = Paths.get(uploadDir);
    if (!Files.exists(uploadPath)) {
      Files.createDirectories(uploadPath);
    }

    Path targetPath = uploadPath.resolve(savedFileName);
    Files.copy(file.getInputStream(), targetPath, StandardCopyOption.REPLACE_EXISTING);

    return savedFileName;
  }
}