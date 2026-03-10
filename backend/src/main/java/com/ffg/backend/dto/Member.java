package com.ffg.backend.dto;

import java.util.Date;

public class Member {
  private String memberId;
  private String pwd;
  private String role;
  private String bankCode;
  private String email;
  private String phone;
  private Date regdte;

  public String getMemberId() {
    return memberId;
  }

  public void setMemberId(String memberId) {
    this.memberId = memberId;
  }

  public String getPwd() {
    return pwd;
  }

  public void setPwd(String pwd) {
    this.pwd = pwd;
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

  public String getEmail() {
    return email;
  }

  public void setEmail(String email) {
    this.email = email;
  }

  public String getPhone() {
    return phone;
  }

  public void setPhone(String phone) {
    this.phone = phone;
  }

  public Date getRegdte() {
    return regdte;
  }

  public void setRegdte(Date regdte) {
    this.regdte = regdte;
  }
}