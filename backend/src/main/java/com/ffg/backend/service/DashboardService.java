package com.ffg.backend.service;

import com.ffg.backend.dto.DashboardFraudRowDto;
import com.ffg.backend.dto.DashboardResponseDto;
import com.ffg.backend.mapper.DashboardMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class DashboardService {

  private final DashboardMapper dashboardMapper;

  public DashboardService(DashboardMapper dashboardMapper) {
    this.dashboardMapper = dashboardMapper;
  }

  public DashboardResponseDto getDashboard(String bankCode) {
    List<DashboardFraudRowDto> fraudRows =
        dashboardMapper.selectFraudRowsByBankCode(bankCode);

    DashboardResponseDto response = new DashboardResponseDto();
    response.setFraudRows(fraudRows);

    return response;
  }
}