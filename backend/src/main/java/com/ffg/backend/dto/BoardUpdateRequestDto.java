package com.ffg.backend.dto;

public class BoardUpdateRequestDto {

  private String title;
  private String content;
  private Integer boardType;
  private String memberId;
  private String role;
  private String filepath;
  private String fname;
  private boolean deleteFile;

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

  public String getFilepath() {
    return filepath;
  }

  public void setFilepath(String filepath) {
    this.filepath = filepath;
  }

  public String getFname() {
    return fname;
  }

  public void setFname(String fname) {
    this.fname = fname;
  }

  public boolean isDeleteFile() {
    return deleteFile;
  }

  public void setDeleteFile(boolean deleteFile) {
    this.deleteFile = deleteFile;
  }
}