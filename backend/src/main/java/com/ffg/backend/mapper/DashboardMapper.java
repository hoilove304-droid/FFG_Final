package com.ffg.backend.mapper;

import com.ffg.backend.dto.DashboardFraudRowDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface DashboardMapper {

  List<DashboardFraudRowDto> selectFraudRowsByBankCode(@Param("bankCode") String bankCode);
}