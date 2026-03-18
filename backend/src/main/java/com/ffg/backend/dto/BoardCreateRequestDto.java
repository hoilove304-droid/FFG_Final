package com.ffg.backend.dto;

public class BoardCreateRequestDto {

  private Long refno;
  private String title;
  private String content;
  private Integer boardType;
  private String writerId;
  private String filepath;
  private String fname;

  public Long getRefno() {
    return refno;
  }

  public void setRefno(Long refno) {
    this.refno = refno;
  }

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

  public String getWriterId() {
    return writerId;
  }

  public void setWriterId(String writerId) {
    this.writerId = writerId;
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
}