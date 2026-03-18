package com.ffg.backend.dto;

public class BoardDto {

  private Long boardNo;
  private Long refno;
  private String title;
  private String content;
  private Integer readcnt;
  private String regdte;
  private Integer boardType;
  private String filepath;
  private String fname;
  private String writerId;
  private Integer depth;

  public Long getBoardNo() {
    return boardNo;
  }

  public void setBoardNo(Long boardNo) {
    this.boardNo = boardNo;
  }

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

  public Integer getReadcnt() {
    return readcnt;
  }

  public void setReadcnt(Integer readcnt) {
    this.readcnt = readcnt;
  }

  public String getRegdte() {
    return regdte;
  }

  public void setRegdte(String regdte) {
    this.regdte = regdte;
  }

  public Integer getBoardType() {
    return boardType;
  }

  public void setBoardType(Integer boardType) {
    this.boardType = boardType;
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

  public String getWriterId() {
    return writerId;
  }

  public void setWriterId(String writerId) {
    this.writerId = writerId;
  }

  public Integer getDepth() {
    return depth;
  }

  public void setDepth(Integer depth) {
    this.depth = depth;
  }
}