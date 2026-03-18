package com.ffg.backend.dto;

public class BoardUpdateRequestDto {

  private String title;
  private String content;
  private Integer boardType;
  private String memberId;
  private String role;

  public String getTitle() {
    return title;
  }

  public void setTitle(String title) {
    this.title = title;
  }

  public String getContent() {
    return content;
  }

  public void setContent(String content) {
    this.content = content;
  }

  public Integer getBoardType() {
    return boardType;
  }

  public void setBoardType(Integer boardType) {
    this.boardType = boardType;
  }

  public String getMemberId() {
    return memberId;
  }

  public void setMemberId(String memberId) {
    this.memberId = memberId;
  }

  public String getRole() {
    return role;
  }

  public void setRole(String role) {
    this.role = role;
  }
}