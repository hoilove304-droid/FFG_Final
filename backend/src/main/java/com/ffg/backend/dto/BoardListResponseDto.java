package com.ffg.backend.dto;

import java.util.List;

public class BoardListResponseDto {

  private List<BoardDto> list;
  private Integer currentPage;
  private Integer totalPages;
  private Integer totalCount;
  private Integer pageSize;

  public List<BoardDto> getList() {
    return list;
  }

  public void setList(List<BoardDto> list) {
    this.list = list;
  }

  public Integer getCurrentPage() {
    return currentPage;
  }

  public void setCurrentPage(Integer currentPage) {
    this.currentPage = currentPage;
  }

  public Integer getTotalPages() {
    return totalPages;
  }

  public void setTotalPages(Integer totalPages) {
    this.totalPages = totalPages;
  }

  public Integer getTotalCount() {
    return totalCount;
  }

  public void setTotalCount(Integer totalCount) {
    this.totalCount = totalCount;
  }

  public Integer getPageSize() {
    return pageSize;
  }

  public void setPageSize(Integer pageSize) {
    this.pageSize = pageSize;
  }
}