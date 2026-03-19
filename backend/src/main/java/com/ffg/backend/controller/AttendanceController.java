package com.ffg.backend.controller;

import com.ffg.backend.dto.AttendanceLogDto;
import com.ffg.backend.dto.AttendanceStatusDto;
import com.ffg.backend.service.AttendanceService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/attendance")
public class AttendanceController {

  private final AttendanceService attendanceService;

  public AttendanceController(AttendanceService attendanceService) {
    this.attendanceService = attendanceService;
  }

  @GetMapping("/status")
  public AttendanceStatusDto getStatus(@RequestParam String userId) {
    return attendanceService.getTodayStatus(userId);
  }

  @PostMapping("/checkin")
  public Map<String, Object> checkIn(@RequestBody Map<String, String> req) {
    String userId = req.get("userId");
    return attendanceService.checkIn(userId);
  }

  @PostMapping("/checkout")
  public Map<String, Object> checkOut(@RequestBody Map<String, String> req) {
    String userId = req.get("userId");
    return attendanceService.checkOut(userId);
  }

  @GetMapping("/logs")
  public Map<String, Object> getLogs() {
    List<AttendanceLogDto> logs = attendanceService.getAttendanceLogs();
    Map<String, Object> result = new HashMap<>();
    result.put("logs", logs);
    return result;
  }
}