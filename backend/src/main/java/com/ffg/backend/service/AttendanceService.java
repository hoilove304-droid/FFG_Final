package com.ffg.backend.service;

import com.ffg.backend.dto.AttendanceLogDto;
import com.ffg.backend.dto.AttendanceStatusDto;
import com.ffg.backend.mapper.AttendanceMapper;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class AttendanceService {

  private final AttendanceMapper attendanceMapper;

  public AttendanceService(AttendanceMapper attendanceMapper) {
    this.attendanceMapper = attendanceMapper;
  }

  public AttendanceStatusDto getTodayStatus(String userId) {
    String checkinTime = attendanceMapper.selectTodayCheckInTime(userId);
    String checkoutTime = attendanceMapper.selectTodayCheckOutTime(userId);

    AttendanceStatusDto dto = new AttendanceStatusDto();
    dto.setCheckedIn(checkinTime != null);
    dto.setCheckedOut(checkoutTime != null);
    dto.setCheckinTime(checkinTime);
    dto.setCheckoutTime(checkoutTime);

    return dto;
  }

  public Map<String, Object> checkIn(String userId) {
    Map<String, Object> result = new HashMap<>();

    int todayCount = attendanceMapper.countTodayAttendance(userId);
    if (todayCount > 0) {
      result.put("success", false);
      result.put("message", "이미 출근 처리되었습니다.");
      return result;
    }

    int inserted = attendanceMapper.insertCheckIn(userId);
    result.put("success", inserted > 0);
    result.put("message", inserted > 0 ? "출근 처리 완료" : "출근 처리 실패");

    if (inserted > 0) {
      result.put("checkinTime", attendanceMapper.selectTodayCheckInTime(userId));
    }

    return result;
  }

  public Map<String, Object> checkOut(String userId) {
    Map<String, Object> result = new HashMap<>();

    int todayCount = attendanceMapper.countTodayAttendance(userId);
    if (todayCount == 0) {
      result.put("success", false);
      result.put("message", "출근 기록이 없습니다.");
      return result;
    }

    String alreadyCheckout = attendanceMapper.selectTodayCheckOutTime(userId);
    if (alreadyCheckout != null) {
      result.put("success", false);
      result.put("message", "이미 퇴근 처리되었습니다.");
      return result;
    }

    int updated = attendanceMapper.updateCheckOut(userId);
    result.put("success", updated > 0);
    result.put("message", updated > 0 ? "퇴근 처리 완료" : "퇴근 처리 실패");

    if (updated > 0) {
      result.put("checkoutTime", attendanceMapper.selectTodayCheckOutTime(userId));
    }

    return result;
  }

  public List<AttendanceLogDto> getAttendanceLogs() {
    return attendanceMapper.selectAttendanceLogs();
  }
}