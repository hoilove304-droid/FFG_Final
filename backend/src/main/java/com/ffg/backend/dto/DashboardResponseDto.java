package com.ffg.backend.dto;

import java.util.List;

public class DashboardResponseDto {
  private List<DashboardFraudRowDto> fraudRows;

  public DashboardResponseDto() {}

  public List<DashboardFraudRowDto> getFraudRows() {
    return fraudRows;
  }

  public void setFraudRows(List<DashboardFraudRowDto> fraudRows) {
    this.fraudRows = fraudRows;
  }
}