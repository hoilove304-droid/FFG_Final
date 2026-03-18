package com.ffg.backend.dto;

public class ScheduleCreateRequestDto {
  private String userId;
  private String title;
  private String content;
  private String startDate;
  private String endDate;
  private String allDay;

  public String getUserId() {
    return userId;
  }

  public void setUserId(String userId) {
    this.userId = userId;
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

  public String getStartDate() {
    return startDate;
  }

  public void setStartDate(String startDate) {
    this.startDate = startDate;
  }

  public String getEndDate() {
    return endDate;
  }

  public void setEndDate(String endDate) {
    this.endDate = endDate;
  }

  public String getAllDay() {
    return allDay;
  }

  public void setAllDay(String allDay) {
    this.allDay = allDay;
  }
}