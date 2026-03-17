package com.ffg.backend.dto;

public class DashboardFraudRowDto {
  private Long txId;
  private String userId;
  private String name;
  private String patternText;
  private Double fraudScore;
  private String txDatetime;

  public DashboardFraudRowDto() {}

  public Long getTxId() {
    return txId;
  }

  public void setTxId(Long txId) {
    this.txId = txId;
  }

  public String getUserId() {
    return userId;
  }

  public void setUserId(String userId) {
    this.userId = userId;
  }

  public String getName() {
    return name;
  }

  public void setName(String name) {
    this.name = name;
  }

  public String getPatternText() {
    return patternText;
  }

  public void setPatternText(String patternText) {
    this.patternText = patternText;
  }

  public Double getFraudScore() {
    return fraudScore;
  }

  public void setFraudScore(Double fraudScore) {
    this.fraudScore = fraudScore;
  }

  public String getTxDatetime() {
    return txDatetime;
  }

  public void setTxDatetime(String txDatetime) {
    this.txDatetime = txDatetime;
  }
}