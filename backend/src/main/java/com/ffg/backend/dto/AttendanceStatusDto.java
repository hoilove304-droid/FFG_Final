package com.ffg.backend.dto;

public class AttendanceStatusDto {
  private boolean checkedIn;
  private boolean checkedOut;
  private String checkinTime;
  private String checkoutTime;

  public boolean isCheckedIn() {
    return checkedIn;
  }

  public void setCheckedIn(boolean checkedIn) {
    this.checkedIn = checkedIn;
  }

  public boolean isCheckedOut() {
    return checkedOut;
  }

  public void setCheckedOut(boolean checkedOut) {
    this.checkedOut = checkedOut;
  }

  public String getCheckinTime() {
    return checkinTime;
  }

  public void setCheckinTime(String checkinTime) {
    this.checkinTime = checkinTime;
  }

  public String getCheckoutTime() {
    return checkoutTime;
  }

  public void setCheckoutTime(String checkoutTime) {
    this.checkoutTime = checkoutTime;
  }
}