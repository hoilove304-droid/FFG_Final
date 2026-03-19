package com.ffg.backend.dto;

public class TxDataResponse {

  private Long txId;
  private String userId;
  private String bankCode;
  private String txType;
  private Double txAmount;
  private String txDatetime;

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

  public String getBankCode() {
    return bankCode;
  }

  public void setBankCode(String bankCode) {
    this.bankCode = bankCode;
  }

  public String getTxType() {
    return txType;
  }

  public void setTxType(String txType) {
    this.txType = txType;
  }

  public Double getTxAmount() {
    return txAmount;
  }

  public void setTxAmount(Double txAmount) {
    this.txAmount = txAmount;
  }

  public String getTxDatetime() {
    return txDatetime;
  }

  public void setTxDatetime(String txDatetime) {
    this.txDatetime = txDatetime;
  }
}