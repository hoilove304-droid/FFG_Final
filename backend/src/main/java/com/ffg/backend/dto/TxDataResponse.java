package com.ffg.backend.dto;

import java.util.Date;

public class TxDataResponse {

  private Long txId;
  private String userId;
  private String bankCode;
  private String txType;
  private Double txAmount;
  private Date txDatetime;

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

  public Date getTxDatetime() {
    return txDatetime;
  }

  public void setTxDatetime(Date txDatetime) {
    this.txDatetime = txDatetime;
  }
}