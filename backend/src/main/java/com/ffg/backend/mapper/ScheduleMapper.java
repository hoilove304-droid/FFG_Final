package com.ffg.backend.mapper;

import com.ffg.backend.dto.ScheduleCreateRequestDto;
import com.ffg.backend.dto.ScheduleDto;
import com.ffg.backend.dto.ScheduleUpdateRequestDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface ScheduleMapper {

  List<ScheduleDto> findSchedulesByUserId(@Param("userId") String userId);

  ScheduleDto findScheduleById(@Param("scheduleId") Long scheduleId);

  int insertSchedule(ScheduleCreateRequestDto dto);

  int updateSchedule(ScheduleUpdateRequestDto dto);

  int deleteSchedule(@Param("scheduleId") Long scheduleId);
}