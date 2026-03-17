package com.ffg.backend.controller;

import com.ffg.backend.dto.DashboardResponseDto;
import com.ffg.backend.service.DashboardService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/dashboard")
public class DashboardController {

  private final DashboardService dashboardService;

  public DashboardController(DashboardService dashboardService) {
    this.dashboardService = dashboardService;
  }

  @GetMapping("/{bankCode}")
  public DashboardResponseDto getDashboard(@PathVariable String bankCode) {
    return dashboardService.getDashboard(bankCode);
  }
}