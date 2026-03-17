package com.ffg.backend.mapper;

import com.ffg.backend.dto.CustomerDetailCustomerDto;
import com.ffg.backend.dto.CustomerTransactionDto;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface CustomerDetailMapper {

  CustomerDetailCustomerDto selectCustomerInfo(
      @Param("bankCode") String bankCode,
      @Param("userId") String userId
  );

  CustomerTransactionDto selectCurrentTransaction(
      @Param("bankCode") String bankCode,
      @Param("userId") String userId,
      @Param("txId") Long txId
  );

  List<CustomerTransactionDto> selectRecentTransactions(
      @Param("bankCode") String bankCode,
      @Param("userId") String userId
  );

  Map<String, Object> selectSummary(
      @Param("bankCode") String bankCode,
      @Param("userId") String userId
  );
}