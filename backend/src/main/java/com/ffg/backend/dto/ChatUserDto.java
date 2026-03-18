package com.ffg.backend.dto;

public class ChatUserDto {
  private String memberId;
  private String role;
  private String bankCode;
  private String lastMessage;
  private Integer unreadCount;

  public ChatUserDto() {
  }

  public ChatUserDto(String memberId, String role, String bankCode) {
    this.memberId = memberId;
    this.role = role;
    this.bankCode = bankCode;
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

  public String getBankCode() {
    return bankCode;
  }

  public void setBankCode(String bankCode) {
    this.bankCode = bankCode;
  }

  public String getLastMessage() {
    return lastMessage;
  }

  public void setLastMessage(String lastMessage) {
    this.lastMessage = lastMessage;
  }

  public Integer getUnreadCount() {
    return unreadCount;
  }

  public void setUnreadCount(Integer unreadCount) {
    this.unreadCount = unreadCount;
  }
}