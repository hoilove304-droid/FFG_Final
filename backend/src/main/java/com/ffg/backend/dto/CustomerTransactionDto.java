package com.ffg.backend.dto;

public class CustomerTransactionDto {
  private Long txId;
  private String userId;
  private String bankCode;
  private String txChannel;
  private String txType;
  private Double txAmount;
  private String txDatetime;
  private String txCountry;
  private String txLocation;
  private String deviceType;
  private String deviceOs;
  private String deviceId;
  private String ipAddress;
  private Double fraudScore;

  public Long getTxId() { return txId; }
  public void setTxId(Long txId) { this.txId = txId; }

  public String getUserId() { return userId; }
  public void setUserId(String userId) { this.userId = userId; }

  public String getBankCode() { return bankCode; }
  public void setBankCode(String bankCode) { this.bankCode = bankCode; }

  public String getTxChannel() { return txChannel; }
  public void setTxChannel(String txChannel) { this.txChannel = txChannel; }

  public String getTxType() { return txType; }
  public void setTxType(String txType) { this.txType = txType; }

  public Double getTxAmount() { return txAmount; }
  public void setTxAmount(Double txAmount) { this.txAmount = txAmount; }

  public String getTxDatetime() { return txDatetime; }
  public void setTxDatetime(String txDatetime) { this.txDatetime = txDatetime; }

  public String getTxCountry() { return txCountry; }
  public void setTxCountry(String txCountry) { this.txCountry = txCountry; }

  public String getTxLocation() { return txLocation; }
  public void setTxLocation(String txLocation) { this.txLocation = txLocation; }

  public String getDeviceType() { return deviceType; }
  public void setDeviceType(String deviceType) { this.deviceType = deviceType; }

  public String getDeviceOs() { return deviceOs; }
  public void setDeviceOs(String deviceOs) { this.deviceOs = deviceOs; }

  public String getDeviceId() { return deviceId; }
  public void setDeviceId(String deviceId) { this.deviceId = deviceId; }

  public String getIpAddress() { return ipAddress; }
  public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

  public Double getFraudScore() { return fraudScore; }
  public void setFraudScore(Double fraudScore) { this.fraudScore = fraudScore; }
}