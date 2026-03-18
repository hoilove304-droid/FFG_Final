package com.ffg.backend.controller;

import com.ffg.backend.dto.ScheduleCreateRequestDto;
import com.ffg.backend.dto.ScheduleDto;
import com.ffg.backend.dto.ScheduleUpdateRequestDto;
import com.ffg.backend.service.ScheduleService;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/schedules")
public class ScheduleController {

  private final ScheduleService scheduleService;

  public ScheduleController(ScheduleService scheduleService) {
    this.scheduleService = scheduleService;
  }

  @GetMapping
  public List<ScheduleDto> getSchedules(@RequestParam String userId) {
    return scheduleService.getSchedules(userId);
  }

  @GetMapping("/{scheduleId}")
  public ScheduleDto getScheduleDetail(@PathVariable Long scheduleId) {
    return scheduleService.getScheduleDetail(scheduleId);
  }

  @PostMapping
  public Map<String, Object> createSchedule(@RequestBody ScheduleCreateRequestDto dto) {
    return scheduleService.createSchedule(dto);
  }

  @PutMapping("/{scheduleId}")
  public Map<String, Object> updateSchedule(
      @PathVariable Long scheduleId,
      @RequestBody ScheduleUpdateRequestDto dto
  ) {
    dto.setScheduleId(scheduleId);
    return scheduleService.updateSchedule(dto);
  }

  @DeleteMapping("/{scheduleId}")
  public Map<String, Object> deleteSchedule(@PathVariable Long scheduleId) {
    return scheduleService.deleteSchedule(scheduleId);
  }
}