package com.ffg.backend.mapper;

import com.ffg.backend.dto.BoardCreateRequestDto;
import com.ffg.backend.dto.BoardDto;
import com.ffg.backend.dto.BoardUpdateRequestDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface BoardMapper {

  List<BoardDto> selectBoardList(
      @Param("boardType") Integer boardType,
      @Param("keyword") String keyword,
      @Param("startRow") Integer startRow,
      @Param("endRow") Integer endRow
  );

  int countBoardList(
      @Param("boardType") Integer boardType,
      @Param("keyword") String keyword
  );

  int insertBoard(BoardCreateRequestDto request);

  BoardDto selectBoardDetailByBoardNo(@Param("boardNo") Long boardNo);

  int increaseReadcnt(@Param("boardNo") Long boardNo);

  int updateBoard(
      @Param("boardNo") Long boardNo,
      @Param("title") String title,
      @Param("content") String content
  );

  int deleteBoard(@Param("boardNo") Long boardNo);
}