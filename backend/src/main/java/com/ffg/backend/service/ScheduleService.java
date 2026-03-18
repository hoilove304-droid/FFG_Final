package com.ffg.backend.service;

import com.ffg.backend.dto.ScheduleCreateRequestDto;
import com.ffg.backend.dto.ScheduleDto;
import com.ffg.backend.dto.ScheduleUpdateRequestDto;
import com.ffg.backend.mapper.ScheduleMapper;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class ScheduleService {

  private final ScheduleMapper scheduleMapper;

  public ScheduleService(ScheduleMapper scheduleMapper) {
    this.scheduleMapper = scheduleMapper;
  }

  public List<ScheduleDto> getSchedules(String userId) {
    return scheduleMapper.findSchedulesByUserId(userId);
  }

  public ScheduleDto getScheduleDetail(Long scheduleId) {
    return scheduleMapper.findScheduleById(scheduleId);
  }

  public Map<String, Object> createSchedule(ScheduleCreateRequestDto dto) {
    Map<String, Object> result = new HashMap<>();

    if (dto.getUserId() == null || dto.getUserId().trim().isEmpty()) {
      result.put("success", false);
      result.put("message", "userId가 없습니다.");
      return result;
    }

    if (dto.getTitle() == null || dto.getTitle().trim().isEmpty()) {
      result.put("success", false);
      result.put("message", "제목을 입력해주세요.");
      return result;
    }

    if (dto.getStartDate() == null || dto.getStartDate().trim().isEmpty()) {
      result.put("success", false);
      result.put("message", "시작일시를 입력해주세요.");
      return result;
    }

    if (dto.getEndDate() == null || dto.getEndDate().trim().isEmpty()) {
      result.put("success", false);
      result.put("message", "종료일시를 입력해주세요.");
      return result;
    }

    if (dto.getAllDay() == null || dto.getAllDay().trim().isEmpty()) {
      dto.setAllDay("N");
    }

    int inserted = scheduleMapper.insertSchedule(dto);

    result.put("success", inserted > 0);
    result.put("message", inserted > 0 ? "일정 등록 완료" : "일정 등록 실패");
    return result;
  }

  public Map<String, Object> updateSchedule(ScheduleUpdateRequestDto dto) {
    Map<String, Object> result = new HashMap<>();

    if (dto.getScheduleId() == null) {
      result.put("success", false);
      result.put("message", "scheduleId가 없습니다.");
      return result;
    }

    if (dto.getTitle() == null || dto.getTitle().trim().isEmpty()) {
      result.put("success", false);
      result.put("message", "제목을 입력해주세요.");
      return result;
    }

    if (dto.getStartDate() == null || dto.getStartDate().trim().isEmpty()) {
      result.put("success", false);
      result.put("message", "시작일시를 입력해주세요.");
      return result;
    }

    if (dto.getEndDate() == null || dto.getEndDate().trim().isEmpty()) {
      result.put("success", false);
      result.put("message", "종료일시를 입력해주세요.");
      return result;
    }

    if (dto.getAllDay() == null || dto.getAllDay().trim().isEmpty()) {
      dto.setAllDay("N");
    }

    int updated = scheduleMapper.updateSchedule(dto);

    result.put("success", updated > 0);
    result.put("message", updated > 0 ? "일정 수정 완료" : "일정 수정 실패");
    return result;
  }

  public Map<String, Object> deleteSchedule(Long scheduleId) {
    Map<String, Object> result = new HashMap<>();

    if (scheduleId == null) {
      result.put("success", false);
      result.put("message", "scheduleId가 없습니다.");
      return result;
    }

    int deleted = scheduleMapper.deleteSchedule(scheduleId);

    result.put("success", deleted > 0);
    result.put("message", deleted > 0 ? "일정 삭제 완료" : "일정 삭제 실패");
    return result;
  }
}