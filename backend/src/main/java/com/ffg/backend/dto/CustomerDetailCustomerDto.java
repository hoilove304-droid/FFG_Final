package com.ffg.backend.dto;

public class CustomerDetailCustomerDto {
  private String userId;
  private String name;
  private String phone;
  private String email;
  private String bankCode;

  public String getUserId() { return userId; }
  public void setUserId(String userId) { this.userId = userId; }

  public String getName() { return name; }
  public void setName(String name) { this.name = name; }

  public String getPhone() { return phone; }
  public void setPhone(String phone) { this.phone = phone; }

  public String getEmail() { return email; }
  public void setEmail(String email) { this.email = email; }

  public String getBankCode() { return bankCode; }
  public void setBankCode(String bankCode) { this.bankCode = bankCode; }
}