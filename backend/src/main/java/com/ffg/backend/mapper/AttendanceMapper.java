package com.ffg.backend.mapper;

import com.ffg.backend.dto.AttendanceLogDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AttendanceMapper {

  Integer countTodayAttendance(@Param("userId") String userId);

  String selectTodayCheckInTime(@Param("userId") String userId);

  String selectTodayCheckOutTime(@Param("userId") String userId);

  int insertCheckIn(@Param("userId") String userId);

  int updateCheckOut(@Param("userId") String userId);

  List<AttendanceLogDto> selectAttendanceLogs();
}