package com.ffg.backend.dto;

public class ScheduleDto {
  private Long scheduleId;
  private String userId;
  private String title;
  private String content;
  private String startDate;
  private String endDate;
  private String allDay;
  private String regdte;
  private String updatedAt;

  public Long getScheduleId() {
    return scheduleId;
  }

  public void setScheduleId(Long scheduleId) {
    this.scheduleId = scheduleId;
  }

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

  public String getRegdte() {
    return regdte;
  }

  public void setRegdte(String regdte) {
    this.regdte = regdte;
  }

  public String getUpdatedAt() {
    return updatedAt;
  }

  public void setUpdatedAt(String updatedAt) {
    this.updatedAt = updatedAt;
  }
}